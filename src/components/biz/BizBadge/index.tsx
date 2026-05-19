import { Badge } from '@/components/ui/Badge';
import { USER_IDENTITY_MAP } from '@/constants/user';
import { DEMAND_STATUS_MAP } from '@/constants/demand';
import { ACTIVITY_STATUS_MAP, ENROLL_STATUS_MAP } from '@/constants/activity';
import { ThemeVariant } from '@/types/common';

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

export const DemandStatusBadge = createBizBadge(DEMAND_STATUS_MAP, 'dispatching');
export const UserIdentityBadge = createBizBadge(USER_IDENTITY_MAP, 'user');
export const ActivityStatusBadge = createBizBadge(ACTIVITY_STATUS_MAP, 'pending');
export const EnrollStatusBadge = createBizBadge(ENROLL_STATUS_MAP, 'pending');
