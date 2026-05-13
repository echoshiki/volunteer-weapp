import { useRouter, navigateTo, makePhoneCall } from '@tarojs/taro';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import { useJobDetail } from '@/hooks/useJob';

export default function JobDetail() {
	const { params } = useRouter();
	const id = params.id as string;

	const { data: detail, isLoading } = useJobDetail(id);

	if (isLoading)
		return <View className="p-10 text-center text-text-muted text-sm">岗位加载中...</View>;
	if (!detail)
		return <View className="p-10 text-center text-text-muted text-sm">岗位信息不存在</View>;

	return (
		<View className="min-h-screen bg-main-bg pb-24">
			<ScrollView scrollY className="h-full">
				{/* 1. 岗位核心信息 */}
				<View className="bg-white p-5 border-b border-gray-100">
					<View className="flex justify-between items-start mb-4">
						<Text className="text-2xl font-bold text-text-title leading-tight flex-1 pr-4">
							{detail.title}
						</Text>
						<Text className="text-xl font-bold text-primary">
							{detail.salaryBudget}k
						</Text>
					</View>

					<View className="flex items-center gap-3">
						<View className="flex items-center gap-1 text-xs text-text-muted bg-gray-50 px-2 py-1 rounded">
							{/* ✨ 使用规范的 Iconify 写法 */}
							<View className="icon-[ph--briefcase] w-3 h-3" />
							<Text>{detail.jobTitle}</Text>
						</View>
						<View className="flex items-center gap-1 text-xs text-text-muted bg-gray-50 px-2 py-1 rounded">
							<View className="icon-[ph--users] w-3 h-3" />
							<Text>招 {detail.hireCount} 人</Text>
						</View>
					</View>
				</View>

				{/* 2. 企业入口卡片 ✨ [功能：进入企业主页] */}
				<View
					className="mt-3 bg-white p-4 flex items-center justify-between active:bg-gray-50 transition-colors"
					onClick={() =>
						navigateTo({
							url: `/pages/job/enterprise/index?id=${detail.enterprisesId}`,
						})
					}
				>
					<View className="flex items-center gap-3">
						<View className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
							<View className="icon-[ph--buildings] w-6 h-6 text-text-muted" />
						</View>
						<View>
							<Text className="text-base font-bold text-text-title block mb-0.5">
								{detail.enterprisesName}
							</Text>
							<Text className="text-xs text-text-muted">点击查看企业主页</Text>
						</View>
					</View>
					<View className="icon-[ph--caret-right] w-5 h-5 text-text-muted" />
				</View>

				{/* 3. 岗位描述内容 */}
				<View className="mt-3 bg-white p-5">
					<View className="flex items-center gap-2 mb-4">
						{/* 🎨 使用主题定义的 primary 圆角装饰 */}
						<View className="w-1 h-4 bg-primary rounded-full" />
						<Text className="font-bold text-text-title">岗位描述</Text>
					</View>
					{/* 🎨 使用 text-text-body 和标准行高 */}
					<View className="text-sm text-text-body leading-relaxed space-y-2">
						<Text className="block whitespace-pre-wrap">{detail.description}</Text>
					</View>
				</View>

				{/* 4. 温馨提示 */}
				<View className="p-5">
					<View className="bg-orange-50 rounded-card p-4 flex items-start gap-2">
						<View className="icon-[ph--warning-circle] w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
						<Text className="text-xs text-orange-600 leading-normal">
							温馨提示：家门口求职平台承诺不向求职者收取任何费用，请提高警惕，注意保护个人财产安全。
						</Text>
					</View>
				</View>
			</ScrollView>

			{/* 5. 底部固定操作栏 */}
			<View className="fixed bottom-0 inset-x-0 bg-white p-4 border-t border-gray-100 flex gap-3 z-20">
				<Button
					className="flex-1 h-12 bg-gray-100 text-text-title text-sm rounded-full flex items-center justify-center border-none"
					onClick={() => makePhoneCall({ phoneNumber: '10086' })} // 示例逻辑
				>
					<View className="icon-[ph--chat-centered-dots] w-5 h-5 mr-2" />
					立即咨询
				</Button>
				<Button className="flex-[1.5] h-12 bg-primary text-white text-sm rounded-full flex items-center justify-center border-none font-bold shadow-md shadow-red-200">
					<View className="icon-[ph--paper-plane-tilt] w-5 h-5 mr-2" />
					投递简历
				</Button>
			</View>
		</View>
	);
}
