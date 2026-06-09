import { View, Text, Image } from '@tarojs/components';
import { Divider } from '@/components/ui';
import { ActivityStatusBadge, EnrollStatusBadge } from '@/components/biz/BizBadge'; // 确保路径正确
import { mapsTo } from '@/utils/common';
import { ActivityItem } from '@/types/activity';

export interface ActivityCardProps {
	/** 活动数据源 */
	activity: ActivityItem;
	/** 卡片布局：horizontal(首页横向) | vertical(频道页竖向) */
	layout?: 'horizontal' | 'vertical';
	/** 外部追加的容器样式 */
	className?: string;
}

/**
 * 活动列表项卡片
 * 支持横向和竖向布局
 */
export const ActivityCard = ({
	activity,
	layout = 'vertical',
	className = '',
}: ActivityCardProps) => {
	const handleClick = () => mapsTo(`/pages/activity/detail/index?id=${activity.activityId}`);

	// ==========================================
	// 形态 A：横向布局 (常用于首页精选推荐、列表紧凑模式)
	// ==========================================
	if (layout === 'horizontal') {
		return (
			<View className={`flex ${className}`} onClick={handleClick}>
				{/* 左侧活动封面 */}
				<Image
					src={activity.banner}
					mode="aspectFill"
					className="size-20 object-cover shrink-0 rounded"
				/>

				{/* 右侧详细描述 */}
				<View className="px-3 flex-1 flex flex-col gap-0.5 justify-between min-w-0">
					<View>
						<Text className="text-sm font-bold text-text-title line-clamp-2 flex-1">
							{activity.activityName}
						</Text>
					</View>

					<View className="flex justify-start items-center text-xs text-text-muted mt-1">
						<Text>{activity.categoryName}</Text>
						<Divider orientation="vertical" />
						<Text>{activity.address}</Text>
					</View>

					<View className="flex justify-between items-center">
						<EnrollStatusBadge value={activity.status} />
						<View className="flex items-center gap-1 text-text-muted">
							<View className="icon-[ph--users-three-light] w-5 h-5" />
							<Text className="text-xs">
								已报{' '}
								<Text className="text-primary font-bold">
									{activity.attendance}/{activity.maxPeople}
								</Text>{' '}
								人
							</Text>
						</View>
					</View>
				</View>
			</View>
		);
	}

	// ==========================================
	// 形态 B：竖向布局 (常用于活动频道主列表)
	// ==========================================
	return (
		<View className={`${className}`} onClick={handleClick}>
			<Image src={activity.banner} mode="aspectFill" className="w-full h-40 object-cover" />
			<View className="p-4">
				{/* 活动标题和状态 */}
				<View className="flex justify-between items-center">
					<Text className="text-lg font-bold text-text-title flex-1 truncate pr-2">
						{activity.activityName}
					</Text>
					<EnrollStatusBadge value={activity.enrollStatus} />
				</View>

				{/* 活动类型和地址 */}
				<View className="mt-2 flex items-center text-xs text-gray-500 space-x-2">
					<Text>{activity.categoryName}</Text>
					<Divider orientation="vertical" />
					<Text className="truncate">{activity.address}</Text>
				</View>

				{/* 报名人数和时间 */}
				<View className="mt-3 pb-2 flex justify-between items-center">
					<View className="flex items-center gap-1.5 text-text-muted">
						<View className="icon-[ph--users-three] w-4 h-4" />
						<Text className="text-xs">
							已报{' '}
							<Text className="text-primary font-bold">
								{activity.attendance} / {activity.maxPeople}
							</Text>{' '}
							人
						</Text>
					</View>
					{activity.startTime && (
						<Text className="text-xs text-text-muted">{activity.startTime} 开始</Text>
					)}
				</View>
			</View>
		</View>
	);
};
