import { DemandStatus, ServiceScope } from '@/types/demand';
import { ThemeVariant } from '@/types/common';

/** 需求订单状态 UI 配置字典 */
export const DEMAND_STATUS_MAP: Record<DemandStatus, { label: string; variant: ThemeVariant }> = {
	dispatching: { label: '招募中', variant: 'primary' },
	accepted: { label: '已接单', variant: 'warning' },
	serving: { label: '服务中', variant: 'info' },
	completed: { label: '已完成', variant: 'success' },
	cancelled: { label: '已取消', variant: 'secondary' },
};

/** 服务范围配置字典 */
export const SERVICE_SCOPE_MAP: Record<ServiceScope, { label: string; icon: string }> = {
	group: { label: '集体', icon: 'icon-[ph--users]' },
	individual: { label: '个人', icon: 'icon-[ph--user]' },
};
