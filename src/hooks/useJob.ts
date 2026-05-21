import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
	getJobCategoryListAPI,
	getJobListAPI,
	getJobDetailAPI,
	getEnterpriseListAPI,
	getEnterpriseDetailAPI,
	JobListParams,
	EnterpriseListParams,
} from '@/services/job';

/** 岗位分类列表 Hook */
export const useJobCategories = () => {
	return useQuery({
		queryKey: ['job', 'categories'],
		queryFn: async () => {
			const res = await getJobCategoryListAPI();
			return res.list;
		},
	});
};

/** 岗位列表 Hook (无限滚动) */
export const useJobList = (params: Omit<JobListParams, 'pageNum'>) => {
	return useInfiniteQuery({
		queryKey: ['job', 'list', params],
		queryFn: ({ pageParam = 1 }) =>
			getJobListAPI({
				...params,
				pageNum: pageParam,
				pageSize: params.pageSize || 10,
			}),
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
	});
};

/** 岗位详情 Hook */
export const useJobDetail = (id: number | string) => {
	return useQuery({
		queryKey: ['job', 'detail', id],
		queryFn: () => getJobDetailAPI(id),
		enabled: !!id,
	});
};

/** 企业列表 Hook (无限滚动) */
export const useEnterpriseList = (params: Omit<EnterpriseListParams, 'pageNum'>) => {
	return useInfiniteQuery({
		queryKey: ['job', 'list', params],
		queryFn: ({ pageParam = 1 }) =>
			getEnterpriseListAPI({
				...params,
				pageNum: pageParam,
				pageSize: params.pageSize || 10,
			}),
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
	});
};

/** 企业详情 Hook */
export const useEnterpriseDetail = (enterprisesId: number | string) => {
	return useQuery({
		queryKey: ['enterprise', 'detail', enterprisesId],
		queryFn: () => getEnterpriseDetailAPI(enterprisesId),
		enabled: !!enterprisesId,
	});
};
