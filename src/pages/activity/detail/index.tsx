import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Image, RichText, ScrollView } from '@tarojs/components';
import { useActivityDetail, useEnrollActivity } from '@/hooks/useActivity';
import { Badge, Button, Cell, Description, Heading, Page } from '@/components/ui';
import { EnrollStatusBadge } from '@/components/biz/BizBadge';
import { useAuthStore } from '@/store/auth';
import { runWithAuth } from '@/utils/auth';
import { mapsTo } from '@/utils/common';

export default function ActivityDetail() {
	// 数据：路由参数中的活动 ID
	const router = useRouter();
	const id = router.params.id as string;

	// 数据：活动详情
	const { data: activity, isLoading } = useActivityDetail(id);

	const { mutate: doEnroll, isLoading: isEnrolling } = useEnrollActivity();
	const { userInfo } = useAuthStore();

	// 执行：处理报名
	const handleEnroll = () => {
		Taro.showModal({
			title: '报名确认',
			content: '您确定要报名参加此活动吗？',
			confirmText: '确认报名',
			confirmColor: '#ea3323',
			cancelText: '取消',
			success: (res) => {
				if (res.confirm) {
					// 报名流程
					runWithAuth(() => {
						if (userInfo?.identity !== 'volunteer') {
							Taro.showModal({
								title: '身份受限',
								content: '该活动仅限注册志愿者报名。是否立即前往完善志愿者档案？',
								confirmText: '去认证',
								confirmColor: '#ea3323',
								success: (res) => {
									if (res.confirm) mapsTo('/pages/apply/volunteer/index');
								},
							});
							return;
						}
						// 执行报名操作
						doEnroll(Number(id));
					});
				}
			},
		});
	};

	// 状态：数据加载中、活动不存在
	if (isLoading) return <View className="p-10 text-center text-text-muted">详情加载中...</View>;
	if (!activity) return <View className="p-10 text-center text-text-muted">活动不存在</View>;

	// 状态：是否已满员、是否未开始、是否已结束
	const isFull = activity.attendance >= activity.maxPeople;
	const isPending = activity.enrollStatus === 'pending';
	const isExpired = activity.enrollStatus === 'ended';

	const renderButtonText = () => {
		if (isEnrolling) return '报名中...';
		if (isPending) return '报名未开始';
		if (isExpired) return '报名已结束';
		if (isFull) return '报名人数已满';
		return '立即报名';
	};

	return (
		<Page className="bg-white pb-24">
			<ScrollView scrollY className="h-full">
				{/* 活动封面 */}
				<Image src={activity.banner} className="w-full h-56 object-cover" />

				<View className="container-x py-4">
					{/* 活动状态 */}
					<View className="flex items-center space-x-2">
						<EnrollStatusBadge value={activity.enrollStatus} />
						<Badge variant="info">{activity.categoryName}</Badge>
					</View>

					{/* 活动标题 */}
					<Text className="text-2xl font-bold text-gray-900 mt-3 block leading-tight">
						{activity.activityName}
					</Text>

					{/* 活动信息 */}
					<View className="mt-6 flex flex-col gap-4 bg-gray-50 p-4 rounded-card">
						<Description
							label="活动时间"
							value={`${activity.startTime} 至 ${activity.endTime}`}
						/>
						<Description label="活动地点" value={activity.address} />
						<Description label="主办单位" value={activity.organizer} />
						<Description
							label="招募人数"
							value={`已招募 ${activity.attendance} 人 / 限额 ${activity.maxPeople} 人`}
						/>
					</View>

					{/* 活动详情 */}
					<View className="mt-8">
						<Heading title="活动详情" size="md" />
						<View className="mt-4 text-gray-700 leading-relaxed text-sm">
							<RichText nodes={activity.content} />
						</View>
					</View>

					{/* 报名规则 */}
					<View className="mt-8">
						<Heading title="报名规则" size="md" />
						<Text className="mt-4 text-gray-600 text-sm block bg-orange-50 p-4 rounded-card">
							{activity.rules}
						</Text>
					</View>
				</View>
			</ScrollView>

			{/* 底部按钮 */}
			<View className="fixed bottom-0 inset-x-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 flex items-center justify-between">
				<View className="flex flex-1 flex-col gap-0.5 text-text-muted text-xs ">
					<Text>当前报名进度</Text>
					<Text>
						<Text className="font-bold text-primary text-sm">
							{activity.attendance}
						</Text>{' '}
						人已报名
					</Text>
				</View>

				{/* TODO: 校验用户已报名状态 */}
				<Button
					icon="icon-[ph--hand-tap]"
					size="md"
					variant="primary"
					loading={isEnrolling}
					disabled={isEnrolling || isFull || isPending || isExpired}
					onClick={handleEnroll}
				>
					{renderButtonText()}
				</Button>
			</View>
		</Page>
	);
}
