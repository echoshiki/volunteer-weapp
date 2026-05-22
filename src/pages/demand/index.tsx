import { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useDemandTargets, useDemandTags, useDemandList } from '@/hooks/useDemand';
import { mapsTo } from '@/utils/common';
import { DemandCard } from '@/components/biz';
import { Badge, Cell, Divider, Empty, Loading, Page } from '@/components/ui';

export default function DemandPage() {
	// 筛选状态字典
	const [activeCategoryId, setActiveCategoryId] = useState<number | string>('');
	const [activeTagId, setActiveTagId] = useState<number | string>('');

	// 获取远程数据
	const { data: targets, isLoading: targetsLoading } = useDemandTargets();

	// 标签请求：传入当前选中的分类ID，实现级联
	const { data: tags, isLoading: tagsLoading } = useDemandTags(activeCategoryId || undefined);

	// 需求订单请求：默认只请求待接单状态的订单，且根据 activeCategoryId 和 activeTagId 进行过滤
	const {
		data: ordersData,
		isLoading: ordersLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useDemandList({
		categoryUserId: activeCategoryId || undefined,
		demandId: activeTagId || undefined,
		status: 'approved',
		acceptStatus: 'dispatching',
	});

	// 展平分页数据
	const orders = useMemo(() => {
		return ordersData?.pages.flatMap((page) => page.list) || [];
	}, [ordersData]);

	return (
		<Page hasTabBar>
			{/* 顶部 Sticky 筛选区 */}
			<Cell className="sticky top-0 z-10 bg-white border-b border-gray-100 flex flex-col gap-2">
				{/* 服务对象 */}
				<ScrollView scrollX className="whitespace-nowrap" showScrollbar={false}>
					<View className="flex gap-2">
						<Badge
							variant={`${activeCategoryId === '' ? 'info' : 'secondary'}`}
							onClick={() => {
								setActiveCategoryId('');
								setActiveTagId('');
							}}
						>
							全部对象
						</Badge>
						{targets?.map((target) => (
							<Badge
								key={target.categoryUserId}
								variant={`${activeCategoryId === target.categoryUserId ? 'info' : 'secondary'}`}
								onClick={() => {
									setActiveCategoryId(target.categoryUserId);
									setActiveTagId('');
								}}
							>
								{target.categoryUserName}
							</Badge>
						))}
					</View>
				</ScrollView>

				{/* 需求标签 */}
				<ScrollView scrollX className="whitespace-nowrap" showScrollbar={false}>
					<View className="flex gap-2">
						<Badge
							variant={`${activeTagId === '' ? 'primary' : 'secondary'}`}
							onClick={() => setActiveTagId('')}
						>
							全部标签
						</Badge>
						{tags?.map((tag) => (
							<Badge
								key={tag.demandId}
								variant={`${activeTagId === tag.demandId ? 'primary' : 'secondary'}`}
								onClick={() => setActiveTagId(tag.demandId)}
							>
								{tag.demandName}
							</Badge>
						))}
					</View>
				</ScrollView>
			</Cell>

			{/* 列表渲染区 */}
			<ScrollView
				scrollY
				className="h-[calc(100vh-120px)]"
				onScrollToLower={() => hasNextPage && fetchNextPage()}
			>
				<View className="container-x py-2 space-y-4">
					{ordersLoading ? (
						<Loading />
					) : orders.length === 0 ? (
						<Empty title="暂无暂无匹配的需求，换个条件试试吧数据" />
					) : (
						<>
							{orders.map((item) => (
								<Cell>
									<DemandCard key={item.orderId} demand={item} />
								</Cell>
							))}
							{isFetchingNextPage && <Loading />}
							{!hasNextPage && <Divider>没有更多需求了</Divider>}
						</>
					)}
				</View>
			</ScrollView>

			{/* 发布需求按钮 */}
			<View
				className="fixed right-6 bottom-10 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-red-200 active:scale-95 transition-transform z-20"
				onClick={() => mapsTo('/pages/demand/publish/index')}
			>
				<View className="flex flex-col items-center justify-center">
					<View className="icon-[ph--plus-bold] w-6 h-6" />
					<Text className="text-xs font-bold scale-90 mt-0.5">发布</Text>
				</View>
			</View>
		</Page>
	);
}
