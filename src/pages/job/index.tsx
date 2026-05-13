import { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { useJobCategories, useJobs } from '@/hooks/useJob';
import { Badge } from '@/components/ui/Badge';

export default function JobHall() {
	const [activeJobId, setActiveJobId] = useState<number | string>('');

	const { data: categories } = useJobCategories();
	const {
		data: jobsData,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useJobs({
		jobId: activeJobId || undefined,
	});

	const jobs = useMemo(() => {
		return jobsData?.pages.flatMap((page) => page.list) || [];
	}, [jobsData]);

	const handleScrollToLower = () => {
		if (hasNextPage && !isFetchingNextPage) fetchNextPage();
	};

	return (
		<View className="min-h-screen bg-main-bg flex flex-col">
			{/* 顶部岗位分类筛选 */}
			<View className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
				<View className="flex flex-wrap gap-2 p-4 ">
					<Badge
						variant={activeJobId === '' ? 'primary' : 'gray'}
						size="md"
						onClick={() => setActiveJobId('')}
					>
						全部岗位
					</Badge>

					{categories?.map((cat) => (
						<Badge
							key={cat.jobId}
							size="md"
							variant={activeJobId === cat.jobId ? 'primary' : 'gray'}
							onClick={() => setActiveJobId(cat.jobId)}
						>
							{cat.jobTitle}
						</Badge>
					))}
				</View>
			</View>

			{/* 岗位列表 */}
			<ScrollView
				scrollY
				className="h-[calc(100vh-120px)]"
				onScrollToLower={handleScrollToLower}
				style={{ height: 'calc(100vh - 60px)' }}
			>
				<View className="p-4 space-y-3 pb-8">
					{isLoading && jobs.length === 0 ? (
						<View className="text-center py-10 text-text-muted text-sm">加载中...</View>
					) : jobs.length === 0 ? (
						<View className="text-center py-10 text-text-muted text-sm">
							暂无匹配的岗位
						</View>
					) : (
						jobs.map((job) => (
							<View
								key={job.id}
								className="bg-white rounded-card p-4 shadow-sm active:scale-[0.98] transition-transform"
								onClick={() =>
									navigateTo({
										url: `/pages/job/detail/index?id=${job.enterprisesId}`,
									})
								}
							>
								<View className="flex justify-between items-start mb-2">
									<Text className="text-text-title font-bold text-base line-clamp-1 flex-1 pr-2">
										{job.title}
									</Text>
									<Text className="text-primary font-bold text-base whitespace-nowrap">
										{/* 接口返回的是千元，这里简单处理加上 k */}
										{job.salaryBudget}k
									</Text>
								</View>

								{/* 标签区 */}
								<View className="flex items-center gap-2 mb-4">
									<Text className="text-xs text-text-muted bg-gray-100 px-2 py-1 rounded">
										招 {job.hireCount} 人
									</Text>
									<Text className="text-xs text-text-muted bg-gray-100 px-2 py-1 rounded">
										{job.jobTitle}
									</Text>
								</View>

								{/* 企业信息底栏 */}
								<View className="flex items-center gap-2 border-t border-gray-50 pt-3 text-xs text-text-muted">
									<View className="icon-[ph--buildings] w-4 h-4" />
									<Text className="truncate flex-1">{job.enterprisesName}</Text>
									<Text className="text-primary font-bold">查看详情 &gt;</Text>
								</View>
							</View>
						))
					)}
					{isFetchingNextPage && (
						<View className="text-center py-3 text-text-muted text-xs">
							加载更多中...
						</View>
					)}
					{!hasNextPage && jobs.length > 0 && (
						<View className="text-center py-4 text-text-muted text-xs">
							没有更多岗位了
						</View>
					)}
				</View>
			</ScrollView>
		</View>
	);
}
