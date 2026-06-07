import { PageRes } from '@/types/common';
import { UnifiedOrderItem } from '@/types/order';
import { http } from '@/utils/http';

/** 创建服务订单请求入参 */
export interface CreateOrderPayload {
	/** 需求单id */
	demandId: number;
	/** 抢单表主键id (即服务方报价单的 id) */
	id: number;
	/** 支付方式：offline代表线下，online代表线上 */
	payType: 'online' | 'offline';
}

/**
 * 雇主选定服务方并指定支付方式，正式创建服务订单
 */
export const createServiceOrderAPI = (data: CreateOrderPayload) => {
	return http.post('/demand/order/web/add', data);
};

/** 需求方：获取发出的服务订单列表 */
export const getEmployerOrdersAPI = (params: { pageNum: number; pageSize: number }) => {
	return http.get<PageRes<UnifiedOrderItem>>('/demand/order/web/demandUserList', { params });
};

/** 服务方：获取抢到的服务订单列表 */
export const getProviderOrdersAPI = (params: { pageNum: number; pageSize: number }) => {
	return http.get<PageRes<UnifiedOrderItem>>('/demand/order/web/demandOrderList', { params });
};

/** 获取订单详情 (双端通用) */
export const getOrderDetailAPI = (orderId: string): Promise<UnifiedOrderItem> => {
    return http.get(`/demand/order/web/${orderId}`);
};

/** 需求方：取消订单 */
// export const cancelOrderAPI = (orderId: string, status: string) => {
//     return http.post(`/demand/order/status`, { orderId });
// };

/** 需求方：发起微信支付 */
// export const getOrderPayParamsAPI = (orderId: string) => {
//     return http.post(`/order/web/pay`, { orderId });
// };

/** 需求方：确认完工验收 */
// export const confirmOrderCompleteAPI = (orderId: string) => {
//     return http.post(`/order/web/confirmComplete`, { orderId });
// };

/** 服务签到打卡 */
// export const startOrderServiceAPI = (orderId: string) => {
//     return http.post(`/order/web/startService`, { orderId });
// };

/** 服务方：申请完工 */
// export const finishOrderServiceAPI = (orderId: string) => {
//     return http.post(`/order/web/finishService`, { orderId });
// };


