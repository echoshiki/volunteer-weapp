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
import { getTenantId } from '@/utils/tenant';

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
export const useActivityList = (params: Partial<Omit<ActivityListParams, 'pageNum'>>) => {
	return useInfiniteQuery({
		queryKey: ['tenant', getTenantId(), 'activity', 'list', params],
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
		queryKey: ['tenant', getTenantId(), 'activity', 'detail', id],
		queryFn: () => getActivityDetailAPI(id),
		enabled: !!id,
	});
};

/** 报名活动 Hook */
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

/**
 * 获取我的志愿活动列表 (无限滚动)
 */
export const useActivityRecordList = () => {
	return useInfiniteQuery({
		queryKey: ['user', 'activity'],
		queryFn: ({ pageParam = 1 }) => getActivityRecordListApi(pageParam),
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
	});
};

/**
 * 活动签到签退
 */
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
