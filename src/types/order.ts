/** 服务订单状态 */
export type OrderStatus =
	| 'pending' // 待支付
	| 'serving' // 待服务
	| 'confirming' // 待确认
	| 'reviewing' // 待评价
	| 'completed' // 已完成
	| 'refunding' // 退款中
	| 'cancelled'; // 已取消
