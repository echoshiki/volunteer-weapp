import { View, ScrollView } from '@tarojs/components';
import { useEmployerOrderList } from '@/hooks/useOrder';
import { Page, Empty, Loading, Divider, Cell } from '@/components/ui';
import { OrderRecordCard } from '@/components/biz/OrderRecordCard';
import { mapsTo } from '@/utils/common';

export default function EmployerOrderListPage() {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
		useEmployerOrderList();
	const list = data?.pages.flatMap((page) => page.list) || [];

	const handleAction = (type: string, item: any) => {
		// 所有核心交互动作（支付、确认完工等），为了防止逻辑外溢，统一导流去详情页收拢处理！
		mapsTo(`/pages/order/detail/index?id=${item.orderId}&action=${type}`);
	};

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
						<Empty title="暂无相关服务订单" />
					) : (
						<>
							{list.map((order) => (
								<Cell
									key={order.orderId}
									className="p-0 shadow-sm overflow-hidden rounded-xl"
								>
									<OrderRecordCard
										record={order}
										viewMode="employer"
										onClick={(id) =>
											mapsTo(`/pages/order/detail/index?id=${id}`)
										}
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
