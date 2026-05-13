// src/pages/job/enterprise/index.tsx
import { useRouter } from '@tarojs/taro';
import { View, Text, ScrollView, Image, Button } from '@tarojs/components';
import { useEnterpriseDetail } from '@/hooks/useJob';

export default function EnterpriseDetail() {
	const { params } = useRouter();
	const enterprisesId = params.id as string;

	const { data: detail, isLoading } = useEnterpriseDetail(enterprisesId);

	if (isLoading)
		return <View className="p-10 text-center text-text-muted text-sm">企业信息加载中...</View>;
	if (!detail)
		return <View className="p-10 text-center text-text-muted text-sm">企业不存在</View>;

	return (
		<View className="min-h-screen bg-main-bg pb-24">
			<ScrollView scrollY className="h-full">
				{/* 1. 企业名片 Header */}
				<View className="bg-white p-5 border-b border-gray-100">
					<View className="flex items-start gap-4 mb-4">
						<Image
							src={detail.logo}
							className="w-16 h-16 rounded-xl border border-gray-100 object-cover bg-gray-50"
						/>
						<View className="flex-1">
							<Text className="text-xl font-bold text-text-title leading-tight block mb-1">
								{detail.enterprisesName}
							</Text>
							<Text className="text-xs text-text-muted">
								成立时间：{detail.setupTime}
							</Text>
						</View>
					</View>

					{/* 地理位置与联系人 */}
					<View className="space-y-2 mt-4 bg-gray-50 p-3 rounded-card text-sm">
						<View className="flex items-start gap-2">
							<View className="icon-[ph--map-pin] w-4 h-4 text-text-muted mt-0.5 shrink-0" />
							<Text className="text-text-body">
								{detail.provinceName}
								{detail.cityName}
								{detail.districtName}
								{detail.address}
							</Text>
						</View>
						<View className="flex items-center gap-2">
							<View className="icon-[ph--user-circle] w-4 h-4 text-text-muted shrink-0" />
							<Text className="text-text-body">
								{detail.contactName} · {detail.contactPhone}
							</Text>
						</View>
					</View>
				</View>

				{/* 2. 企业简介 */}
				<View className="mt-3 bg-white p-5">
					<View className="flex items-center gap-2 mb-4">
						<View className="w-1 h-4 bg-primary rounded-full" />
						<Text className="font-bold text-text-title">企业简介</Text>
					</View>
					<Text className="text-sm text-text-body leading-relaxed">
						{detail.description}
					</Text>
				</View>

				{/* 3. 在招岗位列表 */}
				<View className="mt-3 bg-white p-5 min-h-100">
					<View className="flex items-center justify-between mb-4">
						<View className="flex items-center gap-2">
							<View className="w-1 h-4 bg-primary rounded-full" />
							<Text className="font-bold text-text-title">在招岗位</Text>
						</View>
						<Text className="text-xs text-text-muted">
							共 {detail.jobList.length} 个岗位
						</Text>
					</View>

					<View className="space-y-4">
						{detail.jobList.length === 0 ? (
							<View className="text-center py-10 text-text-muted text-xs">
								暂无在招岗位
							</View>
						) : (
							detail.jobList.map((job) => (
								<View
									key={job.id}
									className="border border-gray-100 rounded-card p-4 shadow-sm"
								>
									<View className="flex justify-between items-start mb-2">
										<Text className="text-text-title font-bold text-base line-clamp-1 flex-1 pr-2">
											{job.title}
										</Text>
										<Text className="text-primary font-bold text-base whitespace-nowrap">
											{job.salaryBudget}k
										</Text>
									</View>
									<View className="flex items-center gap-2 mb-3">
										<Text className="text-xs text-text-muted bg-gray-50 px-2 py-1 rounded">
											招 {job.hireCount} 人
										</Text>
										<Text className="text-xs text-text-muted bg-gray-50 px-2 py-1 rounded">
											{job.jobTitle}
										</Text>
									</View>
									<Text className="text-sm text-text-muted line-clamp-2">
										{job.description}
									</Text>
								</View>
							))
						)}
					</View>
				</View>
			</ScrollView>

			{/* 底部投递/联系按钮 */}
			<View className="fixed bottom-0 inset-x-0 bg-white p-4 border-t border-gray-100 flex gap-3 z-20">
				<Button className="flex-1 h-12 bg-gray-100 text-text-title text-sm rounded-full flex items-center justify-center border-none">
					<View className="icon-[ph--share-network] w-5 h-5 mr-2" />
					分享企业
				</Button>
				<Button className="flex-[1.5] h-12 bg-primary text-white text-sm rounded-full flex items-center justify-center border-none font-bold shadow-md shadow-red-200">
					<View className="icon-[ph--phone-call] w-5 h-5 mr-2" />
					拨打电话
				</Button>
			</View>
		</View>
	);
}
