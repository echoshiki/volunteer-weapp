import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	addOrderTrajectoryAPI,
	createServiceOrderAPI,
	getEmployerOrdersAPI,
	getOrderDetailAPI,
	getOrderTrajectoryListAPI,
	getProviderOrdersAPI,
	updateOrderStatusAPI,
} from '@/services/order';
import Taro from '@tarojs/taro';
import { mapsTo } from '@/utils/common';
import { getTenantId } from '@/utils/tenant';
import { OrderStatus, UnifiedOrderItem } from '@/types/order';

/** 下单 */
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

/** 需求方订单列表 */
export const useEmployerOrderList = (status?: OrderStatus | 'all') => {
	const requestStatus = status === 'all' ? undefined : status;
	return useInfiniteQuery({
		queryKey: ['order', 'employer', 'list', requestStatus],
		queryFn: ({ pageParam = 1 }) =>
			getEmployerOrdersAPI({ pageNum: pageParam, pageSize: 10, status: requestStatus }),
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
	});
};

/** 服务方订单列表 */
export const useProviderOrderList = (status?: OrderStatus | 'all') => {
	const requestStatus = status === 'all' ? undefined : status;
	return useInfiniteQuery({
		queryKey: ['order', 'provider', 'list', requestStatus],
		queryFn: ({ pageParam = 1 }) =>
			getProviderOrdersAPI({ pageNum: pageParam, pageSize: 10, status: requestStatus }),
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
	});
};

/** 订单详情 */
export const useOrderDetail = (orderId: string) => {
	return useQuery({
		queryKey: ['order', 'detail', orderId],
		queryFn: () => getOrderDetailAPI(orderId),
		enabled: !!orderId,
	});
};

/** 订单状态轨迹列表 */
export const useOrderTrajectoryList = (orderId: string) => {
	return useQuery({
		queryKey: ['order', 'trajectory', 'list', orderId],
		queryFn: () => getOrderTrajectoryListAPI({ orderId }),
		enabled: !!orderId,
	});
};

/** 统一管理订单履约动作的 Hook 组合 */
export const useOrderActions = (order?: UnifiedOrderItem) => {
	const queryClient = useQueryClient();

	// 服务方打卡判定
	const needArrivePunch = order ? order.status === 'paid' : false;
	const needCompletePunch = order ? order.status === 'serving' : false;

	// 公共成功回调：刷新当前详情及双端列表
	const refreshOrderCache = () => {
		queryClient.invalidateQueries({ queryKey: ['order'] });
	};

	// 确认、取消订单
	const updateStatus = useMutation({
		mutationFn: updateOrderStatusAPI,
		onSuccess: (_, variables) => {
			const successMsg = variables.status === 'reviewing' ? '验收放款成功！' : '订单已取消';
			Taro.showToast({ title: successMsg, icon: 'success' });
			refreshOrderCache();
		},
		onError: (err: any) => Taro.showToast({ title: err?.message || '操作失败', icon: 'none' }),
	});

	// 服务方提交服务轨迹（到场、完工）
	const submitTrajectory = useMutation({
		mutationFn: addOrderTrajectoryAPI,
		onSuccess: (_, variables) => {
			const successMsg =
				variables.status === 'arrived'
					? '到场打卡成功，服务开始'
					: '完工提交成功，等待雇主验收';
			Taro.showToast({ title: successMsg, icon: 'success' });
			refreshOrderCache();
		},
		onError: (err: any) => Taro.showToast({ title: err?.message || '打卡失败', icon: 'none' }),
	});

	// 线上微信支付
	const runWechatPay = useMutation({
		// mutationFn: () => getOrderPayParamsAPI(orderId),
		// onSuccess: async (payParams: any) => {
		//     try {
		//         // 调起微信原生支付
		//         await Taro.requestPayment({
		//             timeStamp: payParams.timeStamp,
		//             nonceStr: payParams.nonceStr,
		//             package: payParams.package,
		//             signType: payParams.signType,
		//             paySign: payParams.paySign,
		//         });
		//         Taro.showToast({ title: '支付成功', icon: 'success' });
		//         refreshCache();
		//     } catch (err) {
		//         Taro.showToast({ title: '支付已取消或失败', icon: 'none' });
		//     }
		// }
	});

	return {
		needArrivePunch,
		needCompletePunch,
		updateStatus,
		submitTrajectory,
		runWechatPay,
		isActionLoading: updateStatus.isLoading || runWechatPay.isLoading,
	};
};
