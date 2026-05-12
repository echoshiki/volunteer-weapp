import { useState } from 'react';
import { View, Text, Input, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useActivities } from '@/hooks/useActivity';
import { BaseEmpty } from '@/components/BaseEmpty';
import { Badge } from '@/components/Badge';

export default function ActivityList() {
	const [keyword, setKeyword] = useState('');
	const [categoryId, setCategoryId] = useState<number | undefined>();
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading: isListLoading,
	} = useActivities({
		keyword,
		categoryId,
	});

	const list = data?.pages.flatMap((page) => page.list) || [];

	return (
		<View className="min-h-screen bg-gray-50 flex flex-col">
			{/* 顶部搜索与筛选栏 */}
			<View className="bg-white px-4 py-3 flex items-center space-x-3 sticky top-0 z-10">
				<View className="flex-1 bg-gray-100 rounded-full px-4 py-1.5 flex items-center">
					<Input
						className="flex-1 text-sm"
						placeholder="搜索感兴趣的活动"
						onInput={(e) => setKeyword(e.detail.value)}
					/>
				</View>
				<View
					className="text-primary text-sm font-medium"
					onClick={() => setIsFilterOpen(true)}
				>
					筛选
				</View>
			</View>

			{/* 活动列表 */}
			<ScrollView
				scrollY
				className="h-[calc(100vh-120px)]"
				onScrollToLower={() => hasNextPage && fetchNextPage()}
			>
				<View className="p-4 space-y-4">
					{list.map((item) => (
						<View
							key={item.activityId}
							className="bg-white rounded-card overflow-hidden shadow-sm active:opacity-90"
							onClick={() =>
								Taro.navigateTo({
									url: `/pages/activity/detail/index?id=${item.activityId}`,
								})
							}
						>
							<Image src={item.banner} className="w-full h-40 object-cover" />
							<View className="p-3">
								<View className="flex justify-between items-center">
									<Text className="text-lg font-bold text-text-title flex-1 truncate">
										{item.activityName}
									</Text>
									<Badge variant={item.status === 'started' ? 'success' : 'gray'}>
										{item.status === 'started' ? '报名中' : '已结束'}
									</Badge>
								</View>
								<View className="mt-2 flex items-center text-xs text-gray-500 space-x-2">
									<Text>{item.categoryName}</Text>
									<Text>|</Text>
									<Text>{item.address}</Text>
								</View>
								<View className="mt-3 flex justify-between items-center">
									<Text className="text-xs text-text-muted ">
										已报{' '}
										<Text className="text-primary font-bold">
											{item.attendance} / {item.maxPeople}
										</Text>{' '}
										人
									</Text>
									<Text className="text-xs text-text-muted">
										{item.startTime} 开始
									</Text>
								</View>
							</View>
						</View>
					))}

					{list.length === 0 && !isListLoading && <BaseEmpty title="暂无志愿活动" />}

					{isFetchingNextPage && (
						<View className="text-center py-4 text-text-muted text-xs">加载中...</View>
					)}
				</View>
			</ScrollView>

			{/* 简易筛选抽屉 (Tailwind 实现) */}
			{isFilterOpen && (
				<View className="fixed inset-0 z-50">
					<View
						className="absolute inset-0 bg-black/50"
						onClick={() => setIsFilterOpen(false)}
					/>
					<View className="absolute right-0 top-0 bottom-0 w-64 bg-white p-6 animate-slide-in-right">
						<Text className="text-lg font-bold block mb-4">全部分类</Text>
						<View className="grid grid-cols-2 gap-2">
							<View
								className={`py-2 text-center rounded-lg text-sm ${!categoryId ? 'bg-primary text-white' : 'bg-gray-100 text-text-body'}`}
								onClick={() => {
									setCategoryId(undefined);
									setIsFilterOpen(false);
								}}
							>
								全部
							</View>
							{/* 这里可以再补分类 Hook 的渲染 */}
						</View>
					</View>
				</View>
			)}
		</View>
	);
}
