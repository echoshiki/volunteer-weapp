import { ActivityStatus } from '@/types/activity';
import { ThemeVariant } from '@/types/common';

/** 活动状态 UI 配置字典 */
export const ACTIVITY_STATUS_MAP: Record<ActivityStatus, { label: string; variant: ThemeVariant }> =
	{
		pending: { label: '招募中', variant: 'secondary' },
		started: { label: '已接单', variant: 'success' },
		ended: { label: '服务中', variant: 'secondary' },
	};
