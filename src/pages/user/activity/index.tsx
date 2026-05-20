import { View, Text, ScrollView, Image } from '@tarojs/components';
import { useMyActivities } from '@/hooks/useActivity';
import { AuditStatusBadge } from '@/components/biz/BizBadge';
import { mapsTo } from '@/utils/common';
import { Page, Cell, Empty, Loading, Button } from '@/components/ui';

export default function MyActivityList() {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useMyActivities();
	const list = data?.pages.flatMap((page) => page.list) || [];

	// 执行：扫码签到/签退
	const handleScanCode = (activityId: number) => {
		// TODO
		console.log('触发扫码，关联活动 ID:', activityId);
	};

	if (isLoading) return <Loading />;

	return (
		<Page>
			<View className="container-x">
				<ScrollView
					scrollY
					className="h-[calc(100vh-10px)]"
					onScrollToLower={() => hasNextPage && fetchNextPage()}
				>
					{list.map((item) => (
						<Cell
							key={item.activityId}
							onClick={() =>
								mapsTo(`/pages/activity/detail/index?id=${item.activityId}`)
							}
							className="mt-5"
							clickable
						>
							<View className="flex gap-3">
								<Image
									src={item.banner}
									mode="aspectFill"
									className="size-20 rounded-lg object-cover bg-gray-100 shrink-0"
								/>
								<View className="flex-1 flex flex-col justify-between overflow-hidden">
									{/* 活动标题 */}
									<View className="flex justify-between items-center gap-2">
										<Text className="text-base font-bold text-text-title flex-1 truncate">
											{item.activityName}
										</Text>
										<AuditStatusBadge value={item.auditStatus} />
									</View>

									{/* 活动时间、地点 */}
									<View className="flex flex-col gap-1">
										<Text className="text-xs text-text-muted truncate">
											时间: {item.startTime}
										</Text>
										<Text className="text-xs text-text-muted truncate">
											地点: {item.address}
										</Text>
									</View>
								</View>
							</View>

							{/* 动态履约区 (仅在审核通过后展示强交互) */}
							<View className="mt-3 pt-3 border-t border-gray-50">
								{item.auditStatus === 'approved' && (
									<View className="flex items-center justify-between">
										{/* 打卡时间轴 */}
										<View className="flex flex-col gap-0.5">
											{item.checkInTime ? (
												<>
													<Text className="text-xs text-gray-500">
														入: {item.checkInTime}
													</Text>
													{item.checkOutTime ? (
														<Text className="text-xs text-gray-500">
															出: {item.checkOutTime}
														</Text>
													) : (
														<Text className="text-xs text-orange-500">
															等待活动结束签退...
														</Text>
													)}
												</>
											) : (
												<Text className="text-xs text-text-muted">
													到达现场后请及时打卡
												</Text>
											)}
										</View>

										{/* 动作或成果 */}
										<View>
											{item.duration !== null ? (
												<View className="flex items-baseline text-primary text-xs">
													<Text className="text-primary/80">时长</Text>
													<Text className="text-xl mx-1 font-bold font-sans tracking-tight">
														{item.duration}
													</Text>
													<Text className="text-primary/80">分钟</Text>
												</View>
											) : (
												<Button
													size="sm"
													variant={
														item.checkInTime ? 'outline' : 'primary'
													}
													onClick={(e) => {
														e.stopPropagation();
														handleScanCode(item.activityId);
													}}
												>
													{item.checkInTime ? '扫码签退' : '扫码签到'}
												</Button>
											)}
										</View>
									</View>
								)}

								{item.auditStatus === 'pending' && (
									<Text className="text-xs text-orange-400 block w-full truncate">
										资料已提交，等待主办方审核...
									</Text>
								)}

								{item.auditStatus === 'rejected' && (
									<Text className="text-xs text-red-500 block w-full truncate">
										{item.rejectReason || '不符合本次活动招募要求'}
									</Text>
								)}
							</View>
						</Cell>
					))}
				</ScrollView>

				{list.length === 0 && <Empty title="暂无报名的志愿活动" />}

				{isFetchingNextPage && (
					<View className="text-center py-4 text-text-muted text-xs">加载中...</View>
				)}

				{!hasNextPage && list.length > 0 && (
					<View className="text-center py-4 text-text-muted text-xs">没有更多了</View>
				)}
			</View>
		</Page>
	);
}
