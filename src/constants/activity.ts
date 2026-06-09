import { ActivityStatus, EnrollStatus } from '@/types/activity';
import { ThemeVariant } from '@/types/common';

/** 活动状态 UI 配置字典 */
export const ACTIVITY_STATUS_MAP: Record<ActivityStatus, { label: string; variant: ThemeVariant }> =
	{
		pending: { label: '活动未开始', variant: 'primary' },
		started: { label: '活动已开始', variant: 'success' },
		ended: { label: '活动已结束', variant: 'secondary' },
	};

/** 报名状态 UI 配置字典 */
export const ENROLL_STATUS_MAP: Record<EnrollStatus, { label: string; variant: ThemeVariant }> = {
	pending: { label: '报名未开始', variant: 'primary' },
	started: { label: '报名已开始', variant: 'success' },
	ended: { label: '报名已结束', variant: 'secondary' },
};
