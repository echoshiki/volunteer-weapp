import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
	getActivityCategoryListAPI,
	getActivityListAPI,
	getActivityDetailAPI,
} from '@/services/activity';

/** 分类列表 Hook */
export const useActivityCategories = () => {
	return useQuery({
		queryKey: ['activity', 'categories'],
		queryFn: getActivityCategoryListAPI,
	});
};

/** 活动列表 Hook (支持无限滚动) */
export const useActivities = (params: { categoryId?: number; keyword?: string }) => {
	return useInfiniteQuery({
		queryKey: ['activity', 'list', params],
		queryFn: ({ pageParam = 1 }) =>
			getActivityListAPI({ ...params, page: pageParam, limit: 10 }),
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
