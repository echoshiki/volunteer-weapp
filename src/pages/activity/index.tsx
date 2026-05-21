import { useState } from 'react';
import { View, ScrollView } from '@tarojs/components';
import { Page, Empty, SearchBar, Loading, Divider } from '@/components/ui';
import { useActivities } from '@/hooks/useActivity';
import { ActivityCard } from '@/components/biz';

export default function ActivityList() {
	const [keyword, setKeyword] = useState('');
	const [searchValue, setSearchValue] = useState('');

	// TODO: 活动分类筛选
	const [categoryId, setCategoryId] = useState<number | undefined>();

	// 数据：志愿活动列表
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading: isListLoading,
	} = useActivities({
		keyword: searchValue,
		categoryId,
	});
	const list = data?.pages.flatMap((page) => page.list) || [];

	const handleSearch = () => setSearchValue(keyword);

	return (
		<Page hasTabBar>
			{/* 顶部搜索栏 */}
			<View className="container-x py-3 sticky top-0 z-10">
				<SearchBar
					value={keyword}
					placeholder="搜索感兴趣的活动"
					onInput={setKeyword}
					onConfirm={handleSearch}
					onSearch={handleSearch}
					showBtn
				/>
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
								<ActivityCard key={item.activityId} activity={item} />
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
