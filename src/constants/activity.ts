import { ActivityStatus, EnrollStatus, AuditStatus } from '@/types/activity';
import { ThemeVariant } from '@/types/common';

/** 活动状态 UI 配置字典 */
export const ACTIVITY_STATUS_MAP: Record<ActivityStatus, { label: string; variant: ThemeVariant }> =
	{
		pending: { label: '未开始', variant: 'primary' },
		started: { label: '已开始', variant: 'success' },
		ended: { label: '已结束', variant: 'secondary' },
	};

/** 报名状态 UI 配置字典 */
export const ENROLL_STATUS_MAP: Record<EnrollStatus, { label: string; variant: ThemeVariant }> = {
	pending: { label: '未开始', variant: 'primary' },
	started: { label: '已开始', variant: 'success' },
	ended: { label: '已结束', variant: 'secondary' },
};

/** 用户报名状态 UI 配置字典 */
export const AUDIT_STATUS_MAP: Record<AuditStatus, { label: string; variant: ThemeVariant }> = {
	pending: { label: '待审核', variant: 'primary' },
	approved: { label: '已通过', variant: 'success' },
	rejected: { label: '已驳回', variant: 'secondary' },
};
