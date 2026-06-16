import { useMemo, useState } from 'react';
import { View, ScrollView, Picker, Text } from '@tarojs/components';
import { Page, Empty, SearchBar, Loading, Divider, Cell } from '@/components/ui';
import { useActivityCategories, useActivityList } from '@/hooks/useActivity';
import { ActivityCard } from '@/components/biz';
import { ACTIVITY_STATUS_MAP } from '@/constants/activity';
import type { ActivityStatus } from '@/types/activity';

const STATUS_OPTIONS = [
	{ label: '全部状态', value: '' },
	...Object.entries(ACTIVITY_STATUS_MAP).map(([key, value]) => ({
		label: value.label,
		value: key as ActivityStatus,
	})),
];

export default function ActivityList() {
	// 状态：搜索
	const [keyword, setKeyword] = useState('');
	const [searchValue, setSearchValue] = useState('');
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	// 状态: 筛选项
	const [statusIndex, setStatusIndex] = useState(0);
	const [categoryIndex, setCategoryIndex] = useState(0);

	// 数据：志愿活动分类
	const { data: categoryList, isLoading: isCategoryLoading } = useActivityCategories();

	// 计算：整理出 UI 组件可用的分类数据格式
	const categoryOptions = useMemo(() => {
		const defaultOption = { label: '全部分类', value: undefined };
		if (!categoryList || categoryList.list.length === 0) return [defaultOption];
		return [
			defaultOption,
			...categoryList.list.map((c) => ({
				label: c.categoryName,
				value: c.categoryId,
			})),
		];
	}, [categoryList]);

	// 计算：当前选中值
	const activeStatus = STATUS_OPTIONS[statusIndex].value;
	const activeCategoryId = categoryOptions[categoryIndex]?.value;

	// 数据：志愿活动列表
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading: isListLoading,
	} = useActivityList({
		keyword: searchValue,
		categoryId: activeCategoryId,
		status: activeStatus || undefined,
	});

	const list = data?.pages.flatMap((page) => page.list) || [];

	// 执行：搜索
	const handleSearch = () => setSearchValue(keyword);

	return (
		<Page>
			<View className="sticky top-0 z-20 shrink-0 bg-white border-b border-gray-100">
				{/* 顶部操作面板 (横向排列) */}
				<View className="container-x h-12 flex items-center justify-between">
					<View className="flex items-center gap-6">
						{/* 筛选项：活动分类 */}
						<Picker
							mode="selector"
							range={categoryOptions}
							rangeKey="label"
							value={categoryIndex}
							onChange={(e) => setCategoryIndex(Number(e.detail.value))}
						>
							<View className="flex items-center gap-1 active:opacity-70 transition-opacity">
								<Text className={`text-xs ${categoryIndex !== 0 ? 'text-primary' : 'text-text-title'}`}>
									{categoryOptions[categoryIndex].label}
								</Text>
								<View
									className={`icon-[ph--caret-down-fill] size-3 ${categoryIndex !== 0 ? 'text-primary' : 'text-gray-400'}`}
								/>
							</View>
						</Picker>

						{/* 筛选项：活动状态 */}
						<Picker
							mode="selector"
							range={STATUS_OPTIONS}
							rangeKey="label"
							value={statusIndex}
							onChange={(e) => setStatusIndex(Number(e.detail.value))}
						>
							<View className="flex items-center gap-1 active:opacity-70 transition-opacity">
								<Text className={`text-xs ${statusIndex !== 0 ? 'text-primary' : 'text-text-title'}`}>
									{STATUS_OPTIONS[statusIndex].label}
								</Text>
								<View
									className={`icon-[ph--caret-down-fill] size-3 ${statusIndex !== 0 ? 'text-primary' : 'text-gray-400'}`}
								/>
							</View>
						</Picker>
					</View>

					{/* 最右侧：搜索唤出按钮 */}
					<View
						className="flex items-center gap-2 border-l border-gray-100 pl-4 active:opacity-70 transition-opacity"
						onClick={() => setIsSearchOpen(!isSearchOpen)}
					>
						<View
							className={`size-4 ${isSearchOpen ? 'icon-[ph--x-bold] text-text-muted' : 'icon-[ph--magnifying-glass-bold] text-text-title'}`}
						/>
						<Text className="text-xs text-text-title">{isSearchOpen ? '收起' : '搜索'}</Text>
					</View>
				</View>

				{/* 隐藏的展开式搜索栏 */}
				{isSearchOpen && (
					<View className="container-x py-2 bg-white backdrop-blur-md border-t border-gray-100 animate-fade-in-down">
						<SearchBar
							value={keyword}
							placeholder="搜索感兴趣的活动"
							onInput={setKeyword}
							onConfirm={handleSearch}
							onSearch={handleSearch}
							showBtn
						/>
					</View>
				)}
			</View>

			{/* 活动列表 */}
			<ScrollView
				scrollY
				className="h-[calc(100vh-120px)]"
				onScrollToLower={() => hasNextPage && fetchNextPage()}
			>
				<View className="container-x py-2 flex flex-col gap-4">
					{isListLoading ? (
						<Loading />
					) : list.length === 0 ? (
						<Empty title="暂无志愿活动" />
					) : (
						<>
							{list.map((item) => (
								<Cell>
									<ActivityCard key={item.activityId} activity={item} />
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
