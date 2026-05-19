import { useState } from 'react';
import { View, Text, Input, ScrollView, Image } from '@tarojs/components';
import { Page, Empty, SearchBar, Cell } from '@/components/ui';
import { EnrollStatusBadge } from '@/components/biz/BizBadge';
import { useActivities } from '@/hooks/useActivity';
import { mapsTo } from '@/utils/common';

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
				<View className="container-x py-2 space-y-4">
					{list.map((item) => (
						<View
							key={item.activityId}
							className="bg-white rounded-card overflow-hidden"
							onClick={() =>
								mapsTo(`/pages/activity/detail/index?id=${item.activityId}`)
							}
						>
							<Image src={item.banner} className="w-full h-40 object-cover" />
							<Cell>
								{/* 活动标题和状态 */}
								<View className="flex justify-between items-center">
									<Text className="text-lg font-bold text-text-title flex-1 truncate">
										{item.activityName}
									</Text>
									<EnrollStatusBadge value={item.enrollStatus} />
								</View>

								{/* 活动类型和地址 */}
								<View className="mt-2 flex items-center text-xs text-gray-500 space-x-2">
									<Text>{item.categoryName}</Text>
									<Text>|</Text>
									<Text>{item.address}</Text>
								</View>

								{/* 报名人数和时间 */}
								<View className="mt-3 pb-2 flex justify-between items-center">
									<View className="flex items-center gap-1.5 text-text-muted">
										<View className="icon-[ph--users-three] size-4" />
										<Text className="text-xs">
											已报{' '}
											<Text className="text-primary font-bold">
												{item.attendance} / {item.maxPeople}
											</Text>{' '}
											人
										</Text>
									</View>
									<Text className="text-xs text-text-muted">
										{item.startTime} 开始
									</Text>
								</View>
							</Cell>
						</View>
					))}

					{list.length === 0 && !isListLoading && <Empty title="暂无志愿活动" />}

					{isFetchingNextPage && (
						<View className="text-center py-4 text-text-muted text-xs">加载中...</View>
					)}
				</View>
			</ScrollView>
		</Page>
	);
}
