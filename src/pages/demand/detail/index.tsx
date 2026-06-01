import { useMemo } from 'react';
import { useRouter } from '@tarojs/taro';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import { useDemandDetail, useServiceUsers } from '@/hooks/useDemand';
import { Button } from '@/components/ui/Button';
import { Cell, Description, Empty, Heading, Loading, Page } from '@/components/ui';

export default function DemandDetailPage() {
	const { params } = useRouter();
	const orderId = params.id as string;

	const { data: detail, isLoading } = useDemandDetail(orderId);
	const { data: usersData } = useServiceUsers(orderId);

	const serviceUsers = useMemo(() => {
		return usersData?.pages.flatMap((page) => page.list) || [];
	}, [usersData]);

	if (isLoading) return <Loading />;
	if (!detail) return <Empty title="未找到该需求" />;

	return (
		<Page hasTabBar>
			<ScrollView scrollY className="h-full">
				{/* 头部核心信息 */}
				<Cell className="border-b border-gray-100 py-6" rounded={false}>
					<View className="flex items-center gap-2 mb-3">
						{/* <DemandStatusBadge value={detail.acceptStatus} /> */}
						<Text className="text-xs text-text-muted">ID: {detail.orderId}</Text>
					</View>
					<Text className="text-xl font-bold text-text-title leading-tight">
						{detail.orderName}
					</Text>
					<View className="flex items-center gap-4 mt-4 text-xs text-text-muted">
						<View className="flex items-center gap-1">
							<View className="icon-[ph--user-circle] w-4 h-4 text-primary" />
							<Text>{detail.name}</Text>
						</View>
						{detail.tags.map((tag) => (
							<View key={tag} className="flex items-center gap-1">
								<View className="icon-[ph--tag] w-4 h-4 text-primary" />
								<Text>{tag}</Text>
							</View>
						))}
					</View>
				</Cell>

				{/* 服务需求描述 */}

				<Cell className="mt-3" rounded={false}>
					<Heading title="需求描述" size="md" />
					<Text className="text-sm text-text-body leading-relaxed">{detail.content}</Text>
				</Cell>

				{/* 服务明细卡片 */}
				<Cell className="mt-3" rounded={false}>
					<Heading title="服务信息" size="md" />
					<View className="flex flex-col gap-3 bg-main-bg p-4 rounded-card">
						<Description label="服务对象" value={detail.categoryName} />
						<Description
							label="收费性质"
							valueTextClass={detail.charge ? 'text-green-500' : 'text-red-500'}
							value={detail.charge ? '公益免费' : '付费服务'}
						/>
					</View>
				</Cell>

				{/* 费用明细 (仅在非免费时显示) */}
				{detail.charge && (
					<Cell className="mt-3" rounded={false}>
						<Heading title="费用预估" size="md" />
						<View className="flex flex-col gap-3 bg-main-bg p-4 rounded-card">
							<Description
								label="预算范围"
								value={`￥${detail.minMoney} - ￥${detail.maxMoney}`}
								variant="between"
							/>
						</View>
					</Cell>
				)}

				{/* 待接单名单（仅在招募中） */}
				{/* {detail.acceptStatus === 'dispatching' && serviceUsers.length > 0 && ( */}
				<Cell className="mt-3">
					<Heading title={`已申请的服务方 (${serviceUsers.length})`} size="md" />
					<View className="flex flex-col gap-4">
						{serviceUsers.map((user) => (
							<View key={user.userId} className="flex items-center justify-between">
								<View className="flex items-center gap-3">
									<Image
										src={user.avatar}
										className="w-10 h-10 rounded-full bg-gray-100"
									/>
									<View>
										<Text className="text-sm font-bold text-text-title block">
											{user.userName}
										</Text>
										<Text className="text-xs text-text-muted">
											报价单价: ￥{user.money}
										</Text>
									</View>
								</View>
								<View className="px-3 py-1 border border-primary text-primary text-xs rounded-full">
									查看详情
								</View>
							</View>
						))}
					</View>
				</Cell>
				{/* )} */}
			</ScrollView>

			{/* 底部操作栏 */}
			<Cell className="fixed bottom-0 inset-x-0 border-t border-gray-100 flex gap-3">
				<Button icon="icon-[ph--phone-call]" size="md" variant="secondary" block>
					咨询发布者
				</Button>
				<Button className="flex-[1.5] h-12 bg-primary text-white text-sm rounded-full flex items-center justify-center border-none font-bold">
					<View className="icon-[ph--hand-coins] w-5 h-5 mr-2" />
					立即接单/报价
				</Button>
			</Cell>
		</Page>
	);
}
