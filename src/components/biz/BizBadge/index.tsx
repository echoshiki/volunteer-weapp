import { Badge } from '@/components/ui/Badge';
import { USER_IDENTITY_MAP } from '@/constants/user';
import { ORDER_STATUS_MAP } from '@/constants/order';
import { ACTIVITY_STATUS_MAP, ENROLL_STATUS_MAP } from '@/constants/activity';
import { ApprovalStatus, ThemeVariant } from '@/types/common';

/**
 * 生成业务徽章组件
 * 该组件依赖于业务状态映射表，适用于有固定枚举值的业务场景
 * @param map 业务状态映射表
 * @param fallback 默认状态
 * @returns 业务徽章组件
 */
function createBizBadge<T extends string>(
	map: Record<T, { label: string; variant: ThemeVariant }>,
	fallback: NoInfer<T>,
) {
	return function ({ value, className = '' }: { value?: T; className?: string }) {
		const config = map[(value as T) ?? fallback] ?? map[fallback];
		return (
			<Badge variant={config.variant} className={className}>
				{config.label}
			</Badge>
		);
	};
}

/** 通用审核状态 UI 配置字典 */
export const AUDIT_STATUS_MAP: Record<ApprovalStatus, { label: string; variant: ThemeVariant }> = {
	pending: { label: '待审核', variant: 'primary' },
	approved: { label: '已通过', variant: 'success' },
	rejected: { label: '已驳回', variant: 'secondary' },
};

/** 用户身份 */
export const UserIdentityBadge = createBizBadge(USER_IDENTITY_MAP, 'user');

/** 活动状态 */
export const ActivityStatusBadge = createBizBadge(ACTIVITY_STATUS_MAP, 'pending');

/** 报名状态 */
export const EnrollStatusBadge = createBizBadge(ENROLL_STATUS_MAP, 'pending');

/** 通用审核状态 */
export const AuditStatusBadge = createBizBadge(AUDIT_STATUS_MAP, 'pending');

/** 服务订单状态 */
export const OrderStatusBadge = createBizBadge(ORDER_STATUS_MAP, 'pending');
