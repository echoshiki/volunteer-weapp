import { useInfiniteQuery } from '@tanstack/react-query';
import { getArticleListAPI } from '@/services/article';

/**
 * Query - 文章列表无限滚动
 */
export const useAuditArticleList = (pageSize = 10) => {
	return useInfiniteQuery({
		queryKey: ['article', 'list'],
		queryFn: ({ pageParam = 1 }) => getArticleListAPI({ pageNum: pageParam, pageSize }),
		getNextPageParam: (lastPage) => {
			return lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined;
		},
	});
};
