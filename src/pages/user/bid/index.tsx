import { View, ScrollView } from '@tarojs/components';
import { useMyBidList } from '@/hooks/useDemand';
import { Page, Empty, Loading, Divider, Cell } from '@/components/ui';
import { BidRecordCard } from '@/components/biz';
import { mapsTo } from '@/utils/common';
import { MyBidItem } from '@/types/demand';
import Taro from '@tarojs/taro';

export default function MyBidsPage() {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useMyBidList();

	const list = data?.pages.flatMap((page) => page.list) || [];

	// 查看原需求单
	const handleViewDemand = (demandId: number) => {
		mapsTo(`/pages/demand/detail/index?id=${demandId}`);
	};

	// 跳转到服务订单
	const handleGoToOrder = (demandId: number) => {
		mapsTo(`/pages/order/detail/index?demandId=${demandId}`);
	};

	// 编辑报价单
	const handleEditBid = (record: MyBidItem) => {
		Taro.setStorageSync('temp_edit_bid_data', record);
		mapsTo(`/pages/user/bid/edit/index?id=${record.id}`);
	};

	return (
		<Page>
			<ScrollView
				scrollY
				className="h-screen"
				onScrollToLower={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
				enhanced
				showScrollbar={false}
			>
				<View className="container-x py-3 flex flex-col gap-4">
					{isLoading ? (
						<Loading />
					) : list.length === 0 ? (
						<Empty title="暂无抢单报价记录" />
					) : (
						<>
							{list.map((bid) => (
								<Cell key={bid.id} className="p-6">
									<BidRecordCard
										record={bid}
										onClickDemand={handleViewDemand}
										onGoToOrder={handleGoToOrder}
										onEdit={handleEditBid}
									/>
								</Cell>
							))}
							{isFetchingNextPage && <Loading />}
							{!hasNextPage && <Divider>没有更多记录了</Divider>}
						</>
					)}
				</View>
			</ScrollView>
		</Page>
	);
}
