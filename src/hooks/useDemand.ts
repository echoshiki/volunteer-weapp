import { useQuery, useInfiniteQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
	getDemandCategoryListAPI,
	getDemandTagListAPI,
	getDemandListAPI,
	getDemandDetailAPI,
	getDemandBidListAPI,
	GetDemandListRequest,
	getUserDemandListAPI,
	publishDemandAPI,
	PublishDemandRequest,
	updateDemandAPI,
	bidDemandAPI,
	getMyBidsAPI,
	updateBidAPI,
	BidDemandRequest,
} from '@/services/demand';
import { getTenantId } from '@/utils/tenant';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { DemandCategory, DemandItem, MyBidItem } from '@/types/demand';
import { TenantChangeEventProps } from '@/components/biz/TenantPicker';

/** 服务对象分类列表 Hook */
export const useDemandCategoryList = () => {
	return useQuery({
		queryKey: ['demand', 'categories'],
		queryFn: async () => {
			const res = await getDemandCategoryListAPI();
			return res.list;
		},
	});
};

/** 需求标签列表 Hook (支持级联筛选) */
export const useDemandTags = () => {
	return useQuery({
		queryKey: ['demand', 'tags'],
		queryFn: async () => {
			const res = await getDemandTagListAPI();
			return res.list;
		},
	});
};

/** 需求单列表 Hook (无限滚动) */
export const useDemandList = (params: Omit<GetDemandListRequest, 'pageNum' | 'pageSize'>) => {
	return useInfiniteQuery({
		queryKey: ['tenant', getTenantId(), 'demand', 'list', params],
		queryFn: ({ pageParam = 1 }) =>
			getDemandListAPI({
				...params,
				pageNum: pageParam,
				pageSize: 10,
			}),
		// 根据后端返回的 page 和 totalPage 控制下一页
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
	});
};

/** 需求单详情 Hook */
export const useDemandDetail = (demandId: number) => {
	return useQuery({
		queryKey: ['tenant', getTenantId(), 'demand', 'detail', demandId],
		queryFn: () => getDemandDetailAPI(demandId),
		enabled: !!demandId,
	});
};

/** 需求单报价列表 Hook (支持无限滚动) */
export const useDemandBidList = (demandId: number) => {
	return useInfiniteQuery({
		queryKey: ['tenant', getTenantId(), 'demand', 'bid', demandId],
		queryFn: ({ pageParam = 1 }) =>
			getDemandBidListAPI({
				demandId,
				pageNum: pageParam,
				pageSize: 10,
			}),
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
		enabled: !!demandId,
	});
};

/** 服务方的需求单列表 Hook (无限滚动) */
export const useUserDemandList = () => {
	return useInfiniteQuery({
		queryKey: ['user', 'demand', 'list'],
		queryFn: ({ pageParam = 1 }) =>
			getUserDemandListAPI({
				pageNum: pageParam,
				pageSize: 10,
			}),
		// 根据后端返回的 page 和 totalPage 控制下一页
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
	});
};

/** 需求表单 */
export const useDemandForm = (initial?: DemandItem, categoryList: DemandCategory[] = []) => {
	// 详情数据作为初始数据需要进行结构转换才能用于提交
	const [formData, setFormData] = useState<Partial<PublishDemandRequest>>({
		demandName: '',
		content: '',
		address: '',
		name: '',
		phone: '',
		emergencyCall: '',
		tagIds: [],
		minMoney: 0,
		maxMoney: 0,
		...(initial && {
			...initial,
			// 将详情数据转换成可提交的类型格式
			tagIds: initial.tags.map((t) => t.tagId),
		}),
	});

	const handleInput = (field: keyof PublishDemandRequest, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	// 回显服务区域信息
	const [regionLabel, setRegionLabel] = useState(initial?.tenantName ?? '');

	// 选择标签
	const toggleTag = (id: number) => {
		setFormData((prev) => {
			const tags = prev.tagIds || [];
			return {
				...prev,
				tagIds: tags.includes(id) ? tags.filter((t) => t !== id) : [...tags, id],
			};
		});
	};

	const handleTenantChange = ({
		tenantId,
		tenantName,
		provinceCode,
		cityCode,
		districtCode,
	}: TenantChangeEventProps) => {
		setFormData((prev) => ({
			...prev,
			tenantId,
			provinceCode,
			cityCode,
			districtCode,
		}));
		setRegionLabel(tenantName);
	};

	const validate = (): string | null => {
		const rules: [boolean, string][] = [
			[!formData.demandName, '请输入需求名称'],
			[!formData.categoryId, '请选择服务对象'],
			[!formData.tagIds?.length, '请至少选择一个标签'],
			[(formData.tagIds?.length ?? 0) > 5, '标签最多选择5个'],
			[!formData.tenantId, '请选择服务区域'],
			[!formData.address, '请输入详细地址'],
			[!formData.name || !formData.phone, '请填写联系人及电话'],
			[!formData.content, '请输入需求描述'],
			[
				!formData.minMoney || !formData.maxMoney || formData.minMoney > formData.maxMoney,
				'请填写正确的预算区间',
			],
		];
		return rules.find(([invalid]) => invalid)?.[1] ?? null;
	};

	return {
		formData,
		regionLabel,
		handleInput,
		toggleTag,
		handleTenantChange,
		validate,
	};
};

/** 发布需求单 Hook */
export const usePublishDemand = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: publishDemandAPI,
		onSuccess: () => {
			Taro.showToast({ title: '发布成功', icon: 'success' });
			queryClient.invalidateQueries({
				queryKey: ['tenant', getTenantId(), 'demand', 'list'],
			});

			setTimeout(() => Taro.navigateBack(), 1500);
		},
		onError: (err: any) => {
			Taro.showToast({ title: err?.message || '发布失败', icon: 'none' });
		},
	});
};

/** 编辑需求单 Hook */
export const useEditDemand = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateDemandAPI,
		onSuccess: () => {
			Taro.showToast({ title: '修改成功', icon: 'success' });
			queryClient.invalidateQueries({
				queryKey: ['tenant', getTenantId(), 'demand', 'list'],
			});
			queryClient.invalidateQueries({
				queryKey: ['tenant', getTenantId(), 'demand', 'detail'],
			});
			setTimeout(() => Taro.navigateBack(), 1500);
		},
		onError: (err: any) => {
			Taro.showToast({ title: err?.message || '修改失败', icon: 'none' });
		},
	});
};

/** 创建报价单 */
export const useDemandBid = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: bidDemandAPI,
		onSuccess: () => {
			Taro.showToast({ title: '报价提交成功', icon: 'success' });
			queryClient.invalidateQueries({
				queryKey: ['tenant', getTenantId(), 'demand'],
			});
			setTimeout(() => {
				Taro.navigateBack();
			}, 1500);
		},
		onError: (err: any) => {
			Taro.showToast({ title: err?.message || '提交失败', icon: 'none' });
		},
	});
};

/** 获取我的报价单列表 Hook (无限滚动) */
export const useMyBidList = () => {
	return useInfiniteQuery({
		queryKey: ['user', 'bid', 'list'],
		queryFn: ({ pageParam = 1 }) => getMyBidsAPI({ pageNum: pageParam, pageSize: 10 }),
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
	});
};

/** 修改报价单 */
export const useUpdateBid = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateBidAPI,
		onSuccess: () => {
			Taro.showToast({ title: '修改成功', icon: 'success' });
			queryClient.invalidateQueries({ queryKey: ['user', 'bid', 'list'] });
			setTimeout(() => {
				Taro.navigateBack();
			}, 1500);
		},
		onError: (err: any) => {
			Taro.showToast({ title: err?.message || '修改失败', icon: 'none' });
		},
	});
};

/** 报价表单 */
export const useBidForm = (initial?: MyBidItem, isFree: boolean = false) => {
	const [formData, setFormData] = useState<Partial<BidDemandRequest>>({
		name: '',
		phone: '',
		money: isFree ? 0 : undefined,
		description: '',
		...initial,
	});

	const handleInput = (field: keyof BidDemandRequest, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const validate = (): string | null => {
		const { name, phone, money, description } = formData;

		if (!name?.trim()) return '请填写联系人姓名';
		if (!phone?.trim()) return '请填写联系电话';
		if (!/^1[3-9]\d{9}$/.test(phone)) return '手机号格式有误';

		if (!isFree) {
			if (money === undefined || Number(money) < 0) {
				return '请填写合理的报价金额';
			}
		}

		if (!description?.trim()) return '请填写服务描述与优势';

		return null;
	};

	return {
		formData,
		handleInput,
		validate,
	};
};
