import { useMemo } from 'react';
import { useRouter } from '@tarojs/taro';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import { useDemandDetail, useServiceUsers } from '@/hooks/useDemand';
import { DemandStatusBadge } from '@/components/biz/BizBadge';
import { Button } from '@/components/ui/Button';
import { Cell, Empty, Heading, Loading, Page } from '@/components/ui';

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
				<Cell className="border-b border-gray-100">
					<View className="flex items-center gap-2 mb-3">
						<DemandStatusBadge value={detail.acceptStatus} />
						<Text className="text-xs text-text-muted">ID: {detail.orderId}</Text>
					</View>
					<Text className="text-xl font-bold text-text-title leading-tight">
						{detail.orderName}
					</Text>
					<View className="flex items-center gap-4 mt-4 text-xs text-text-muted">
						<View className="flex items-center gap-1">
							<View className="icon-[ph--user-circle] w-4 h-4 text-primary" />
							<Text>{detail.nickName}</Text>
						</View>
						<View className="flex items-center gap-1">
							<View className="icon-[ph--tag] w-4 h-4 text-primary" />
							<Text>{detail.demandName}</Text>
						</View>
					</View>
				</Cell>

				{/* 服务需求描述 */}
				<Cell className="mt-3">
					<Heading title="需求描述" size="md" />
					<Text className="text-sm text-text-body leading-relaxed">
						{detail.description}
					</Text>
				</Cell>

				{/* 服务明细卡片 */}
				<Cell className="mt-3">
					<Heading title="服务信息" size="md" />

					<Cell className="bg-main-bg flex flex-col gap-2">
						<View className="flex justify-between items-center text-xs">
							<Text className="text-text-muted">服务对象</Text>
							<Text className="text-text-title">{detail.categoryUserName}</Text>
						</View>
						<View className="flex justify-between items-center text-xs">
							<Text className="text-text-muted">服务范围</Text>
							<Text className="text-text-title">
								{detail.serviceScope === 'group' ? '集体服务' : '个人服务'}
							</Text>
						</View>
						<View className="flex justify-between items-center text-xs">
							<Text className="text-text-muted">收费性质</Text>
							<Text className={detail.charge ? 'text-green-600' : 'text-orange-500'}>
								{detail.charge ? '公益免费' : '付费服务'}
							</Text>
						</View>
					</Cell>
				</Cell>

				{/* 费用明细 (仅在非免费时显示) */}
				{!detail.charge && (
					<Cell className="mt-3 ">
						<Heading title="费用预估" size="md" />
						<Cell className="bg-main-bg flex flex-col gap-2">
							<View className="flex justify-between text-xs">
								<Text className="text-text-muted">
									服务单价 ({detail.categoryPaidName})
								</Text>
								<Text className="text-text-title font-bold">￥{detail.money}</Text>
							</View>
							<View className="flex justify-between text-xs">
								<Text className="text-text-muted">服务规模 (人数/数量)</Text>
								<Text className="text-text-title">
									{detail.serviceManpower}人 / {detail.serviceQuantity}次
								</Text>
							</View>
							<View className="h-px bg-gray-200 my-1" />
							<View className="flex justify-between items-center">
								<Text className="text-sm font-bold text-text-title">预估总额</Text>
								<Text className="text-lg font-bold text-primary">
									￥{detail.orderTotal}
								</Text>
							</View>
						</Cell>
					</Cell>
				)}

				{/* 待接单名单（仅在招募中） */}
				{detail.acceptStatus === 'dispatching' && serviceUsers.length > 0 && (
					<Cell className="mt-3">
						<View className="flex items-center gap-2 mb-4">
							<View className="w-1 h-4 bg-primary rounded-full" />
							<Text className="font-bold text-text-title">
								已申请的服务方 ({serviceUsers.length})
							</Text>
						</View>
						<View className="space-y-4">
							{serviceUsers.map((user) => (
								<View
									key={user.userId}
									className="flex items-center justify-between"
								>
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
				)}
			</ScrollView>

			{/* 底部操作栏 */}
			<Cell className="fixed bottom-0 inset-x-0 border-t border-gray-100 flex gap-3">
				<Button icon="icon-[ph--phone-call]" size="md" variant="secondary" block>
					咨询发布者
				</Button>
				{detail.acceptStatus === 'dispatching' && (
					<Button className="flex-[1.5] h-12 bg-primary text-white text-sm rounded-full flex items-center justify-center border-none font-bold">
						<View className="icon-[ph--hand-coins] w-5 h-5 mr-2" />
						立即接单/报价
					</Button>
				)}
			</Cell>
		</Page>
	);
}
