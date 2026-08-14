import { useState } from 'react';
import { View, ScrollView } from '@tarojs/components';
import { useDeleteDemand, useUserDemandList } from '@/hooks/useDemand';
import { Page, Empty, Loading, Divider, Cell } from '@/components/ui';
import { DemandRecordCard } from '@/components/biz';
import { mapsTo } from '@/utils/common';
import { DemandItem } from '@/types/demand';
import Taro, { useDidShow } from '@tarojs/taro';

export default function UserDemandPage() {
	const { list, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } = useUserDemandList();
	const { mutate: deleteDemand } = useDeleteDemand();
	const [refreshing, setRefreshing] = useState(false);

	// 页面可见/切回前台时自动拉取最新数据
	useDidShow(() => {
		refetch();
	});

	// 手动下拉刷新
	const handleRefresh = async () => {
		setRefreshing(true);
		try {
			await refetch();
		} finally {
			setRefreshing(false);
		}
	};

	// 执行：跳转到需求编辑页
	const handleEdit = (demand: DemandItem) => {
		if (demand.status === 'approved') {
			Taro.showModal({
				title: '温馨提示',
				content: '修改需求需要重新提交审核，且当前所有的抢单记录将被失效，是否继续？',
				success: function (res) {
					if (res.confirm) mapsTo(`/pages/user/demand/edit/index?id=${demand.demandId}`);
				},
			});
		} else {
			mapsTo(`/pages/user/demand/edit/index?id=${demand.demandId}`);
		}
	};

	const handleViewDetail = (demand: DemandItem) => mapsTo(`/pages/demand/detail/index?id=${demand.demandId}`);
	const handleViewBid = (demand: DemandItem) => mapsTo(`/pages/user/demand/bid/index?id=${demand.demandId}`);
	const handleViewOrder = (demand: DemandItem) => mapsTo(`/pages/order/detail/index?id=${demand.orderId}`);
	const handleDelete = (demand: DemandItem) => {
		Taro.showModal({
			title: '删除确认',
			content: `您确定要删除需求“${demand.demandName}”吗？删除后将无法恢复。`,
			confirmColor: '#ef4444',
			success: async (res) => {
				if (res.confirm) {
					Taro.showLoading({ title: '正在下架删除...', mask: true });
					try {
						await deleteDemand(demand.demandId);
					} catch (err) {}
				}
			},
		});
	};
	return (
		<Page>
			<ScrollView
				scrollY
				className="h-[calc(100vh-10px)]"
				refresherEnabled
				refresherTriggered={refreshing}
				onRefresherRefresh={handleRefresh}
				onScrollToLower={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
				enhanced
				showScrollbar={false}
			>
				<View className="container-x py-2 flex flex-col gap-4">
					{isLoading ? (
						<Loading />
					) : list.length === 0 ? (
						<Empty title="暂无已发布的需求" />
					) : (
						<>
							{list.map((item) => (
								<Cell key={item.demandId}>
									<DemandRecordCard
										record={item}
										onClick={handleViewDetail}
										onEdit={handleEdit}
										onViewBid={handleViewBid}
										onViewOrder={handleViewOrder}
										onDelete={handleDelete}
									/>
								</Cell>
							))}
							{isFetchingNextPage && <Loading />}
							{!hasNextPage && <Divider>没有更多数据了</Divider>}
						</>
					)}
				</View>
			</ScrollView>
		</Page>
	);
}
