import { View, ScrollView, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { Page, Empty, Loading, Divider, Cell } from '@/components/ui';
import { DemandBidCard } from '@/components/biz';
import { useDemandBidList } from '@/hooks/useDemand';
import { DemandBidItem } from '@/types/demand';
import { mapsTo } from '@/utils/common';
import { useCreateServiceOrder } from '@/hooks/useOrder';

/**
 * 用户需求单的报价列表
 */
export default function UserDemandBidPage() {
	const { params } = useRouter();
	const demandId = Number(params.id);

	// 获取投递了该需求单的所有服务方报价列表数据 (支持分页/无限滚动)
	const { list, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useDemandBidList(demandId);

	// 跳转志愿者/机构统一公开主页
	const handleViewProfile = (user: DemandBidItem) => mapsTo(`/pages/provider/index?id=${user.userId}`);

	// 创建服务订单的 mutation hook
	const { mutate: createOrder, isLoading: isSubmitting } = useCreateServiceOrder();

	// 执行：选中该服务方，触发系统级严肃二次确认
	const handleSelect = (bid: DemandBidItem) => {
		Taro.showModal({
			title: '确认选择服务方',
			content: `确定选择【${bid.name}】为您提供服务吗？`,
			confirmText: '下一步',
			success: (modalRes) => {
				if (modalRes.confirm) {
					Taro.showActionSheet({
						itemList: ['线上支付', '线下支付'],
						success: (sheetRes) => {
							const payType = sheetRes.tapIndex === 0 ? 'online' : 'offline';
							Taro.showLoading({ title: '订单锁定生成中...', mask: true });
							createOrder({
								demandId,
								id: bid.id,
								payType,
							});
						},
						fail: () => console.log('用户取消了支付方式选择'),
					});
				}
			},
		});
	};

	return (
		<Page className="bg-main-bg">
			<ScrollView
				scrollY
				className="h-screen"
				onScrollToLower={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
				enhanced
				showScrollbar={false}
			>
				<View className="container-x py-4 space-y-4">
					{/* 顶部动态摘要区 */}
					{list.length > 0 && (
						<View className="px-1">
							<View className="text-sm text-text-title font-medium">
								共有 <Text className="text-primary font-bold">{list.length}</Text> 位服务方参与抢单
							</View>
							<View className="text-xs text-text-muted mt-1">
								请综合考量服务方的身份核验、报价留言进行决策
							</View>
						</View>
					)}

					{/* 列表渲染与状态分流 */}
					{isLoading ? (
						<Loading />
					) : list.length === 0 ? (
						<Empty title="暂无接单服务方，请耐心等待..." />
					) : (
						<>
							{list.map((item) => (
								<Cell key={item.id} className="shadow-sm p-0 overflow-hidden rounded-xl">
									<DemandBidCard
										bid={item}
										onViewProfile={handleViewProfile}
										onSelect={handleSelect}
									/>
								</Cell>
							))}

							{/* 分页加载反馈 */}
							{isFetchingNextPage && <Loading />}
							{!hasNextPage && <Divider>没有更多服务方申请了</Divider>}
						</>
					)}
				</View>
			</ScrollView>

			{isSubmitting && (
				<View className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 pb-safe">
					<View className="bg-white p-5 rounded-xl flex flex-col items-center shadow-2xl">
						<Loading />
						<View className="text-sm mt-3 text-text-title font-medium">正在锁定服务方，生成订单...</View>
					</View>
				</View>
			)}
		</Page>
	);
}
