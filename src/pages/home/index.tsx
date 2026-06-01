import { View, Text } from '@tarojs/components';
import { Page, Heading, Carousel, GridNav, Empty, Cell, Divider } from '@/components/ui';
import { useActivityList } from '@/hooks/useActivity';
import { mapsTo } from '@/utils/common';
import { Loading } from '@/components/ui/Loading';
import { useHomeDashboard } from '@/hooks/useHome';
import { useJobList, useEnterpriseList } from '@/hooks/useJob';
import { ActivityCard, JobCard, TenantPicker } from '@/components/biz';
import { getTenantName, setTenant, getTenantId } from '@/utils/tenant';
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Taro from '@tarojs/taro';

export default function HomePage() {
	// 状态：当前 Tenant
	const [currentName, setCurrentName] = useState(getTenantName() || '请选择街道');

	// 执行：切换 Tenant
	const queryClient = useQueryClient();
	const handleTenantChange = useCallback(
		(code: string | number, name: string) => {
			const oldTenantId = getTenantId();
			if (oldTenantId === code.toString()) return;

			// 更新本地缓存和当前状态
			setTenant(code.toString(), name);
			setCurrentName(name);
			Taro.showToast({ title: '切换成功', icon: 'success' });

			// 刷新 Tanent 全局缓存
			queryClient.invalidateQueries({ queryKey: ['tenant'] });
		},
		[queryClient],
	);

	// 数据：首页轮播图、概览数据
	const { data: dashboard, isLoading: isDashboardLoading } = useHomeDashboard();

	// 计算：提取统计数据，给兜底值 0
	const stats = dashboard?.statistics || {
		volunteerCount: 0,
		totalDuration: 0,
		resolvedDemands: 0,
	};

	// 计算：提取轮播图
	const banners = dashboard?.banners || [];

	// 数据：推荐的志愿活动
	const { data: activityData, isLoading: isActivityLoading } = useActivityList({
		isRecommend: true,
		pageSize: 5,
	});

	// 数据：推荐的岗位列表
	const { data: jobData, isLoading: isJobLoading } = useJobList({
		isRecommend: true,
		pageSize: 5,
	});

	// 数据：推荐的企业列表
	const { data: enterpriceData, isLoading: isEnterpriseLoading } = useEnterpriseList({
		isRecommend: true,
		pageSize: 10,
	});

	// 计算：扁平化分页数据
	const activityList = activityData?.pages.flatMap((page) => page.list) || [];
	const jobList = jobData?.pages.flatMap((page) => page.list) || [];
	const enterpriceList = enterpriceData?.pages.flatMap((page) => page.list) || [];

	return (
		<Page hasTabBar>
			<View className="container-x">
				<View className="py-3 flex items-center justify-between">
					{/* Tenant 切换器 */}
					<TenantPicker onChange={handleTenantChange}>
						<View className="flex items-center gap-1.5 active:opacity-60 transition-opacity p-1 -ml-1">
							<View className="icon-[ph--map-pin-bold] w-4 h-4 text-primary" />
							{/* 动态展示当前街道名 */}
							<Text className="text-sm font-bold text-text-title truncate max-w-36">
								{currentName}
							</Text>
							<View className="icon-[ph--caret-down-bold] w-3 h-3 text-text-muted" />
						</View>
					</TenantPicker>

					{/* 右上角用户菜单 */}
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
					{isDashboardLoading ? (
						<View className="w-full h-32 bg-gray-100 animate-pulse rounded-lg mx-4" />
					) : (
						<Carousel list={banners} isFull />
					)}
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
					<View
						className={`flex justify-around py-1 transition-opacity duration-300 ${isDashboardLoading ? 'opacity-0' : 'opacity-100'}`}
					>
						<View className="text-center">
							<Text className="text-xl font-bold text-primary block">
								{stats.volunteerCount.toLocaleString()}
							</Text>
							<Text className="text-xs text-text-muted mt-0.5 block">活跃志愿者</Text>
						</View>
						<Divider orientation="vertical" />
						<View className="text-center">
							<Text className="text-xl font-bold text-green-600 block">
								{stats.totalDuration.toLocaleString()}
							</Text>
							<Text className="text-xs text-text-muted mt-0.5 block">
								累计服务工时
							</Text>
						</View>
						<Divider orientation="vertical" />
						<View className="text-center">
							<Text className="text-xl font-bold text-orange-500 block">
								{stats.resolvedDemands.toLocaleString()}
							</Text>
							<Text className="text-xs text-text-muted mt-0.5 block">已解决求助</Text>
						</View>
					</View>
				</Cell>
			</View>

			<View className="container-x mb-4">
				<Cell>
					<Heading
						title="精选志愿活动"
						link={{ name: '更多活动', url: '/pages/activity/index' }}
					/>

					{/* 志愿活动列表 */}
					<View className="flex flex-col gap-2">
						{isActivityLoading ? (
							<Loading />
						) : activityList.length === 0 ? (
							<Empty title="暂无志愿活动" />
						) : (
							<>
								{activityList.map((item, index) => (
									<View key={item.activityId}>
										<ActivityCard activity={item} layout="horizontal" />
										{index < activityList.length - 1 && (
											<Divider className="mt-4" />
										)}
									</View>
								))}
							</>
						)}
					</View>
				</Cell>
			</View>

			<View className="container-x mt-2 mb-4">
				<Heading
					title="家门口岗位"
					link={{ name: '更多岗位', url: '/pages/activity/index' }}
				/>

				{/* 岗位列表 */}
				<View className="flex flex-col gap-4 divide-y divide-gray-100">
					{isJobLoading ? (
						<Loading />
					) : jobList.length === 0 ? (
						<Empty title="暂无匹配的岗位" />
					) : (
						<>
							{jobList.map((item) => (
								<Cell>
									<JobCard key={item.id} job={item} />
								</Cell>
							))}
						</>
					)}
				</View>
			</View>
		</Page>
	);
}
