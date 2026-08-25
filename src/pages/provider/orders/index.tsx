import { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import { Page, Cell, Loading, Empty, Badge, Rate, Divider } from '@/components/ui';
import { useProviderOrderList } from '@/hooks/useProvider';

export default function ProviderOrdersPage() {
	const { params } = useRouter();
	const userId = Number(params.userId);

	const [refreshing, setRefreshing] = useState(false);

	const { list, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } = useProviderOrderList(userId);

	// 下拉刷新
	const handleRefresh = async () => {
		setRefreshing(true);
		try {
			await refetch();
		} finally {
			setRefreshing(false);
		}
	};

	// 上拉加载下一页
	const handleScrollToLower = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	if (isLoading) return <Loading title="正在加载服务记录..." />;

	return (
		<Page className="bg-main-bg min-h-screen">
			<ScrollView
				scrollY
				className="h-screen"
				refresherEnabled
				refresherTriggered={refreshing}
				onRefresherRefresh={handleRefresh}
				onScrollToLower={handleScrollToLower}
			>
				<View className="container-x py-4 space-y-3 pb-10">
					{list.length === 0 ? (
						<Empty title="暂无已完成的服务记录" subTitle="该服务方暂无历史履约评价数据" />
					) : (
						list.map((item, index) => (
							<Cell key={index} className="p-4 flex flex-col gap-2.5">
								{/* 头部：需求名称与区域徽章 */}
								<View className="flex items-start justify-between gap-2">
									<Text className="text-base font-bold text-text-title line-clamp-2 flex-1">
										{item.demandName || '便民互助服务'}
									</Text>
								</View>

								{/* 中部：星级评分与服务完成时间 */}
								<View className="flex items-center justify-between text-xs text-text-muted mt-1">
									<View className="flex items-center gap-1.5">
										<Text className="text-xs text-text-body font-medium">服务评分</Text>
										<Rate value={item.rating || 5} readonly size={4} />
									</View>
									{item.completeTime && (
										<Text className="text-xs text-text-muted">{item.completeTime}</Text>
									)}
								</View>

								{/* 底部：用户评价内容 */}
								<View className="bg-gray-50 rounded-lg p-3 mt-1">
									<Text className="text-xs text-text-muted block mb-1">雇主评价：</Text>
									<Text className="text-sm text-text-body leading-relaxed">
										{item.comment ? item.comment : '雇主已确认完成服务，未留下额外文字评价。'}
									</Text>
								</View>

								<View className="flex items-end justify-end">
									{item.tenantName && (
										<Badge variant="secondary" size="sm" className="shrink-0 mt-0.5">
											{item.tenantName}
										</Badge>
									)}
								</View>
							</Cell>
						))
					)}

					{/* 分页加载中或无更多提示 */}
					{isFetchingNextPage && <Loading title="加载更多记录..." />}
					{!hasNextPage && list.length > 0 && <Divider>已加载全部服务记录</Divider>}
				</View>
			</ScrollView>
		</Page>
	);
}
