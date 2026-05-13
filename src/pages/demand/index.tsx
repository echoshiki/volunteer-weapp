import { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useDemandTargets, useDemandTags, useDemandOrders } from '@/hooks/useDemand';
import { mapsTo } from '@/utils/common';
import { DemandStatusBadge } from '@/components/biz/DemandStatusBadge';

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
	} = useDemandOrders({
		categoryUserId: activeCategoryId || undefined,
		demandId: activeTagId || undefined,
		status: 'approved',
		acceptStatus: 'dispatching',
	});

	// 展平分页数据
	const orders = useMemo(() => {
		return ordersData?.pages.flatMap((page) => page.list) || [];
	}, [ordersData]);

	// 触底加载更多
	const handleScrollToLower = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	return (
		<View className="min-h-screen bg-main-bg flex flex-col relative">
			{/* 顶部 Sticky 筛选区 */}
			<View className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
				{/* 服务对象分类 */}
				<ScrollView scrollX className="whitespace-nowrap px-4 py-3" showScrollbar={false}>
					<View className="flex gap-4">
						<View
							className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
								activeCategoryId === ''
									? 'bg-primary text-white font-bold'
									: 'bg-gray-100 text-text-muted'
							}`}
							onClick={() => {
								setActiveCategoryId('');
								setActiveTagId('');
							}}
						>
							全部对象
						</View>
						{targets?.map((target) => (
							<View
								key={target.categoryUserId}
								className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
									activeCategoryId === target.categoryUserId
										? 'bg-primary text-white font-bold'
										: 'bg-gray-100 text-text-muted'
								}`}
								onClick={() => {
									setActiveCategoryId(target.categoryUserId);
									setActiveTagId('');
								}}
							>
								{target.categoryUserName}
							</View>
						))}
					</View>
				</ScrollView>

				{/* 需求标签 */}
				<ScrollView
					scrollX
					className="whitespace-nowrap px-4 py-2 pb-3"
					showScrollbar={false}
				>
					<View className="flex gap-2">
						<View
							className={`text-xs px-3 py-1 rounded-md border transition-colors ${
								activeTagId === ''
									? 'border-primary text-primary bg-red-50'
									: 'border-gray-200 text-text-muted bg-white'
							}`}
							onClick={() => setActiveTagId('')}
						>
							全部标签
						</View>
						{tags?.map((tag) => (
							<View
								key={tag.demandId}
								className={`text-xs px-3 py-1 rounded-md border transition-colors ${
									activeTagId === tag.demandId
										? 'border-primary text-primary bg-red-50'
										: 'border-gray-200 text-text-muted bg-white'
								}`}
								onClick={() => setActiveTagId(tag.demandId)}
							>
								{tag.demandName}
							</View>
						))}
					</View>
				</ScrollView>
			</View>

			{/* 列表渲染区 */}
			<ScrollView
				scrollY
				className="flex-1"
				onScrollToLower={handleScrollToLower}
				style={{ height: 'calc(100vh - 110px)' }}
			>
				<View className="p-4 space-y-3 pb-24">
					{ordersLoading && orders.length === 0 ? (
						<View className="text-center py-10 text-text-muted text-sm">加载中...</View>
					) : orders.length === 0 ? (
						<View className="text-center py-10 text-text-muted text-sm">
							暂无匹配的需求，换个条件试试吧
						</View>
					) : (
						orders.map((order) => (
							<View
								key={order.oderId}
								className="bg-white rounded-card p-4 shadow-sm active:scale-[0.98] transition-transform"
								onClick={() =>
									mapsTo(`/pages/demand/detail/index?id=${order.oderId}`)
								}
							>
								<View className="flex justify-between items-start mb-2">
									<Text className="text-text-title font-bold text-base line-clamp-1 flex-1 pr-2">
										{order.oderName}
									</Text>
									<DemandStatusBadge status={order.acceptStatus} />
								</View>

								<View className="flex items-center gap-2 mb-3">
									<Text className="text-xs text-text-muted bg-gray-100 px-2 py-0.5 rounded">
										{order.categoryUserName}
									</Text>
									<Text className="text-xs text-primary bg-red-50 px-2 py-0.5 rounded">
										{order.demandName}
									</Text>
									<Text
										className={`text-xs px-2 py-0.5 rounded ${order.charge ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'}`}
									>
										{order.charge ? '公益免费' : '付费服务'}
									</Text>
								</View>

								<Text className="text-sm text-text-body line-clamp-2 mb-3">
									{order.description}
								</Text>

								<View className="flex justify-between items-end border-t border-gray-50 pt-3">
									<View className="flex flex-col gap-1">
										<View className="flex items-center gap-1 text-text-muted text-xs">
											<View className="icon-[ph--user] w-3 h-3" />
											<Text>{order.nickName}</Text>
											<Text className="ml-1 px-1 bg-gray-100 rounded text-xs scale-90 origin-left">
												{order.serviceScope === 'group' ? '集体' : '个人'}
											</Text>
										</View>
									</View>

									{order.acceptStatus === 'dispatching' && (
										<View className="bg-primary text-white text-xs px-4 py-1.5 rounded-full font-bold shadow-sm">
											去接单
										</View>
									)}
								</View>
							</View>
						))
					)}
					{isFetchingNextPage && (
						<View className="text-center py-3 text-text-muted text-xs">
							加载更多中...
						</View>
					)}
					{!hasNextPage && orders.length > 0 && (
						<View className="text-center py-4 text-text-muted text-xs">
							没有更多需求了
						</View>
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
		</View>
	);
}
