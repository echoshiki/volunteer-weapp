import { View, ScrollView, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { Page, Empty, Loading, Divider, Cell } from '@/components/ui';
import { DemandBidCard } from '@/components/biz/DemandBidCard';
import { useDemandBidList } from '@/hooks/useDemand';
import { DemandBidItem } from '@/types/demand';
import { mapsTo } from '@/utils/common';

export default function ApplicantsPage() {
	const { params } = useRouter();
	const demandId = Number(params.id);

	// 获取投递了该需求单的所有服务方报价列表数据 (支持分页/无限滚动)
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
		useDemandBidList(demandId);

	const list = data?.pages.flatMap((page) => page.list) || [];

	// 执行：跳转志愿者/机构统一公开主页
	const handleViewProfile = (user: DemandBidItem) => {
		mapsTo(`/pages/provider/index?id=${user.userId}`);
	};

	// 执行：选中该服务方，触发系统级严肃二次确认
	const handleSelect = (user: DemandBidItem) => {
		Taro.showModal({
			title: '确认选择服务方',
			content: `确定选择【${user.name}】为您提供服务吗？\n确认后系统将自动为您生成对应的服务订单。`,
			confirmText: '确认选 Ta',
			confirmColor: '#2563eb',
			success: (res) => {},
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
								共有 <Text className="text-primary font-bold">{list.length}</Text>{' '}
								位服务方参与抢单
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
								<Cell
									key={item.userId}
									className="shadow-sm p-0 overflow-hidden rounded-xl"
								>
									<DemandBidCard
										user={item}
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
		</Page>
	);
}
