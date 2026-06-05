import { UserIdentity } from './user';

/** 服务订单状态 */
export type OrderStatus =
	| 'pending' // 待支付
	| 'serving' // 待服务
	| 'confirming' // 待确认
	| 'reviewing' // 待评价
	| 'completed' // 已完成
	| 'refunding' // 退款中
	| 'cancelled'; // 已取消

export interface UnifiedOrderItem {
	orderId: string;
	orderName: string;
	demandId: number;
	status: OrderStatus;
	orderTotal: number;
	payType: 'online' | 'offline';
	createTime: string;
	payTime: string;
	completeTime: string;
	charge: boolean;
	categoryName: string;
	address: string;

	// 接单服务方/志愿者数据 (供给需求方视角看)
	userId: number;
	name: string;
	phone: string;
	avatar: string;
	identity: Exclude<UserIdentity, 'user'>;

	// 发单雇主数据 (服务方视角看)
	employerName: string;
	employerPhone: string;
}
