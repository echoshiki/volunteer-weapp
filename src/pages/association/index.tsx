import { View, ScrollView } from '@tarojs/components';
import { useAssociationList, useAssociationActions } from '@/hooks/useAssociation';
import { Page, Empty, Loading, Divider, Cell } from '@/components/ui';
import { AssociationCard } from '@/components/biz';

export default function AllAssociationListPage() {
	const { list, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useAssociationList({});
	const { switchAssociation } = useAssociationActions();

	return (
		<Page>
			<ScrollView
				scrollY
				className="flex-1"
				enhanced
				showScrollbar={false}
				onScrollToLower={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
			>
				<View className="container-x py-4 flex flex-col gap-3">
					{isLoading ? (
						<Loading />
					) : list.length === 0 ? (
						<Empty title="未找到志愿组织" icon="icon-[ph--shield-warning-duotone]" />
					) : (
						<>
							{/* 遍历组织流水 */}
							{list.map((association) => (
								<Cell key={association.associationId}>
									<AssociationCard record={association} onSwitch={switchAssociation} />
								</Cell>
							))}

							{isFetchingNextPage && <Loading />}
							{!hasNextPage && <Divider>没有更多志愿组织了</Divider>}
						</>
					)}
				</View>
			</ScrollView>
		</Page>
	);
}
