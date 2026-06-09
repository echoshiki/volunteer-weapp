import { ThemeVariant } from '@/types/common';
import { JobApplyStatus } from '@/types/job';

export const JOB_STATUS_MAP: Record<JobApplyStatus, { label: string; variant: ThemeVariant }> = {
	applied: { label: '已投递', variant: 'info' },
	accepted: { label: '已被录用', variant: 'success' },
	rejected: { label: '未通过', variant: 'danger' },
};
