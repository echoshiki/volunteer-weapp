import { useRouter } from '@tarojs/taro';
import { View, Text, Image, RichText, ScrollView } from '@tarojs/components';
import { useActivityDetail } from '@/hooks/useActivity';
import { Badge, Button } from '@/components/ui';
import { ActivityStatusBadge } from '@/components/biz/ActivityStatusBadge';

export default function ActivityDetail() {
	const router = useRouter();
	const id = router.params.id as string;
	const { data: activity, isLoading } = useActivityDetail(id);

	if (isLoading) return <View className="p-10 text-center text-text-muted">详情加载中...</View>;
	if (!activity) return <View className="p-10 text-center text-text-muted">活动不存在</View>;

	return (
		<View className="min-h-screen bg-white pb-20">
			<ScrollView scrollY className="h-full">
				{/* Banner */}
				<Image src={activity.banner} className="w-full h-56 object-cover" />

				<View className="p-5">
					{/* 标题与状态 */}
					<View className="flex items-center space-x-2">
						<ActivityStatusBadge status={activity.status} />
						<Badge variant={'primary'}>{activity.categoryName}</Badge>
					</View>
					<Text className="text-2xl font-bold text-gray-900 mt-3 block leading-tight">
						{activity.activityName}
					</Text>

					{/* 信息卡片 */}
					<View className="mt-6 space-y-4 bg-gray-50 p-4 rounded-card">
						<View className="flex items-start">
							<Text className="text-text-muted text-sm w-20">活动时间</Text>
							<Text className="text-title text-sm flex-1 font-sans">
								{activity.startTime} 至 {activity.endTime}
							</Text>
						</View>
						<View className="flex items-start">
							<Text className="text-text-muted text-sm w-20">活动地点</Text>
							<Text className="text-title text-sm flex-1">{activity.address}</Text>
						</View>
						<View className="flex items-start">
							<Text className="text-text-muted text-sm w-20">主办单位</Text>
							<Text className="text-title text-sm flex-1">{activity.organizer}</Text>
						</View>
						<View className="flex items-start">
							<Text className="text-text-muted text-sm w-20">招募人数</Text>
							<Text className="text-title text-sm flex-1">
								已招募 {activity.attendance} 人 / 限额 {activity.maxPeople} 人
							</Text>
						</View>
					</View>

					{/* 活动详情 */}
					<View className="mt-8">
						<Text className="text-lg font-bold border-l-4 border-primary pl-3">
							活动详情
						</Text>
						<View className="mt-4 text-gray-700 leading-relaxed text-sm">
							<RichText nodes={activity.content} />
						</View>
					</View>

					{/* 规则 */}
					<View className="mt-8 mb-10">
						<Text className="text-lg font-bold border-l-4 border-primary pl-3">
							报名规则
						</Text>
						<Text className="mt-4 text-gray-600 text-sm block bg-orange-50 p-4 rounded-xl">
							{activity.rules}
						</Text>
					</View>
				</View>
			</ScrollView>

			{/* 底部悬浮按钮 (预留交互位置) */}
			<View className="fixed bottom-0 inset-x-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 flex items-center justify-between">
				<View className="flex flex-1 flex-col gap-1">
					<Text className="text-xs text-text-muted">当前进度</Text>
					<Text className="text-sm">
						<Text className="font-bold text-primary">{activity.attendance}</Text>{' '}
						人已报名
					</Text>
				</View>
				<Button icon="icon-[ph--hand-tap]" size="md" variant="primary">
					立即报名
				</Button>
			</View>
		</View>
	);
}
