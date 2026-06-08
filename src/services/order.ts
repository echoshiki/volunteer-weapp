import { PageRes } from '@/types/common';
import { OrderLifeCycleLogItem, OrderStatus, UnifiedOrderItem } from '@/types/order';
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
export const getEmployerOrdersAPI = (params: {
	pageNum: number;
	pageSize: number;
	status?: OrderStatus;
}) => {
	return http.get<PageRes<UnifiedOrderItem>>('/demand/order/web/demandUserList', { params });
};

/** 服务方：获取抢到的服务订单列表 */
export const getProviderOrdersAPI = (params: {
	pageNum: number;
	pageSize: number;
	status?: OrderStatus;
}) => {
	return http.get<PageRes<UnifiedOrderItem>>('/demand/order/web/demandOrderList', { params });
};

/** 获取订单详情 (双端通用) */
export const getOrderDetailAPI = (orderId: string): Promise<UnifiedOrderItem> => {
	return http.get(`/demand/order/web/${orderId}`);
};

export interface UpdateOrderStatusRequest {
	orderId: string;
	/** 变更的目标状态：reviewing 待评价(雇主验收成功)，cancelled 已取消 */
	status: 'reviewing' | 'cancelled';
}

/** 需求方：确认/取消订单 */
export const updateOrderStatusAPI = (param: UpdateOrderStatusRequest) => {
	return http.put(`/demand/order/status`, param);
};

export interface AddTrajectoryRequest {
	orderId: string | number;
	demandId: number;
	/** 服务状态：arrived代表到达服务地点，completed代表服务完成 */
	status: 'arrived' | 'completed';
	/** 服务轨迹现场打卡/成果图片 */
	trajectoryImg: string;
}

/** 添加订单轨迹 */
export const addOrderTrajectoryAPI = (param: AddTrajectoryRequest) => {
	return http.post(`/demand/trajectory/web/add`, param);
};

/** 获取订单轨迹列表 */
export const getOrderTrajectoryListAPI = (params: { orderId: string }) => {
	return http.get<PageRes<OrderLifeCycleLogItem>>('/demand/trajectory/web/list', { params });
};

export interface WechatPayParamsRes {
	appId: string;
	timeStamp: string;
	nonceStr: string;
	package: string;
	signType: string;
	paySign: string;
}

/** 需求方：发起微信支付 */
export const getOrderPayParamsAPI = (orderId: string): Promise<WechatPayParamsRes> => {
	return http.post('/demand/order/payment', { orderId });
};

export interface WechatPayQueryRes {
	/** 通信标识 */
	return_code: string;
	/** 通信信息 */
	return_msg: string;
	/** 小程序AppID */
	appid: string;
	/** 商户号 */
	mch_id: string;
	/** 随机字符串 */
	nonce_str: string;
	/** 签名 */
	sign: string;
	/** 业务结果 */
	result_code: string;
	/** 用户openid */
	openid: string;
	/** 交易类型 */
	trade_type: string;
	/** 交易状态 */
	trade_state: 'SUCCESS' | 'NOTPAY' | 'USERPAYING' | 'CLOSED' | 'REVOKED' | 'PAYERROR';
	/** 付款银行 */
	bank_type: string;
	/** 订单总金额，单位为分 */
	total_fee: string;
	/** 现金支付金额（分） */
	cash_fee: string;
	/** 微信支付订单号 */
	transaction_id: string;
	/** 商户订单号 */
	out_trade_no: string;
	/** 支付完成时间 */
	time_end: string;
	/** 交易状态描述 */
	trade_state_desc?: string;
}

/** 轮询支付状态 */
export const queryOrderPayStatusAPI = (orderId: string): Promise<WechatPayQueryRes> => {
	return http.get(`/demand/order/payment/query/${orderId}`);
};

export interface EvaluateOrderRequest {
	/** 服务订单id */
	orderId: string;
	/** 服务评价分数 */
	rating: number;
	/** 服务评价内容 */
	comment?: string;
}

/** 需求方：对已完工的服务单发起最终评价 */
export const evaluateOrderAPI = (param: EvaluateOrderRequest) => {
	return http.put('/demand/order/evaluate', param);
};
