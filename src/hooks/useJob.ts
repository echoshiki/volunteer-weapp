import { useQuery, useInfiniteQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
	getJobCategoryListAPI,
	getJobListAPI,
	getJobDetailAPI,
	getEnterpriseListAPI,
	getEnterpriseDetailAPI,
	JobListParams,
	EnterpriseListParams,
	getResumeDetailAPI,
	addResumeAPI,
	updateResumeAPI,
	getAppliedJobListAPI,
	deliverJobAPI,
} from '@/services/job';
import { enabledWithTenant, tenantKey } from '@/utils/tenant';
import Taro from '@tarojs/taro';
import { delayBack, showErrorToast } from '@/utils/common';

/** Query：岗位分类列表 */
export const useJobCategories = () => {
	return useQuery({
		queryKey: ['job', 'categories'],
		queryFn: async () => {
			const res = await getJobCategoryListAPI();
			return res.list;
		},
	});
};

/** Query：岗位列表 */
export const useJobList = (params: Omit<JobListParams, 'pageNum'>) => {
	return useInfiniteQuery({
		queryKey: [...tenantKey(), 'job', 'list', params],
		queryFn: ({ pageParam = 1 }) =>
			getJobListAPI({
				...params,
				pageNum: pageParam,
				pageSize: params.pageSize || 10,
			}),
		getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined),
		enabled: enabledWithTenant(),
	});
};

/** Query：岗位详情 */
export const useJobDetail = (id: number | string) => {
	return useQuery({
		queryKey: [...tenantKey(), 'job', 'detail', id],
		queryFn: () => getJobDetailAPI(id),
		enabled: enabledWithTenant(!!id),
	});
};

/** Query：企业列表 */
export const useEnterpriseList = (params: Omit<EnterpriseListParams, 'pageNum'>) => {
	return useInfiniteQuery({
		queryKey: [...tenantKey(), 'enterprise', 'list', params],
		queryFn: ({ pageParam = 1 }) =>
			getEnterpriseListAPI({
				...params,
				pageNum: pageParam,
				pageSize: params.pageSize || 10,
			}),
		getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined),
		enabled: enabledWithTenant(),
	});
};

/** Query：企业详情 */
export const useEnterpriseDetail = (enterprisesId: number | string) => {
	return useQuery({
		queryKey: [...tenantKey(), 'enterprise', 'detail', enterprisesId],
		queryFn: () => getEnterpriseDetailAPI(enterprisesId),
		enabled: enabledWithTenant(!!enterprisesId),
	});
};

/** Query：获取简历详情 */
export const useResumeDetail = () => {
	return useQuery({
		queryKey: ['resume', 'detail'],
		queryFn: () => getResumeDetailAPI(),
		retry: false,
		staleTime: 5 * 60 * 1000,
	});
};

/** Mutation：管理简历创建、修改与投递历史动作 */
export const useResumeActions = () => {
	const queryClient = useQueryClient();

	// 动作：新建简历
	const createResume = useMutation({
		mutationFn: addResumeAPI,
		onSuccess: () => {
			Taro.showToast({ title: '简历创建成功', icon: 'success' });
			queryClient.invalidateQueries({ queryKey: ['resume'] });
			delayBack();
		},
		onError: (err) => showErrorToast(err, '创建失败'),
	});

	// 动作：投递简历
	const deliverJob = useMutation({
		mutationFn: deliverJobAPI,
		onSuccess: () => {
			Taro.showToast({ title: '岗位投递成功！', icon: 'success' });
			queryClient.invalidateQueries({ queryKey: ['resume', 'applied', 'list'] });
		},
		onError: (err) => showErrorToast(err, '投递失败，请稍后再试'),
	});

	// 动作：修改简历
	const updateResume = useMutation({
		mutationFn: updateResumeAPI,
		onSuccess: (res, variables) => {
			Taro.showToast({ title: '简历修改成功', icon: 'success' });
			queryClient.invalidateQueries({ queryKey: ['resume', 'detail'] });
			delayBack();
		},
		onError: (err) => showErrorToast(err, '修改失败'),
	});

	return {
		createResume,
		deliverJob,
		updateResume,
		isActionPending: createResume.isLoading || deliverJob.isLoading || updateResume.isLoading,
	};
};

/** Query：已投递岗位历史列表（无限滚动） */
export const useAppliedJobList = () => {
	return useInfiniteQuery({
		queryKey: [...tenantKey(), 'resume', 'applied', 'list'],
		queryFn: ({ pageParam = 1 }) => getAppliedJobListAPI({ pageNum: pageParam, pageSize: 10 }),
		getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined),
		enabled: enabledWithTenant(),
	});
};
