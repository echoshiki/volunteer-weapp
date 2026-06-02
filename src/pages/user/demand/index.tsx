import { View, ScrollView } from '@tarojs/components';
import { useUserDemandList } from '@/hooks/useDemand';
import { Page, Empty, Loading, Divider, Cell } from '@/components/ui';
import { DemandRecordCard } from '@/components/biz';

export default function UserDemandPage() {
	// 数据：用户活动报名记录列表
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useUserDemandList();

	// 执行：扁平化分页数据
	const list = data?.pages.flatMap((page) => page.list) || [];

	return (
		<Page>
			<ScrollView
				scrollY
				className="h-[calc(100vh-10px)]"
				onScrollToLower={() => hasNextPage && fetchNextPage()}
			>
				<View className="container-x py-2 flex flex-col gap-4">
					{isLoading ? (
						<Loading />
					) : list.length === 0 ? (
						<Empty title="暂无已报名的活动" />
					) : (
						<>
							{list.map((item) => (
								<Cell>
									<DemandRecordCard key={item.demandId} record={item} />
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
