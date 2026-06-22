import { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { Page, Cell, Empty, Loading, Divider } from '@/components/ui';
import { ApplyRecordCard } from '@/components/biz';
import { useApplyHistory } from '@/hooks/useUser';
import type { ReviewStatus } from '@/types/user';
import { Tabs } from '@/components/ui/Tabs';

const TABS: { label: string; value: ReviewStatus | '' }[] = [
	{ label: '全部', value: '' },
	{ label: '审核中', value: 'pending' },
	{ label: '已通过', value: 'approved' },
	{ label: '已驳回', value: 'rejected' },
];

export default function ApplyHistoryPage() {
	// 状态：当前选中的 Tab
	const [activeStatus, setActiveStatus] = useState<ReviewStatus | ''>('');

	// Hook：获取无限滚动分页数据
	const { list, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useApplyHistory(
		activeStatus ? { status: activeStatus } : {},
	);

	return (
		<Page>
			{/* 顶部 Tab 栏 */}
			<Tabs tabs={TABS} current={activeStatus} onChange={(val) => setActiveStatus(val as ReviewStatus | '')} />

			{/* 列表渲染区 */}
			<ScrollView
				scrollY
				className="h-[calc(100vh-120px)]"
				onScrollToLower={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
				enhanced
				showScrollbar={false}
			>
				<View className="container-x py-4 space-y-4">
					{isLoading ? (
						<Loading />
					) : list.length === 0 ? (
						<Empty title="暂无申请记录" />
					) : (
						<>
							{list.map((item) => (
								<Cell key={item.reviewId}>
									<ApplyRecordCard item={item} />
								</Cell>
							))}

							{/* 分页加载与结束指示器 */}
							{isFetchingNextPage && <Loading />}
							{!hasNextPage && <Divider>没有更多记录了</Divider>}
						</>
					)}
				</View>
			</ScrollView>
		</Page>
	);
}
