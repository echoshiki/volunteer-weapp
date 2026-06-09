import Taro from '@tarojs/taro';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	getActivityCategoryListAPI,
	getActivityListAPI,
	getActivityDetailAPI,
	enrollActivityAPI,
	getActivityRecordListApi,
	checkActivityAPI,
	ActivityListParams,
	CheckActivityParams,
} from '@/services/activity';
import { enabledWithTenant, tenantKey } from '@/utils/tenant';

/** Query - 分类列表 */
export const useActivityCategories = () => {
	return useQuery({
		queryKey: ['activity', 'categories'],
		queryFn: getActivityCategoryListAPI,
	});
};

/** Query - 活动列表 */
export const useActivityList = (params: Partial<Omit<ActivityListParams, 'pageNum'>>) => {
	return useInfiniteQuery({
		queryKey: [...tenantKey(), 'activity', 'list', params],
		queryFn: ({ pageParam = 1 }) =>
			getActivityListAPI({
				...params,
				pageNum: pageParam,
				pageSize: params.pageSize || 10,
			}),
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
		enabled: enabledWithTenant(),
	});
};

/** Query - 活动详情 */
export const useActivityDetail = (id: string | number) => {
	return useQuery({
		queryKey: [...tenantKey(), 'activity', 'detail', id],
		queryFn: () => getActivityDetailAPI(id),
		enabled: enabledWithTenant(!!id),
	});
};

/** Query - 用户活动列表 */
export const useActivityRecordList = () => {
	return useInfiniteQuery({
		queryKey: ['user', 'activity'],
		queryFn: ({ pageParam = 1 }) => getActivityRecordListApi(pageParam),
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
	});
};

/** Mutation - 活动报名 */
export const useEnrollActivity = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (activityId: number) => enrollActivityAPI(activityId),
		onSuccess: (res, activityId) => {
			Taro.showToast({
				title: '报名成功',
				icon: 'success',
			});

			// 更新报名人数
			queryClient.invalidateQueries({
				queryKey: ['activity', 'detail', String(activityId)],
			});
		},
		onError: (err: any) => {
			// 截止/满员/已报名
			Taro.showToast({
				title: err?.message || '报名失败，请重试',
				icon: 'none',
			});
		},
	});
};

/** Mutation - 用户签到/签退 */
export const useCheckActivity = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (params: CheckActivityParams) => checkActivityAPI(params),
		onSuccess: () => {
			// 打卡成功后，立刻使“我的活动列表”和“活动详情”缓存失效
			queryClient.invalidateQueries({ queryKey: ['user', 'activity'] });
			queryClient.invalidateQueries({ queryKey: ['activityDetail'] });
		},
	});
};
