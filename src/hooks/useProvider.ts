import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getProviderOrderListAPI, getProviderProfileAPI } from '@/services/user';

/**
 * 获取并管理公开服务资料主页数据状态 Hook
 */
export const useProviderProfile = (userId: number) => {
	return useQuery({
		queryKey: ['provider', 'public', 'profile', userId],
		queryFn: () => getProviderProfileAPI(userId),
		enabled: !!userId,
		staleTime: 3 * 60 * 1000,
	});
};

/**
 * 获取服务方历史服务单简易列表 (支持无限滚动分页)
 */
export const useProviderOrderList = (userId?: number) => {
	const query = useInfiniteQuery({
		queryKey: ['provider', 'orderList', userId],
		queryFn: ({ pageParam = 1 }) =>
			getProviderOrderListAPI({
				userId,
				pageNum: pageParam,
				pageSize: 10,
			}),
		getNextPageParam: (lastPage) => {
			if (lastPage.page * lastPage.limit < lastPage.total) {
				return lastPage.page + 1;
			}
			return undefined;
		},
		enabled: !!userId,
	});

	const list = query.data?.pages.flatMap((p) => p.list) || [];

	return {
		...query,
		list,
	};
};
