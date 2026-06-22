import { View, ScrollView } from '@tarojs/components';
import { useAppliedJobList } from '@/hooks/useJob';
import { Page, Empty, Loading, Divider, Cell } from '@/components/ui';
import { AppliedJobRecordCard } from '@/components/biz';
import { mapsTo } from '@/utils/common';

export default function UserJobPage() {
	const { list, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useAppliedJobList();
	const handleCardClick = (jobId: number) => mapsTo(`/pages/job/detail/index?id=${jobId}`);

	return (
		<Page>
			<ScrollView
				scrollY
				className="h-[calc(100vh-10px)]"
				enhanced
				showScrollbar={false}
				onScrollToLower={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
			>
				<View className="container-x py-4 flex flex-col gap-3">
					{isLoading ? (
						<Loading />
					) : list.length === 0 ? (
						<Empty title="暂无投递记录" icon="icon-[ph--paper-plane-tilt-duotone]" />
					) : (
						<>
							{/* 遍历求职记录流 */}
							{list.map((item, index) => (
								<Cell key={`${item.id}-${item.resumeId}-${index}`} className="p-0 overflow-hidden">
									<AppliedJobRecordCard record={item} onClick={handleCardClick} />
								</Cell>
							))}

							{/* 触底加载 Loading 指示器 */}
							{isFetchingNextPage && <Loading />}
							{!hasNextPage && <Divider>已加载全部投递历史</Divider>}
						</>
					)}
				</View>
			</ScrollView>
		</Page>
	);
}
