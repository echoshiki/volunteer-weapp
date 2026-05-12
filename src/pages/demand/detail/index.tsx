import { useRouter } from '@tarojs/taro';
import { View, Text, ScrollView, Image, Button } from '@tarojs/components';
import { useDemandDetail, useServiceUsers } from '@/hooks/useDemand';
import { Badge } from '@/components/ui/Badge';
import { useMemo } from 'react';

export default function DemandDetailPage() {
	const { params } = useRouter();
	const oderId = params.id as string;

	const { data: detail, isLoading } = useDemandDetail(oderId);
	const { data: usersData } = useServiceUsers(oderId);

	const serviceUsers = useMemo(() => {
		return usersData?.pages.flatMap((page) => page.list) || [];
	}, [usersData]);

	if (isLoading)
		return <View className="p-10 text-center text-text-muted text-sm">详情加载中...</View>;
	if (!detail)
		return <View className="p-10 text-center text-text-muted text-sm">订单不存在</View>;

	return (
		<View className="min-h-screen bg-main-bg pb-24">
			<ScrollView scrollY className="h-full">
				{/* 头部核心信息 */}
				<View className="bg-white p-5 border-b border-gray-100">
					<View className="flex items-center gap-2 mb-3">
						<Badge variant={detail.acceptStatus === 'dispatching' ? 'primary' : 'gray'}>
							{detail.acceptStatus === 'dispatching' ? '招募中' : '服务中'}
						</Badge>
						<Text className="text-xs text-text-muted">ID: {detail.oderId}</Text>
					</View>
					<Text className="text-xl font-bold text-text-title leading-tight">
						{detail.oderName}
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
				</View>

				{/* 服务需求描述 */}
				<View className="mt-3 bg-white p-5">
					<View className="flex items-center gap-2 mb-4">
						<View className="w-1 h-4 bg-primary rounded-full" />
						<Text className="font-bold text-text-title">需求描述</Text>
					</View>
					<Text className="text-sm text-text-body leading-relaxed">
						{detail.description}
					</Text>
				</View>

				{/* 服务明细卡片 */}
				<View className="mt-3 bg-white p-5">
					<View className="flex items-center gap-2 mb-4">
						<View className="w-1 h-4 bg-primary rounded-full" />
						<Text className="font-bold text-text-title">服务信息</Text>
					</View>

					<View className="space-y-4">
						<View className="flex justify-between items-center text-sm">
							<Text className="text-text-muted">服务对象</Text>
							<Text className="text-text-title">{detail.categoryUserName}</Text>
						</View>
						<View className="flex justify-between items-center text-sm">
							<Text className="text-text-muted">服务范围</Text>
							<Text className="text-text-title">
								{detail.serviceScope === 'group' ? '集体服务' : '个人服务'}
							</Text>
						</View>
						<View className="flex justify-between items-center text-sm">
							<Text className="text-text-muted">收费性质</Text>
							<Text className={detail.charge ? 'text-green-600' : 'text-orange-500'}>
								{detail.charge ? '公益免费' : '付费服务'}
							</Text>
						</View>
					</View>
				</View>

				{/* 费用明细 (仅在非免费时显示) */}
				{!detail.charge && (
					<View className="mt-3 bg-white p-5">
						<View className="flex items-center gap-2 mb-4">
							<View className="w-1 h-4 bg-primary rounded-full" />
							<Text className="font-bold text-text-title">费用估算</Text>
						</View>
						<View className="bg-main-bg rounded-card p-4 space-y-3">
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
						</View>
					</View>
				)}

				{/* 待接单名单（仅在招募中） */}
				{detail.acceptStatus === 'dispatching' && serviceUsers.length > 0 && (
					<View className="mt-3 bg-white p-5">
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
					</View>
				)}
			</ScrollView>

			{/* 底部操作栏 */}
			<View className="fixed bottom-0 inset-x-0 bg-white p-4 border-t border-gray-100 flex gap-3">
				<Button className="flex-1 h-12 bg-gray-100 text-text-title text-sm rounded-full flex items-center justify-center border-none">
					<View className="icon-[ph--phone-call] w-5 h-5 mr-2" />
					咨询发布者
				</Button>
				{detail.acceptStatus === 'dispatching' && (
					<Button className="flex-[1.5] h-12 bg-primary text-white text-sm rounded-full flex items-center justify-center border-none font-bold">
						<View className="icon-[ph--hand-coins] w-5 h-5 mr-2" />
						立即接单/报价
					</Button>
				)}
			</View>
		</View>
	);
}
