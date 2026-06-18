import { View, ScrollView, Text, Image } from '@tarojs/components';
import { useAuditArticleList } from '@/hooks/useArticle';
import { Loading, Empty, Divider, Cell } from '@/components/ui';
import Taro from '@tarojs/taro';
import { ArticleCard } from '@/components/ui/ArticleCard';

export const AuditInfoView = () => {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useAuditArticleList();
	const list = data?.pages.flatMap((page) => page.list) || [];

	// 点击直接通过原生 Modal 弹窗展示文章详情
	const handleViewDetail = (title: string, content: string) => {
		Taro.showModal({
			title: title,
			content: content.replace(/<[^>]*>/g, ''),
			confirmText: '我知道了',
			showCancel: false,
		});
	};

	return (
		<ScrollView
			scrollY
			className="h-screen bg-main-bg"
			onScrollToLower={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
			enhanced
			showScrollbar={false}
		>
			<View className="container-x py-4 space-y-3">
				{isLoading ? (
					<Loading />
				) : list.length === 0 ? (
					<Empty title="暂无便民政策发布" />
				) : (
					<>
						{list.map((item) => (
							<Cell key={item.articleId}>
								<ArticleCard
									title={item.title}
									cover={item.imgPath}
									summary={item.summary}
									createAt={item.createTime}
									onClick={() => handleViewDetail(item.title, item.content)}
								/>
							</Cell>
						))}

						{/* 分页加载反馈 */}
						{isFetchingNextPage && <Loading />}
						{!hasNextPage && <Divider>已加载全部便民信息</Divider>}
					</>
				)}
			</View>
		</ScrollView>
	);
};
