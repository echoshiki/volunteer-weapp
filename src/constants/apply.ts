import { ReviewStatus } from '@/types/user';
import { ThemeVariant } from '@/types/common';

/** 申请类型字典 */
export const TYPE_MAP = {
	1: {
		title: '志愿者认证申请',
		icon: 'icon-[ph--user-focus-duotone]',
		color: 'text-blue-500',
	},
	2: {
		title: '服务机构入驻申请',
		icon: 'icon-[ph--buildings-duotone]',
		color: 'text-orange-500',
	},
};

/** 申请状态字典 */
export const APPLY_STATUS_MAP: Record<ReviewStatus, { label: string; variant: ThemeVariant }> = {
	pending: { label: '审核中', variant: 'warning' },
	approved: { label: '已通过', variant: 'success' },
	rejected: { label: '已驳回', variant: 'danger' },
};
