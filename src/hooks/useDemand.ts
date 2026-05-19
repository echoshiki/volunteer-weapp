import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
	getDemandTargetListAPI,
	getDemandTagListAPI,
	getDemandOrderListAPI,
	getDemandOrderDetailAPI,
	getServiceUserListAPI,
	DemandOrderListParams,
} from '@/services/demand';

/** 服务对象分类列表 Hook */
export const useDemandTargets = () => {
	return useQuery({
		queryKey: ['demand', 'targets'],
		queryFn: async () => {
			const res = await getDemandTargetListAPI();
			return res.list; // 直接提取 list 数组
		},
	});
};

/** 需求标签列表 Hook (支持级联筛选) */
export const useDemandTags = (categoryUserId?: number | string) => {
	return useQuery({
		queryKey: ['demand', 'tags', categoryUserId],
		queryFn: async () => {
			const res = await getDemandTagListAPI(categoryUserId ? { categoryUserId } : undefined);
			return res.list;
		},
	});
};

/** 需求订单列表 Hook (无限滚动) */
export const useDemandOrders = (params: Omit<DemandOrderListParams, 'pageNum' | 'pageSize'>) => {
	return useInfiniteQuery({
		queryKey: ['demand', 'orders', params],
		queryFn: ({ pageParam = 1 }) =>
			getDemandOrderListAPI({
				...params,
				pageNum: pageParam,
				pageSize: 10,
			}),
		// 根据后端返回的 page 和 totalPage 控制下一页
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
	});
};

/** 需求详情 Hook */
export const useDemandDetail = (oderId: number | string) => {
	return useQuery({
		queryKey: ['demand', 'detail', oderId],
		queryFn: () => getDemandOrderDetailAPI(oderId),
		enabled: !!oderId,
	});
};

/** 抢单用户列表 Hook (支持无限滚动) */
export const useServiceUsers = (oderId: number | string) => {
	return useInfiniteQuery({
		queryKey: ['demand', 'serviceUsers', oderId],
		queryFn: ({ pageParam = 1 }) =>
			getServiceUserListAPI({
				oderId,
				pageNum: pageParam,
				pageSize: 10,
			}),
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
		enabled: !!oderId,
	});
};
