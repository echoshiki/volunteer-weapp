import { View, ScrollView } from '@tarojs/components';
import { useProviderOrderList } from '@/hooks/useOrder';
import { Page, Empty, Loading, Divider, Cell } from '@/components/ui';
import { OrderRecordCard } from '@/components/biz/OrderRecordCard';
import { mapsTo } from '@/utils/common';

export default function ProviderOrderListPage() {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
		useProviderOrderList();
	const list = data?.pages.flatMap((page) => page.list) || [];

	return (
		<Page>
			<ScrollView
				scrollY
				className="h-screen bg-main-bg"
				onScrollToLower={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
			>
				<View className="container-x py-3 flex flex-col gap-4">
					{isLoading ? (
						<Loading />
					) : list.length === 0 ? (
						<Empty title="暂无抢单履约订单" />
					) : (
						<>
							{list.map((order) => (
								<Cell
									key={order.orderId}
									className="p-0 shadow-sm overflow-hidden rounded-xl"
								>
									<OrderRecordCard
										record={order}
										viewMode="provider"
										onClick={(id) =>
											mapsTo(`/pages/order/detail/index?id=${id}`)
										}
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
