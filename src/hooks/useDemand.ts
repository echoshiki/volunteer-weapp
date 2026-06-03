import { useQuery, useInfiniteQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
	getDemandCategoryListAPI,
	getDemandTagListAPI,
	getDemandListAPI,
	getDemandDetailAPI,
	getServiceUserListAPI,
	GetDemandListRequest,
	getUserDemandListAPI,
	publishDemandAPI,
	PublishDemandRequest,
	editDemandAPI,
} from '@/services/demand';
import { getTenantId } from '@/utils/tenant';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { DemandCategory } from '@/types/demand';

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

/** 抢单用户列表 Hook (支持无限滚动) */
export const useServiceUsers = (demandId: number) => {
	return useInfiniteQuery({
		queryKey: ['tenant', getTenantId(), 'demand', 'serviceUsers', demandId],
		queryFn: ({ pageParam = 1 }) =>
			getServiceUserListAPI({
				demandId,
				pageNum: pageParam,
				pageSize: 10,
			}),
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
		enabled: !!demandId,
	});
};

/** 我的需求单列表 Hook (无限滚动) */
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

export const useDemandForm = (
	initial?: Partial<PublishDemandRequest> & { tenantName?: string },
	categoryList: DemandCategory[] = [],
) => {
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
		...initial,
	});

	// 动态计算初始的 categoryIndex
	const [categoryIndex, setCategoryIndex] = useState<number | undefined>(() => {
		if (!initial?.categoryId || !categoryList.length) return undefined;
		const index = categoryList.findIndex((c) => c.categoryId === initial.categoryId);
		return index >= 0 ? index : undefined;
	});

	const [regionLabel, setRegionLabel] = useState(
		initial?.tenantName || (initial ? '已选当前区域' : ''),
	);

	const handleInput = (field: keyof PublishDemandRequest, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const toggleTag = (id: number) => {
		setFormData((prev) => {
			const tags = prev.tagIds || [];
			return {
				...prev,
				tagIds: tags.includes(id) ? tags.filter((t) => t !== id) : [...tags, id],
			};
		});
	};

	const handleTenantChange = (
		tenantId: number,
		tenantName: string,
		pCode: number,
		cCode: number,
		dCode: number,
	) => {
		setFormData((prev) => ({
			...prev,
			tenantId,
			provinceCode: pCode,
			cityCode: cCode,
			districtCode: dCode,
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
				formData.charge === false &&
					(!formData.minMoney ||
						!formData.maxMoney ||
						formData.minMoney > formData.maxMoney),
				'请填写正确的预算区间',
			],
		];
		return rules.find(([invalid]) => invalid)?.[1] ?? null;
	};

	return {
		formData,
		categoryIndex,
		setCategoryIndex,
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
		mutationFn: editDemandAPI,
		onSuccess: () => {
			Taro.showToast({ title: '修改成功', icon: 'success' });
			// 刷新列表和详情缓存
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
