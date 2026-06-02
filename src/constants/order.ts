import { OrderStatus } from '@/types/order';
import { ThemeVariant } from '@/types/common';

/** 需求订单状态 UI 配置字典 */
export const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; variant: ThemeVariant }> = {
	pending: { label: '待支付', variant: 'primary' },
	serving: { label: '待服务', variant: 'primary' },
	confirming: { label: '待验收', variant: 'info' },
	reviewing: { label: '待评价', variant: 'warning' },
	completed: { label: '已完成', variant: 'success' },
	refunding: { label: '待退款', variant: 'danger' },
	cancelled: { label: '已取消', variant: 'secondary' },
};
