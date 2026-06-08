import { UserIdentity } from './user';

/** 服务订单状态 */
export type OrderStatus =
	| 'pending' // 待支付
	| 'paid' // 待服务
	| 'serving' // 服务中
	| 'confirming' // 待确认
	| 'reviewing' // 待评价
	| 'completed' // 已完成
	| 'refunding' // 退款中
	| 'cancelled'; // 已取消

/** 统一订单项 */
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

/** 订单导航项 */
export interface OrderNavItem {
	/** 状态显示文字，如：待支付 */
	label: string;
	/** 对应的订单核心状态状态机值，特别的，'all' 可用于代表全部订单 */
	value: OrderStatus | 'all';
	/** 图标类名（Iconify 规范） */
	icon: string;
	url?: string;
}

/** 订单服务轨迹列表项 */
export interface OrderLifeCycleLogItem {
	id: number;
	orderId: string;
	status: OrderStatus;
	title: string;
	trajectoryImg?: string;
	createTime: string;
}
