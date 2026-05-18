import { View, Text, Image } from '@tarojs/components';
import { Card, Page, SectionTitle, Badge, Carousel, GridNav } from '@/components/ui';
import { navigateTo, switchTab } from '@tarojs/taro';
import { useActivities } from '@/hooks/useActivity';

export default function HomePage() {
	// 获取最新的活动进行首页精选推荐
	const { data: activityData, isLoading } = useActivities({ pageSize: 3 });
	const activityList = activityData?.pages.flatMap((page) => page.list) || [];

	return (
		<Page>
			{/* 顶部自定义定位与欢迎语 */}
			<View className="bg-white px-4 pt-6 pb-3 flex items-center justify-between">
				<View className="flex items-center gap-1.5">
					<View className="icon-[ph--map-pin-bold] w-4 h-4 text-primary" />
					<Text className="text-sm font-bold text-text-title">扬州·东关街道</Text>
					<View className="icon-[ph--caret-down-bold] w-3 h-3 text-text-muted" />
				</View>
				<View
					className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
					onClick={() => switchTab({ url: '/pages/user/index' })}
				>
					<View className="icon-[ph--user-bold] w-4 h-4 text-text-body" />
				</View>
			</View>

			{/* 轮播图区域 */}
			<View className="px-4 bg-white pb-4">
				{/* 🎨 保持你原有的 Carousel 结构，圆角对齐 theme */}
				<View className="rounded-card overflow-hidden shadow-sm">
					<Carousel
						list={[
							{
								id: 1,
								pic: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&auto=format&fit=crop&q=60',
								url: '',
							},
							{
								id: 2,
								pic: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=60',
								url: '',
							},
						]}
						isFull
					/>
				</View>
			</View>

			<Card>
				<SectionTitle title="核心功能" />
				<SectionTitle
					title="核心功能"
					link={{ name: '查看更多', url: '/pages/activity/index' }}
				/>
				<SectionTitle title="核心功能" icon="icon-[ph--briefcase-bold]" />
				<SectionTitle
					title="核心功能"
					icon="icon-[ph--briefcase-bold]"
					link={{ name: '查看更多', url: '/pages/activity/index' }}
				/>
			</Card>

			{/* 核心金刚区 (快捷导航) */}
			<View className="bg-white px-4 py-6 grid grid-cols-4 gap-y-4 rounded-b-[40rpx] shadow-sm mb-3">
				<GridNav
					icon="icon-[ph--star-bold]"
					label="志愿活动"
					path="/pages/activity/index"
				/>
				<GridNav
					icon="icon-[ph--hand-heart-bold]"
					label="服务大厅"
					path="/pages/demand/index"
				/>
				<GridNav
					icon="icon-[ph--briefcase-bold]"
					label="家门口求职"
					path="/pages/job/index"
				/>
				<GridNav icon="icon-[ph--gift-bold]" label="积分商城" path="/pages/points/index" />
			</View>

			{/* 4. 社区风采/数据看板 */}
			<View className="mx-4 p-4 bg-white rounded-card shadow-sm mb-4">
				<View className="flex items-center justify-between mb-3 border-b border-gray-50 pb-2">
					<Text className="text-xs font-bold text-text-title">智慧社区网格概览</Text>
					<Text className="text-xs text-text-muted font-sans scale-90">数据实时更新</Text>
				</View>
				<View className="flex justify-around py-1">
					<View className="text-center">
						<Text className="text-xl font-bold text-primary block">1,280</Text>
						<Text className="text-xs text-text-muted mt-0.5 block">活跃志愿者</Text>
					</View>
					<View className="w-px bg-gray-100 h-8 my-auto" />
					<View className="text-center">
						<Text className="text-xl font-bold text-green-600 block">5,420</Text>
						<Text className="text-xs text-text-muted mt-0.5 block">累计服务工时</Text>
					</View>
					<View className="w-px bg-gray-100 h-8 my-auto" />
					<View className="text-center">
						<Text className="text-xl font-bold text-orange-500 block">342</Text>
						<Text className="text-xs text-text-muted mt-0.5 block">已解决求助</Text>
					</View>
				</View>
			</View>

			{/* 5. 精选志愿活动推荐区域 */}
			<View className="px-4 pb-10">
				<View className="flex justify-between items-center mb-3">
					<View className="flex items-center gap-2">
						{/* 🎨 主题色圆角指示器 */}
						<View className="w-1 h-4 bg-primary rounded-full" />
						<Text className="font-bold text-base text-text-title">热门活动推荐</Text>
					</View>
					<Text
						className="text-xs text-primary font-medium active:opacity-70"
						onClick={() => switchTab({ url: '/pages/activity/index' })}
					>
						查看全部 &gt;
					</Text>
				</View>

				{/* 推荐活动卡片列表 */}
				<View className="space-y-4">
					{isLoading && activityList.length === 0 ? (
						<View className="text-center py-10 text-text-muted text-sm">
							加载精选活动中...
						</View>
					) : (
						activityList.map((item) => (
							<View
								key={item.activityId}
								className="bg-white rounded-card overflow-hidden shadow-sm active:scale-[0.99] transition-transform flex"
								onClick={() =>
									navigateTo({
										url: `/pages/activity/detail/index?id=${item.activityId}`,
									})
								}
							>
								{/* 左侧 Banner，固定尺寸保持整齐 */}
								<Image
									src={item.banner}
									className="w-28 h-28 object-cover shrink-0"
								/>

								{/* 右侧详细描述 */}
								<View className="p-3 flex-1 flex flex-col justify-between min-w-0">
									<View>
										<View className="flex justify-between items-start gap-1">
											<Text className="text-sm font-bold text-text-title line-clamp-1 flex-1">
												{item.activityName}
											</Text>
											<Badge
												variant={
													item.status === 'started' ? 'success' : 'gray'
												}
											>
												{item.status === 'started' ? '报名中' : '结束'}
											</Badge>
										</View>
										<Text className="text-xs text-text-muted truncate block mt-1">
											{item.address}
										</Text>
									</View>

									<View className="flex justify-between items-center">
										<View className="flex items-center gap-1 text-text-muted">
											<View className="icon-[ph--users-three] w-3.5 h-3.5" />
											{/* ✨ 移除了非标 text-[10px]，用 text-xs 配合等比缩放展现精致感 */}
											<Text className="text-xs scale-90 origin-left">
												已报{' '}
												<Text className="text-primary font-bold">
													{item.attendance}/{item.maxPeople}
												</Text>{' '}
												人
											</Text>
										</View>
									</View>
								</View>
							</View>
						))
					)}
				</View>
			</View>
		</Page>
	);
}
