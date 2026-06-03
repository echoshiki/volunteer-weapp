import { View, ScrollView } from '@tarojs/components';
import { useUserDemandList } from '@/hooks/useDemand';
import { Page, Empty, Loading, Divider, Cell } from '@/components/ui';
import { DemandRecordCard } from '@/components/biz';
import { mapsTo } from '@/utils/common';
import { DemandItem } from '@/types/demand';

export default function UserDemandPage() {
	// 数据：用户活动报名记录列表
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useUserDemandList();

	// 执行：扁平化分页数据
	const list = data?.pages.flatMap((page) => page.list) || [];

	// 执行：跳转到需求编辑页
	const handleEdit = (demand: DemandItem) => {
		mapsTo(`/pages/user/demand/edit/index?id=${demand.demandId}`);
	};

	// 执行：跳转到选择服务方（抢单列表）页
	const handleViewApplicants = (demand: DemandItem) => {
		mapsTo(`/pages/user/demand/applicants/index?id=${demand.demandId}`);
	};

	// 执行：删除需求单
	const handleDelete = (demand: DemandItem) => {
		// TODO: 接入删除 API 和二次确认弹窗
		console.log('触发删除', demand.demandId);
	};

	return (
		<Page>
			<ScrollView
				scrollY
				className="h-[calc(100vh-10px)]"
				onScrollToLower={() => hasNextPage && fetchNextPage()}
			>
				<View className="container-x py-2 flex flex-col gap-4">
					{isLoading ? (
						<Loading />
					) : list.length === 0 ? (
						<Empty title="暂无已发布的需求" />
					) : (
						<>
							{list.map((item) => (
								<Cell>
									<DemandRecordCard
										key={item.demandId}
										record={item}
										onEdit={handleEdit}
									/>
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
