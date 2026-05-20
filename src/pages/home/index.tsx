import { View, Text, Image } from '@tarojs/components';
import { Page, SectionTitle, Carousel, GridNav, Empty, Cell } from '@/components/ui';
import { useActivities } from '@/hooks/useActivity';
import { mapsTo } from '@/utils/common';
import { Loading } from '@/components/ui/Loading';
import { ActivityStatusBadge } from '@/components/biz/BizBadge';

export default function HomePage() {
	// 数据：5 条精选活动数据
	const { data: activityData, isLoading } = useActivities({ pageSize: 5 });
	const activityList = activityData?.pages.flatMap((page) => page.list) || [];

	return (
		<Page hasTabBar>
			<View className="container-x">
				{/* 顶部自定义定位与欢迎语 */}
				<View className="py-3 flex items-center justify-between">
					<View className="flex items-center gap-1.5">
						<View className="icon-[ph--map-pin-bold] w-4 h-4 text-primary" />
						<Text className="text-sm font-bold text-text-title">扬州·东关街道</Text>
						<View className="icon-[ph--caret-down-bold] w-3 h-3 text-text-muted" />
					</View>
					<View
						className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
						onClick={() => mapsTo('/pages/user/index')}
					>
						<View className="icon-[ph--user-bold] w-4 h-4 text-text-body" />
					</View>
				</View>
			</View>

			{/* 轮播图区域 */}
			<View className="mb-4">
				<View className="overflow-hidden shadow-sm">
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

			<View className="container-x flex flex-col gap-3 mb-4">
				{/* 核心金刚区 */}
				<Cell className="grid grid-cols-4 px-1">
					<GridNav
						icon="icon-[ph--gift-bold]"
						label="志愿组织"
						path="/pages/points/index"
					/>
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
						label="家门口就业"
						path="/pages/job/index"
					/>
				</Cell>
			</View>

			{/* 社区风采/数据看板 */}
			<View className="container-x mb-4">
				<Cell>
					<View className="flex items-center justify-between mb-3 border-b border-gray-50 pb-2">
						<Text className="text-sm font-bold text-text-title">智慧社区网格概览</Text>
						<Text className="text-xs text-text-muted font-sans scale-90">
							数据实时更新
						</Text>
					</View>
					<View className="flex justify-around py-1">
						<View className="text-center">
							<Text className="text-xl font-bold text-primary block">1,280</Text>
							<Text className="text-xs text-text-muted mt-0.5 block">活跃志愿者</Text>
						</View>
						<View className="w-px bg-gray-100 h-8 my-auto" />
						<View className="text-center">
							<Text className="text-xl font-bold text-green-600 block">5,420</Text>
							<Text className="text-xs text-text-muted mt-0.5 block">
								累计服务工时
							</Text>
						</View>
						<View className="w-px bg-gray-100 h-8 my-auto" />
						<View className="text-center">
							<Text className="text-xl font-bold text-orange-500 block">342</Text>
							<Text className="text-xs text-text-muted mt-0.5 block">已解决求助</Text>
						</View>
					</View>
				</Cell>
			</View>

			{/* 精选志愿活动推荐区域 */}
			<View className="container-x mb-4">
				<Cell>
					<SectionTitle
						title="精选活动推荐"
						link={{ name: '更多活动', url: '/pages/activity/index' }}
					/>

					{/* 推荐活动卡片列表 */}
					<View className="space-y-4 divide-y divide-gray-100">
						{isLoading && <Loading label="加载活动中..." />}

						{activityList.length === 0 && <Empty />}

						{activityList.length > 0 &&
							activityList.map((item) => (
								<View
									key={item.activityId}
									className="bg-white rounded-card overflow-hidden flex pt-4"
									onClick={() =>
										mapsTo(`/pages/activity/detail/index?id=${item.activityId}`)
									}
								>
									{/* 左侧 Banner，固定尺寸保持整齐 */}
									<Image
										src={item.banner}
										className="w-28 h-28 object-cover shrink-0"
									/>

									{/* 右侧详细描述 */}
									<View className="px-3 flex-1 flex flex-col gap-0.5 justify-between min-w-0">
										<View>
											<Text className="text-sm font-bold text-text-title line-clamp-2 flex-1">
												{item.activityName}
											</Text>
										</View>

										<View className="flex justify-between items-start gap-1">
											<Text className="text-xs text-text-muted truncate block mt-1">
												{item.address}
											</Text>
										</View>

										<View className="flex justify-between items-center">
											<ActivityStatusBadge value={item.status} />
											<View className="flex items-center gap-1 text-text-muted">
												<View className="icon-[ph--users-three-light] w-5 h-5" />
												<Text className="text-xs">
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
							))}
					</View>
				</Cell>
			</View>
		</Page>
	);
}
