import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
	getDemandCategoryListAPI,
	getDemandTagListAPI,
	getDemandListAPI,
	getDemandDetailAPI,
	getServiceUserListAPI,
	DemandListParams,
} from '@/services/demand';
import { getTenantId } from '@/utils/tenant';

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
export const useDemandList = (params: Omit<DemandListParams, 'pageNum' | 'pageSize'>) => {
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
