import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	addOrderTrajectoryAPI,
	createServiceOrderAPI,
	evaluateOrderAPI,
	EvaluateOrderRequest,
	getEmployerOrdersAPI,
	getOrderDetailAPI,
	getOrderPayParamsAPI,
	getOrderTrajectoryListAPI,
	getProviderOrdersAPI,
	queryOrderPayStatusAPI,
	updateOrderStatusAPI,
} from '@/services/order';
import Taro from '@tarojs/taro';
import { delayBack, mapsTo, showErrorToast } from '@/utils/common';
import { tenantKey } from '@/utils/tenant';
import { OrderStatus, UnifiedOrderItem } from '@/types/order';
import { useState } from 'react';

/** 创建订单 */
export const useCreateServiceOrder = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createServiceOrderAPI,
		onSuccess: (res: any) => {
			// 刷新需求单数据、用户需求单列表、报价单列表
			queryClient.invalidateQueries({ queryKey: [...tenantKey(), 'demand'] });
			queryClient.invalidateQueries({ queryKey: ['user', 'demand', 'list'] });
			queryClient.invalidateQueries({ queryKey: ['user', 'bid', 'list'] });
			setTimeout(() => {
				Taro.hideLoading();
				mapsTo(`/pages/order/detail/index?id=${res.orderId}`, 'redirectTo');
			}, 1000);
		},
		onError: (err) => {
			Taro.hideLoading();
			showErrorToast(err, '订单创建失败，请稍后重试');
		},
	});
};

/** 需求方订单列表 */
export const useEmployerOrderList = (status?: OrderStatus | 'all') => {
	const requestStatus = status === 'all' ? undefined : status;
	const query = useInfiniteQuery({
		queryKey: ['order', 'employer', 'list', requestStatus],
		queryFn: ({ pageParam = 1 }) =>
			getEmployerOrdersAPI({ pageNum: pageParam, pageSize: 10, status: requestStatus }),
		getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined),
		staleTime: 0,
	});
	const list = query.data?.pages.flatMap((page) => page.list || []) ?? [];
	return { ...query, list };
};

/** 服务方订单列表 */
export const useProviderOrderList = (status?: OrderStatus | 'all') => {
	const requestStatus = status === 'all' ? undefined : status;
	const query = useInfiniteQuery({
		queryKey: ['order', 'provider', 'list', requestStatus],
		queryFn: ({ pageParam = 1 }) =>
			getProviderOrdersAPI({ pageNum: pageParam, pageSize: 10, status: requestStatus }),
		getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined),
		staleTime: 0,
	});
	const list = query.data?.pages.flatMap((page) => page.list || []) ?? [];
	return { ...query, list };
};

/** 订单详情 */
export const useOrderDetail = (orderId: string) => {
	return useQuery({
		queryKey: ['order', 'detail', orderId],
		queryFn: () => getOrderDetailAPI(orderId),
		enabled: !!orderId,
		staleTime: 0,
	});
};

/** 订单状态轨迹列表 */
export const useOrderTrajectoryList = (orderId: string) => {
	return useQuery({
		queryKey: ['order', 'trajectory', 'list', orderId],
		queryFn: () => getOrderTrajectoryListAPI({ orderId }),
		enabled: !!orderId,
		staleTime: 0,
	});
};

/** 统一管理订单履约动作的 Hook 组合 */
export const useOrderActions = (order?: UnifiedOrderItem) => {
	const queryClient = useQueryClient();
	const currentOrderId = order?.orderId || '';

	// 服务方打卡判定
	const needArrivePunch = order ? order.status === 'paid' : false;
	const needCompletePunch = order ? order.status === 'serving' : false;

	// 公共成功回调：刷新当前详情及双端列表
	const refreshOrderCache = () => {
		queryClient.invalidateQueries({ queryKey: ['order'] });
		queryClient.invalidateQueries({ queryKey: ['user', 'demand', 'list'] });
		queryClient.invalidateQueries({ queryKey: [...tenantKey(), 'demand'] });
	};

	// 轮询订单的支付状态
	const pollOrderPayStatus = async (id: string, counter = 1) => {
		if (counter > 5) {
			Taro.hideLoading();
			refreshOrderCache();
			return;
		}
		try {
			const res = await queryOrderPayStatusAPI(id);
			if (res.return_code === 'SUCCESS' && res.result_code === 'SUCCESS' && res.trade_state === 'SUCCESS') {
				Taro.hideLoading();
				Taro.showToast({ title: '支付成功', icon: 'success' });
				refreshOrderCache();
			} else {
				setTimeout(() => pollOrderPayStatus(id, counter + 1), 1000);
			}
		} catch (err) {
			setTimeout(() => pollOrderPayStatus(id, counter + 1), 1000);
		}
	};

	// 拉起微信支付
	const runWechatPay = useMutation({
		mutationFn: () => {
			if (!currentOrderId) {
				return Promise.reject(new Error('订单号不存在，无法发起支付'));
			}
			return getOrderPayParamsAPI(currentOrderId);
		},
		onSuccess: async (payParams) => {
			try {
				// 唤起微信底层安全收银台
				await Taro.requestPayment({
					timeStamp: payParams.timeStamp,
					nonceStr: payParams.nonceStr,
					package: payParams.package,
					signType: payParams.signType as any,
					paySign: payParams.paySign,
				});
				Taro.showLoading({ title: '核验支付结果...', mask: true });
				await pollOrderPayStatus(currentOrderId);
			} catch (err) {
				const error = err as { errMsg?: string };
				if (error?.errMsg?.includes('cancel')) {
					showErrorToast(err, '支付已取消');
				} else {
					showErrorToast(err, '微信支付失败，请稍后重试');
				}
				refreshOrderCache();
			}
		},
		onError: (err) => showErrorToast(err, '未获取到支付参数，请稍后再试'),
	});

	// 确认、取消订单
	const updateStatus = useMutation({
		mutationFn: updateOrderStatusAPI,
		onSuccess: (_, variables) => {
			const successMsg = variables.status === 'reviewing' ? '验收放款成功！' : '订单已取消';
			Taro.showToast({ title: successMsg, icon: 'success' });
			refreshOrderCache();
		},
		onError: (err) => showErrorToast(err, '操作失败'),
	});

	// 服务方提交服务轨迹（到场、完工）
	const submitTrajectory = useMutation({
		mutationFn: addOrderTrajectoryAPI,
		onSuccess: (_, variables) => {
			const successMsg = variables.status === 'arrived' ? '到场打卡成功，服务开始' : '完工提交成功，等待雇主验收';
			Taro.showToast({ title: successMsg, icon: 'success' });
			refreshOrderCache();
		},
		onError: (err) => showErrorToast(err, '打卡失败，请稍后再试'),
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

/** 评价提交 Mutation Hook */
export const useEvaluateOrder = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: evaluateOrderAPI,
		onSuccess: () => {
			Taro.showToast({ title: '感谢您的评价', icon: 'success' });
			queryClient.invalidateQueries({ queryKey: ['order'] });
			delayBack();
		},
		onError: (err) => showErrorToast(err, '评价发布失败，请稍后再试'),
	});
};

export const useEvaluateForm = (initialOrderId: string) => {
	const [formData, setFormData] = useState<EvaluateOrderRequest>({
		orderId: initialOrderId,
		rating: 5,
		comment: '',
	});
	const changeRating = (rating: number) => setFormData((prev) => ({ ...prev, rating }));
	const changeComment = (comment: string) => setFormData((prev) => ({ ...prev, comment }));
	const validate = (): string | null => {
		if (!formData.orderId) return '订单号缺失';
		if (formData.rating < 1 || formData.rating > 5) return '请为本次服务打分';
		if (formData.comment && formData.comment.length > 200) return '评价内容最多200字';
		return null;
	};
	return { formData, changeRating, changeComment, validate };
};
