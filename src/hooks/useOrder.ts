import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	createServiceOrderAPI,
	getEmployerOrdersAPI,
	getOrderDetailAPI,
	getProviderOrdersAPI,
} from '@/services/order';
import Taro from '@tarojs/taro';
import { mapsTo } from '@/utils/common';
import { getTenantId } from '@/utils/tenant';

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
export const useEmployerOrderList = () => {
	return useInfiniteQuery({
		queryKey: ['order', 'employer', 'list'],
		queryFn: ({ pageParam = 1 }) => getEmployerOrdersAPI({ pageNum: pageParam, pageSize: 10 }),
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
	});
};

/** 服务方订单列表 */
export const useProviderOrderList = () => {
	return useInfiniteQuery({
		queryKey: ['order', 'provider', 'list'],
		queryFn: ({ pageParam = 1 }) => getProviderOrdersAPI({ pageNum: pageParam, pageSize: 10 }),
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

/** 统一管理订单履约动作的 Hook 组合 */
export const useOrderActions = (orderId: string) => {
    const queryClient = useQueryClient();
    
    // 公共成功回调：刷新当前详情及双端列表
    const refreshCache = () => {
        queryClient.invalidateQueries({ queryKey: ['order'] });
    };

    // 取消订单
    const cancelOrder = useMutation({
        // mutationFn: () => cancelOrderAPI(orderId),
        // onSuccess: () => { Taro.showToast({ title: '订单已取消' }); refreshCache(); }
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

    // 服务方签到
    const startService = useMutation({
        // mutationFn: () => startOrderServiceAPI(orderId),
        // onSuccess: () => { Taro.showToast({ title: '签到成功，开始服务' }); refreshCache(); }
    });

    // 服务方完工
    const finishService = useMutation({
        // mutationFn: () => finishOrderServiceAPI(orderId),
        // onSuccess: () => { Taro.showToast({ title: '已提交完工申请' }); refreshCache(); }
    });

    // 雇主确认验收
    const confirmComplete = useMutation({
        // mutationFn: () => confirmOrderCompleteAPI(orderId),
        // onSuccess: () => { Taro.showToast({ title: '验收成功，交易完成', icon: 'success' }); refreshCache(); }
    });

    return {
        cancelOrder,
        runWechatPay,
        startService,
        finishService,
        confirmComplete,
        isAnyActionPending: cancelOrder.isLoading || runWechatPay.isLoading || startService.isLoading || finishService.isLoading || confirmComplete.isLoading
    };
};
