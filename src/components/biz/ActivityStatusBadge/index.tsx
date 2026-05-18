import { View } from '@tarojs/components';
import { Badge } from '@/components/ui/Badge';
import { ActivityStatus } from '@/types/activity';
import { ACTIVITY_STATUS_MAP } from '@/constants/activity';

interface Props {
	/** 活动状态，默认 'pending' {@link ActivityStatus} */
	status?: ActivityStatus | string;
	/** 自定义类名 */
	className?: string;
}

/**
 * 活动状态徽章组件
 * 根据活动状态显示不同颜色和文本的徽章
 */
export function ActivityStatusBadge({ status, className = '' }: Props) {
	const safeIdentity = (status || 'pending') as ActivityStatus;
	const config = ACTIVITY_STATUS_MAP[safeIdentity] || ACTIVITY_STATUS_MAP['pending'];

	return (
		<View className={className}>
			<Badge variant={config.variant}>{config.label}</Badge>
		</View>
	);
}
