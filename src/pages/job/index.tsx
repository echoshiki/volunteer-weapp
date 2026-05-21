import { useState, useMemo } from 'react';
import { View, ScrollView } from '@tarojs/components';
import { useJobCategories, useJobList } from '@/hooks/useJob';
import { Cell, Empty, Loading, Badge, Divider, Page } from '@/components/ui';
import { JobCard } from '@/components/biz';

export default function JobPage() {
	const [activeJobId, setActiveJobId] = useState<number | string>('');
	const { data: categories } = useJobCategories();
	const {
		data: jobsData,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useJobList({
		jobId: activeJobId || undefined,
	});

	const jobList = useMemo(() => {
		return jobsData?.pages.flatMap((page) => page.list) || [];
	}, [jobsData]);

	const handleScrollToLower = () => {
		if (hasNextPage && !isFetchingNextPage) fetchNextPage();
	};

	return (
		<Page hasTabBar>
			{/* 顶部岗位分类筛选 */}
			<Cell className="sticky top-0 z-10 border-b border-gray-100">
				<View className="flex flex-wrap gap-2">
					<Badge
						variant={activeJobId === '' ? 'primary' : 'secondary'}
						size="sm"
						onClick={() => setActiveJobId('')}
					>
						全部岗位
					</Badge>

					{categories?.map((cat) => (
						<Badge
							key={cat.jobId}
							size="sm"
							variant={activeJobId === cat.jobId ? 'primary' : 'secondary'}
							onClick={() => setActiveJobId(cat.jobId)}
						>
							{cat.jobTitle}
						</Badge>
					))}
				</View>
			</Cell>

			{/* 岗位列表 */}
			<ScrollView
				scrollY
				className="h-[calc(100vh-120px)]"
				onScrollToLower={handleScrollToLower}
				style={{ height: 'calc(100vh - 60px)' }}
			>
				<View className="container-x py-2 flex flex-col gap-4">
					{isLoading ? (
						<Loading />
					) : jobList.length === 0 ? (
						<Empty title="暂无匹配的岗位" />
					) : (
						<>
							{jobList.map((item) => (
								<JobCard key={item.id} job={item} />
							))}
							{isFetchingNextPage && <Loading />}
							{!hasNextPage && <Divider>没有更多岗位了</Divider>}
						</>
					)}
				</View>
			</ScrollView>
		</Page>
	);
}
