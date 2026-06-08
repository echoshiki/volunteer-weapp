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
import { mapsTo } from '@/utils/common';
import { getTenantId } from '@/utils/tenant';
import { OrderStatus, UnifiedOrderItem } from '@/types/order';
import { useState } from 'react';

/** 创建订单 */
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
	const currentOrderId = order?.orderId || '';

	// 服务方打卡判定
	const needArrivePunch = order ? order.status === 'paid' : false;
	const needCompletePunch = order ? order.status === 'serving' : false;

	// 公共成功回调：刷新当前详情及双端列表
	const refreshOrderCache = () => {
		queryClient.invalidateQueries({ queryKey: ['order'] });
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
			if (
				res.return_code === 'SUCCESS' &&
				res.result_code === 'SUCCESS' &&
				res.trade_state === 'SUCCESS'
			) {
				Taro.hideLoading();
				Taro.showToast({ title: '支付成功', icon: 'success' });
				refreshOrderCache(); // 瞬间重刷，使界面从 pending 挺进 paid (待服务)
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
					Taro.showToast({ title: '支付已取消', icon: 'none' });
				} else {
					Taro.showToast({ title: error?.errMsg || '微信支付失败', icon: 'none' });
				}

				refreshOrderCache();
			}
		},
		onError: (err: any) => {
			Taro.showToast({ title: err?.message || '获取支付参数失败', icon: 'none' });
		},
	});

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

			setTimeout(() => {
				Taro.navigateBack();
			}, 1500);
		},
		onError: (err: any) => {
			Taro.showToast({ title: err?.message || '评价提交失败', icon: 'none' });
		},
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
		// 评价内容非必需，不强制卡死死，但可限制最大字数限制
		if (formData.comment && formData.comment.length > 200) return '评价内容最多200字';
		return null;
	};

	return { formData, changeRating, changeComment, validate };
};
