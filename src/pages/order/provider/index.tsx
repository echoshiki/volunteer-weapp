import { useState, useEffect } from 'react';
import { View, ScrollView } from '@tarojs/components';
import { useProviderOrderList } from '@/hooks/useOrder';
import { Page, Empty, Loading, Divider, Cell, Tabs } from '@/components/ui';
import { OrderRecordCard } from '@/components/biz';
import { mapsTo } from '@/utils/common';
import { useRouter, useDidShow } from '@tarojs/taro';
import { OrderStatus } from '@/types/order';
import { ORDER_NAV_ITEMS } from '@/constants/order';

export default function ProviderOrderListPage() {
	const { params } = useRouter();
	const [currentTab, setCurrentTab] = useState<OrderStatus | 'all'>('all');
	const [refreshing, setRefreshing] = useState(false);
	const allTabsConfig = [{ label: '全部', value: 'all' }, ...ORDER_NAV_ITEMS];

	useEffect(() => {
		if (params.status) {
			setCurrentTab(params.status as OrderStatus | 'all');
		}
	}, [params.status]);

	const { list, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
		useProviderOrderList(currentTab);

	// 页面切回前台时自动刷新
	useDidShow(() => {
		refetch();
	});

	// 下拉刷新
	const handleRefresh = async () => {
		setRefreshing(true);
		try {
			await refetch();
		} finally {
			setRefreshing(false);
		}
	};

	const handleAction = (type: string, item: any) => {
		mapsTo(`/pages/order/detail/index?id=${item.orderId}&action=${type}`);
	};

	return (
		<Page>
			<Tabs
				tabs={allTabsConfig}
				current={currentTab}
				onChange={(val) => setCurrentTab(val as OrderStatus | 'all')}
				sticky
				scrollable
			/>

			<ScrollView
				scrollY
				className="h-screen"
				refresherEnabled
				refresherTriggered={refreshing}
				onRefresherRefresh={handleRefresh}
				onScrollToLower={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
				enhanced
				showScrollbar={false}
			>
				<View className="container-x py-3 flex flex-col gap-4">
					{isLoading ? (
						<Loading />
					) : list.length === 0 ? (
						<Empty title="暂无抢单履约订单" />
					) : (
						<>
							{list.map((order) => (
								<Cell key={order.orderId} className="p-0 shadow-sm overflow-hidden rounded-xl">
									<OrderRecordCard
										record={order}
										viewMode="provider"
										onClick={(id) => mapsTo(`/pages/order/detail/index?id=${id}`)}
										onAction={handleAction}
									/>
								</Cell>
							))}
							{isFetchingNextPage && <Loading />}
							{!hasNextPage && <Divider>没有更多了</Divider>}
						</>
					)}
				</View>
			</ScrollView>
		</Page>
	);
}
