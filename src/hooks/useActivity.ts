import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
	getActivityCategoryListAPI,
	getActivityListAPI,
	getActivityDetailAPI,
	ActivityListParams,
} from '@/services/activity';

/** 分类列表 Hook */
export const useActivityCategories = () => {
	return useQuery({
		queryKey: ['activity', 'categories'],
		queryFn: getActivityCategoryListAPI,
	});
};

/**
 * 活动列表 Hook (支持无限滚动)
 * @param params - 使用 Partial 和 Omit，剔除 pageNum，并将剩余参数设为可选
 */
export const useActivities = (params: Partial<Omit<ActivityListParams, 'pageNum'>>) => {
	return useInfiniteQuery({
		queryKey: ['activity', 'list', params],
		queryFn: ({ pageParam = 1 }) =>
			getActivityListAPI({
				...params,
				pageNum: pageParam,
				pageSize: params.pageSize || 10,
			}),
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
	});
};

/** 活动详情 Hook */
export const useActivityDetail = (id: string | number) => {
	return useQuery({
		queryKey: ['activity', 'detail', id],
		queryFn: () => getActivityDetailAPI(id),
		enabled: !!id,
	});
};
