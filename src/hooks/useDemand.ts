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
	deleteDemandAPI,
} from '@/services/demand';
import { enabledWithTenant, tenantKey } from '@/utils/tenant';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { DemandCategory, DemandItem, MyBidItem } from '@/types/demand';
import { TenantChangeEventProps } from '@/components/biz';
import { delayBack, showErrorToast } from '@/utils/common';

/** Query - 服务对象分类列表 */
export const useDemandCategoryList = () => {
	return useQuery({
		queryKey: ['demand', 'categories'],
		queryFn: async () => {
			const res = await getDemandCategoryListAPI();
			return res.list;
		},
	});
};

/** Query - 需求标签列表 */
export const useDemandTags = () => {
	return useQuery({
		queryKey: ['demand', 'tags'],
		queryFn: async () => {
			const res = await getDemandTagListAPI();
			return res.list;
		},
	});
};

/** Query - 需求单列表 */
export const useDemandList = (params: Omit<GetDemandListRequest, 'pageNum' | 'pageSize'>) => {
	return useInfiniteQuery({
		queryKey: [...tenantKey(), 'demand', 'list', params],
		queryFn: ({ pageParam = 1 }) =>
			getDemandListAPI({
				...params,
				pageNum: pageParam,
				pageSize: 10,
			}),
		// 根据后端返回的 page 和 totalPage 控制下一页
		getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined),
		enabled: enabledWithTenant(),
	});
};

/** Query - 需求单详情 */
export const useDemandDetail = (demandId: number) => {
	return useQuery({
		queryKey: [...tenantKey(), 'demand', 'detail', demandId],
		queryFn: () => getDemandDetailAPI(demandId),
		enabled: enabledWithTenant(!!demandId),
	});
};

/** Query - 需求单报价列表 */
export const useDemandBidList = (demandId: number) => {
	return useInfiniteQuery({
		queryKey: [...tenantKey(), 'demand', 'bid', demandId],
		queryFn: ({ pageParam = 1 }) =>
			getDemandBidListAPI({
				demandId,
				pageNum: pageParam,
				pageSize: 10,
			}),
		getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined),
		enabled: enabledWithTenant(!!demandId),
	});
};

/** Query - 用户需求单列表 */
export const useUserDemandList = () => {
	return useInfiniteQuery({
		queryKey: ['user', 'demand', 'list'],
		queryFn: ({ pageParam = 1 }) =>
			getUserDemandListAPI({
				pageNum: pageParam,
				pageSize: 10,
			}),
		// 根据后端返回的 page 和 totalPage 控制下一页
		getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined),
	});
};

/** Hook - 需求表单 */
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
			[!formData.minMoney || !formData.maxMoney || formData.minMoney > formData.maxMoney, '请填写正确的预算区间'],
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

/** Mutation - 发布需求单 */
export const usePublishDemand = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: publishDemandAPI,
		onSuccess: () => {
			Taro.showToast({ title: '发布成功', icon: 'success' });
			queryClient.invalidateQueries({ queryKey: [...tenantKey(), 'demand', 'list'] });
			queryClient.invalidateQueries({ queryKey: ['user', 'demand', 'list'] });
			delayBack();
		},
		onError: (err) => showErrorToast(err, '发布失败'),
	});
};

/** Mutation - 编辑需求单 */
export const useEditDemand = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateDemandAPI,
		onSuccess: () => {
			Taro.showToast({ title: '修改成功', icon: 'success' });
			queryClient.invalidateQueries({ queryKey: [...tenantKey(), 'demand', 'list'] });
			queryClient.invalidateQueries({ queryKey: [...tenantKey(), 'demand', 'detail'] });
			queryClient.invalidateQueries({ queryKey: ['user', 'demand', 'list'] });
			delayBack();
		},
		onError: (err) => showErrorToast(err, '修改失败'),
	});
};

/** Mutation - 删除需求单 */
export const useDeleteDemand = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (demandId: number) => deleteDemandAPI(demandId),
		onSuccess: () => {
			Taro.hideLoading();
			Taro.showToast({ title: '删除成功', icon: 'success' });
			queryClient.invalidateQueries({ queryKey: [...tenantKey(), 'demand', 'list'] });
			queryClient.invalidateQueries({ queryKey: [...tenantKey(), 'demand', 'detail'] });
			queryClient.invalidateQueries({ queryKey: ['user', 'demand', 'list'] });
		},
		onError: (err: any) => {
			Taro.hideLoading();
			showErrorToast(err, '删除失败');
		},
	});
};

/** Query - 我的报价单列表 */
export const useMyBidList = () => {
	return useInfiniteQuery({
		queryKey: ['user', 'bid', 'list'],
		queryFn: ({ pageParam = 1 }) => getMyBidsAPI({ pageNum: pageParam, pageSize: 10 }),
		getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined),
	});
};

/** Mutation - 创建报价单 */
export const useDemandBid = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: bidDemandAPI,
		onSuccess: () => {
			Taro.showToast({ title: '报价提交成功', icon: 'success' });
			queryClient.invalidateQueries({ queryKey: [...tenantKey(), 'demand'] });
			queryClient.invalidateQueries({ queryKey: ['user', 'bid', 'list'] });
			delayBack();
		},
		onError: (err) => showErrorToast(err, '报价失败'),
	});
};

/** Mutation - 修改报价单 */
export const useUpdateBid = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateBidAPI,
		onSuccess: () => {
			Taro.showToast({ title: '修改成功', icon: 'success' });
			queryClient.invalidateQueries({ queryKey: ['user', 'bid', 'list'] });
			delayBack();
		},
		onError: (err) => showErrorToast(err, '发布失败'),
	});
};

/** Hook - 报价表单 */
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
		const rules: [boolean, string][] = [
			[!name?.trim(), '请填写联系人姓名'],
			[!phone?.trim(), '请填写联系电话'],
			[!/^1[3-9]\d{9}$/.test(phone ?? ''), '手机号格式有误'],
			[!isFree && (money === undefined || Number(money) < 0), '请填写合理的报价金额'],
			[!description?.trim(), '请填写服务描述与优势'],
		];
		return rules.find(([invalid]) => invalid)?.[1] ?? null;
	};

	return {
		formData,
		handleInput,
		validate,
	};
};
