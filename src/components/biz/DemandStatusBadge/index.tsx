import { View } from '@tarojs/components';
import { Badge } from '@/components/ui/Badge';
import { DemandOrderStatus } from '@/types/demand';
import { DEMAND_STATUS_MAP } from '@/constants/demand';

interface Props {
	status?: DemandOrderStatus | string;
	className?: string;
}

export function DemandStatusBadge({ status, className = '' }: Props) {
	const safeIdentity = (status || 'dispatching') as DemandOrderStatus;
	const config = DEMAND_STATUS_MAP[safeIdentity] || DEMAND_STATUS_MAP['dispatching'];

	return (
		<View className={className}>
			<Badge variant={config.variant}>{config.label}</Badge>
		</View>
	);
}
