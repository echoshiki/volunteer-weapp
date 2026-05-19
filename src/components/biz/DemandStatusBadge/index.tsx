import { Badge } from '@/components/ui/Badge';
import { DemandOrderStatus } from '@/types/demand';
import { DEMAND_STATUS_MAP } from '@/constants/demand';

interface Props {
	/** 需求订单状态，默认 'dispatching' */
	status?: DemandOrderStatus | string;
	/** 自定义类名 */
	className?: string;
}

/**
 * 需求订单状态徽章组件
 * 根据订单状态显示不同颜色和文本的徽章
 */
export function DemandStatusBadge({ status, className = '' }: Props) {
	const safeIdentity = (status || 'dispatching') as DemandOrderStatus;
	const config = DEMAND_STATUS_MAP[safeIdentity] || DEMAND_STATUS_MAP['dispatching'];

	return (
		<Badge variant={config.variant} className={className}>
			{config.label}
		</Badge>
	);
}
