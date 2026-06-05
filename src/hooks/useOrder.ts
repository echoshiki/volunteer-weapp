import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	createServiceOrderAPI,
	getEmployerOrdersAPI,
	getProviderOrdersAPI,
} from '@/services/order';
import Taro from '@tarojs/taro';
import { mapsTo } from '@/utils/common';
import { getTenantId } from '@/utils/tenant';

export const useCreateServiceOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createServiceOrderAPI,
		onSuccess: (res: any) => {
			Taro.showToast({ title: '服务订单已生成', icon: 'success' });
			// 刷新需求单数据
			queryClient.invalidateQueries({
				queryKey: ['tenant', getTenantId(), 'demand'],
			});

			// 刷新服务方的报价单列表
			queryClient.invalidateQueries({
				queryKey: ['user', 'bid', 'list'],
			});
			setTimeout(() => {
				mapsTo(`/pages/order/detail/index?id=${res.orderId}`, 'redirectTo');
			}, 1500);
		},
		onError: (err: any) => {
			Taro.showToast({ title: err?.message || '订单创建失败，请重试', icon: 'none' });
		},
	});
};

/** Hook：需求方订单列表 */
export const useEmployerOrderList = () => {
	return useInfiniteQuery({
		queryKey: ['order', 'employer', 'list'],
		queryFn: ({ pageParam = 1 }) => getEmployerOrdersAPI({ pageNum: pageParam, pageSize: 10 }),
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
	});
};

/** Hook：服务方订单列表 */
export const useProviderOrderList = () => {
	return useInfiniteQuery({
		queryKey: ['order', 'provider', 'list'],
		queryFn: ({ pageParam = 1 }) => getProviderOrdersAPI({ pageNum: pageParam, pageSize: 10 }),
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
	});
};
