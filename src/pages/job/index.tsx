import { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useJobCategories, useJobList } from '@/hooks/useJob';
import {
	Cell,
	Empty,
	Loading,
	Badge,
	Divider,
	Page,
	Button,
	Drawer,
	SearchBar,
	Heading,
} from '@/components/ui';
import { JobCard } from '@/components/biz';

export default function JobPage() {
	// 状态：抽屉组件和搜索框组件是否显示
	const [isOpen, setIsOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	// 状态：搜索框内容、即时输入的内容
	const [keyword, setKeyword] = useState('');
	const [inputValue, setInputValue] = useState('');

	// 状态：最终确认的岗位、即时点选的岗位
	const [appliedJobIds, setAppliedJobIds] = useState<number[]>([]);
	const [draftJobIds, setDraftJobIds] = useState<number[]>([]);

	// 数据：岗位分类
	const { data: categoryList } = useJobCategories();

	// 数据：传递筛选条件后的岗位列表
	const {
		data: jobsData,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useJobList({
		keyword,
		jobIds: appliedJobIds || undefined,
	});

	const jobList = useMemo(() => {
		return jobsData?.pages.flatMap((page) => page.list) || [];
	}, [jobsData]);

	// 执行：搜索
	const handleSearch = () => setKeyword(inputValue);

	// 执行：打开抽屉
	const handleOpenFilter = () => {
		setDraftJobIds([...appliedJobIds]);
		setIsOpen(true);
	};

	// 执行：重置筛选
	const handleResetFilter = () => setDraftJobIds([]);

	// 执行：确认筛选
	const handleConfirmFilter = () => {
		setAppliedJobIds([...draftJobIds]);
		setIsOpen(false);
	};

	// 执行：选中/取消选中岗位
	const toggleDraftJobId = (id: number) => {
		setDraftJobIds((prev) =>
			prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
		);
	};

	// 计算：是否有选中的筛选条件
	const hasActiveFilter = appliedJobIds.length > 0;

	return (
		<Page hasTabBar>
			{/* 顶部岗位分类筛选 */}
			<View className="sticky top-0 z-20 shrink-0 bg-white border-b border-gray-100">
				<View className="container-x h-12 flex items-center justify-between">
					{/* 左侧：筛选唤醒按钮 */}
					<View
						className="flex items-center gap-1 active:opacity-70 transition-opacity py-2"
						onClick={handleOpenFilter}
					>
						<Text
							className={`text-xs ${hasActiveFilter ? 'text-primary' : 'text-text-title'}`}
						>
							高级筛选
						</Text>
						<View
							className={`size-4 ${hasActiveFilter ? 'icon-[ph--funnel-fill] text-primary' : 'icon-[ph--funnel-duotone] text-gray-500'}`}
						/>
					</View>

					{/* 右侧：搜索唤醒按钮 */}
					<View
						className="flex items-center gap-1 border-l border-gray-100 pl-4 active:opacity-70 transition-opacity"
						onClick={() => setIsSearchOpen(!isSearchOpen)}
					>
						<View
							className={`size-4 ${isSearchOpen ? 'icon-[ph--x-bold] text-text-muted' : 'icon-[ph--magnifying-glass-bold] text-text-title'}`}
						/>
						<Text className="text-xs text-text-title">
							{isSearchOpen ? '收起' : '搜索岗位'}
						</Text>
					</View>
				</View>

				{/* 搜索栏 */}
				{isSearchOpen && (
					<View className="container-x py-2 bg-white border-t border-gray-100 animate-fade-in-down">
						<SearchBar
							value={inputValue}
							placeholder="搜索岗位、公司名称"
							onInput={setInputValue}
							onConfirm={handleSearch}
							onSearch={handleSearch}
							showBtn
						/>
					</View>
				)}
			</View>

			{/* 岗位列表 */}
			<ScrollView
				scrollY
				className="h-[calc(100vh-120px)]"
				onScrollToLower={() => hasNextPage && fetchNextPage()}
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
								<Cell>
									<JobCard key={item.id} job={item} />
								</Cell>
							))}
							{isFetchingNextPage && <Loading />}
							{!hasNextPage && <Divider>没有更多岗位了</Divider>}
						</>
					)}
				</View>
			</ScrollView>

			{/* 高级筛选抽屉 */}
			<Drawer
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title="高级筛选"
				footer={
					<View className="flex gap-4">
						<Button size="sm" variant="secondary" onClick={handleResetFilter}>
							重置
						</Button>
						<Button
							size="sm"
							variant="primary"
							className="flex-1"
							onClick={handleConfirmFilter}
						>
							确定
						</Button>
					</View>
				}
			>
				<View className="px-4 py-6 flex flex-col gap-6">
					<View className="flex flex-col gap-2">
						<Heading title="岗位分类" size="sm" />
						<View className="flex flex-wrap gap-2.5">
							<Badge
								variant={draftJobIds.length === 0 ? 'primary' : 'secondary'}
								onClick={() => setDraftJobIds([])}
								size="sm"
							>
								全部
							</Badge>

							{/* 具体的分类遍历 */}
							{categoryList?.map((cat) => {
								const isSelected = draftJobIds.includes(cat.jobId);
								return (
									<Badge
										key={cat.jobId}
										variant={isSelected ? 'primary' : 'secondary'}
										onClick={() => toggleDraftJobId(cat.jobId)}
										size="sm"
									>
										{cat.jobTitle}
									</Badge>
								);
							})}
						</View>
					</View>
				</View>
			</Drawer>
		</Page>
	);
}
