import { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useDemandCategoryList, useDemandTags, useDemandList } from '@/hooks/useDemand';
import { mapsTo } from '@/utils/common';
import { DemandCard } from '@/components/biz';
import {
	Badge,
	Button,
	Cell,
	Divider,
	Drawer,
	Empty,
	Heading,
	Loading,
	Page,
	SearchBar,
} from '@/components/ui';

export default function DemandPage() {
	// 状态：抽屉组件和搜索框组件是否显示
	const [isOpen, setIsOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	// 状态：搜索框内容、即时输入的内容
	const [keyword, setKeyword] = useState('');
	const [inputValue, setInputValue] = useState('');

	// 状态：筛选项
	const [appliedCategoryId, setAppliedCategoryId] = useState<number | undefined>();
	const [appliedTagIds, setAppliedTagIds] = useState<number[]>([]);
	const [appliedCharge, setAppliedCharge] = useState<boolean | undefined>();

	// 状态：草稿筛选项
	const [draftCategoryId, setDraftCategoryId] = useState<number | undefined>();
	const [draftTagIds, setDraftTagIds] = useState<number[]>([]);
	const [draftCharge, setDraftCharge] = useState<boolean | undefined>();

	// 数据：需求分类列表
	const { data: categoryList, isLoading: categoryListLoading } = useDemandCategoryList();

	// 数据：需求标签列表
	const { data: tagList, isLoading: tagListLoading } = useDemandTags();

	// 数据：需求单列表
	const {
		data: demandListData,
		isLoading: demandListLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useDemandList({
		keyword,
		categoryId: appliedCategoryId,
		tagIds: appliedTagIds.length > 0 ? appliedTagIds : undefined,
		charge: appliedCharge !== undefined ? String(appliedCharge) : undefined,
	});

	// 执行：展平分页数据
	const demandList = useMemo(() => {
		return demandListData?.pages.flatMap((page) => page.list) || [];
	}, [demandListData]);

	// 执行：搜索
	const handleSearch = () => setKeyword(inputValue);

	// 执行：打开筛选抽屉
	const handleOpenFilter = () => {
		setDraftCategoryId(appliedCategoryId);
		setDraftTagIds([...appliedTagIds]);
		setDraftCharge(appliedCharge);
		setIsOpen(true);
	};

	// 执行：重置筛选
	const handleResetFilter = () => {
		setDraftCategoryId(undefined);
		setDraftTagIds([]);
		setDraftCharge(undefined);
	};

	// 执行：确定筛选
	const handleConfirmFilter = () => {
		setAppliedCategoryId(draftCategoryId);
		setAppliedTagIds([...draftTagIds]);
		setAppliedCharge(draftCharge);
		setIsOpen(false);
	};

	// 执行：标签选择
	const toggleDraftTagId = (id: number) => {
		setDraftTagIds((prev) =>
			prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
		);
	};

	// 计算：是否存在筛选
	const hasActiveFilter =
		appliedCategoryId !== undefined || appliedTagIds.length > 0 || appliedCharge !== undefined;

	return (
		<Page hasTabBar>
			{/* 顶部 Sticky 筛选区 */}
			<View className="sticky top-0 z-20 shrink-0 bg-white border-b border-gray-100 shadow-sm">
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
						className="flex items-center gap-1 active:opacity-70 transition-opacity pl-4 py-2"
						onClick={() => setIsSearchOpen(!isSearchOpen)}
					>
						<View
							className={`size-4 ${isSearchOpen ? 'icon-[ph--x-bold] text-text-muted' : 'icon-[ph--magnifying-glass-bold] text-text-title'}`}
						/>
						<Text className="text-xs text-text-title">
							{isSearchOpen ? '收起' : '搜索需求'}
						</Text>
					</View>
				</View>

				{/* 伸缩式搜索栏 */}
				{isSearchOpen && (
					<View className="container-x py-2 bg-gray-50/80 backdrop-blur-md border-t border-gray-100 animate-fade-in-down">
						<SearchBar
							value={inputValue}
							placeholder="输入关键词"
							onInput={setInputValue}
							onConfirm={handleSearch}
							onSearch={handleSearch}
							showBtn
						/>
					</View>
				)}
			</View>

			{/* 列表渲染区 */}
			<ScrollView
				scrollY
				className="h-[calc(100vh-120px)]"
				onScrollToLower={() => hasNextPage && fetchNextPage()}
			>
				<View className="container-x py-2 space-y-4">
					{demandListLoading ? (
						<Loading />
					) : demandList.length === 0 ? (
						<Empty title="暂无匹配的需求" />
					) : (
						<>
							{demandList.map((item) => (
								<Cell>
									<DemandCard key={item.demandId} demand={item} />
								</Cell>
							))}
							{isFetchingNextPage && <Loading />}
							{!hasNextPage && <Divider>没有更多需求了</Divider>}
						</>
					)}
				</View>
			</ScrollView>

			{/* 发布需求按钮 */}
			<View
				className="fixed right-6 bottom-10 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-red-200 active:scale-95 transition-transform z-20"
				onClick={() => mapsTo('/pages/demand/publish/index')}
			>
				<View className="flex flex-col items-center justify-center">
					<View className="icon-[ph--plus-bold] w-6 h-6" />
					<Text className="text-xs font-bold scale-90 mt-0.5">发布</Text>
				</View>
			</View>

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
						<Heading title="服务分类" size="sm" />
						<View className="flex flex-wrap gap-2.5">
							<Badge
								variant={draftCategoryId === undefined ? 'primary' : 'secondary'}
								onClick={() => setDraftCategoryId(undefined)}
								size="sm"
							>
								全部
							</Badge>
							{categoryList?.map((cat) => (
								<Badge
									key={cat.categoryId}
									variant={
										draftCategoryId === cat.categoryId ? 'primary' : 'secondary'
									}
									onClick={() => setDraftCategoryId(cat.categoryId)}
									size="sm"
								>
									{cat.categoryName}
								</Badge>
							))}
						</View>
					</View>

					<View className="flex flex-col gap-2">
						<Heading title="需求标签" size="sm" />
						<View className="flex flex-wrap gap-2.5">
							<Badge
								variant={draftTagIds.length === 0 ? 'primary' : 'secondary'}
								onClick={() => setDraftTagIds([])}
								size="sm"
							>
								全部
							</Badge>
							{tagList?.map((tag) => (
								<Badge
									key={tag.tagId}
									variant={
										draftTagIds.includes(tag.tagId) ? 'primary' : 'secondary'
									}
									onClick={() => toggleDraftTagId(tag.tagId)}
									size="sm"
								>
									{tag.tagName}
								</Badge>
							))}
						</View>
					</View>

					<View className="flex flex-col gap-2">
						<Heading title="服务性质" size="sm" />
						<View className="flex flex-wrap gap-2.5">
							<Badge
								variant={draftCharge === undefined ? 'primary' : 'secondary'}
								onClick={() => setDraftCharge(undefined)}
								size="sm"
							>
								不限
							</Badge>
							<Badge
								variant={draftCharge === false ? 'primary' : 'secondary'}
								onClick={() => setDraftCharge(false)}
								size="sm"
							>
								公益免费
							</Badge>
							<Badge
								variant={draftCharge === true ? 'primary' : 'secondary'}
								onClick={() => setDraftCharge(true)}
								size="sm"
							>
								付费服务
							</Badge>
						</View>
					</View>
				</View>
			</Drawer>
		</Page>
	);
}
