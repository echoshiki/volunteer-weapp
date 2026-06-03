import { useQuery, useInfiniteQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
	getDemandCategoryListAPI,
	getDemandTagListAPI,
	getDemandListAPI,
	getDemandDetailAPI,
	getServiceUserListAPI,
	GetDemandListRequest,
	getUserDemandListAPI,
	publishDemandAPI,
	PublishDemandRequest,
} from '@/services/demand';
import { getTenantId } from '@/utils/tenant';
import Taro from '@tarojs/taro';
import { useState } from 'react';

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
export const useDemandList = (params: Omit<GetDemandListRequest, 'pageNum' | 'pageSize'>) => {
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

/** 我的需求单列表 Hook (无限滚动) */
export const useUserDemandList = () => {
	return useInfiniteQuery({
		queryKey: ['user', 'demand', 'list'],
		queryFn: ({ pageParam = 1 }) =>
			getUserDemandListAPI({
				pageNum: pageParam,
				pageSize: 10,
			}),
		// 根据后端返回的 page 和 totalPage 控制下一页
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
	});
};

/** 发布需求单 Hook */
export const usePublishDemand = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: publishDemandAPI,
		onSuccess: () => {
			Taro.showToast({ title: '发布成功', icon: 'success' });
			queryClient.invalidateQueries({ queryKey: ['demand', 'list'] });

			setTimeout(() => {
				Taro.navigateBack();
			}, 1500);
		},
		onError: (err: any) => {
			Taro.showToast({ title: err?.message || '发布失败', icon: 'none' });
		},
	});
};
