import { View, Text } from '@tarojs/components';
import Taro, { useRouter, useLoad } from '@tarojs/taro';
import { TenantPicker } from '@/components/biz';
import { setTenant } from '@/utils/tenant';
import { mapsTo } from '@/utils/common';

/**
 * Tenant 选择引导页
 * 用于用户进入小程序时引导用户选择所属的 Tenant
 */
export default function OnboardingPage() {
	const router = useRouter();

	// 执行：选择自定义级区域后的逻辑
	const handleSelectTenant = (tenantId: string | number, tenantName: string) => {
		// 更新进小程序本地缓存
		setTenant(tenantId.toString(), tenantName);
		Taro.showToast({ title: '入驻成功', icon: 'success' });

		// 目标页路径
		const redirectUrl = router.params.redirect
			? decodeURIComponent(router.params.redirect)
			: '/pages/home/index';

		// 清空路径栈跳转目标页
		setTimeout(() => mapsTo(redirectUrl, 'reLaunch'), 1000);
	};

	// 隐藏返回首页按钮
	useLoad(() => Taro.hideHomeButton());

	return (
		<View className="min-h-screen bg-linear-to-b from-blue-50 to-white flex flex-col justify-between items-center px-8 py-20">
			{/* 上半部分：品牌视觉展示 */}
			<View className="w-full flex flex-col items-center mt-20 animate-fade-in">
				{/* 替换为你们的 Logo 或精美插画 */}
				<View className="size-32 bg-white rounded-3xl shadow-xl shadow-primary/10 flex items-center justify-center mb-8">
					<View className="icon-[ph--house-line-duotone] size-16 text-primary" />
				</View>
				<Text className="text-3xl font-extrabold text-text-title mb-4 tracking-wider">
					家门口服务
				</Text>
				<Text className="text-base text-text-muted text-center leading-loose px-4">
					为了提供精准的志愿与就业信息{'\n'}请选择您所在的社区或街道
				</Text>
			</View>

			{/* 下半部分：操作按钮包裹着 TenantPicker */}
			<View className="w-full mb-12 flex flex-col items-center animate-fade-in-up">
				<TenantPicker onChange={handleSelectTenant}>
					<View className="w-full bg-primary text-white h-14 rounded-full flex items-center justify-center active:scale-95 transition-transform shadow-lg shadow-primary/30 px-12">
						<Text className="text-lg font-bold">选择我的社区 / 街道</Text>
						<View className="icon-[ph--caret-double-right-bold] size-5 ml-2" />
					</View>
				</TenantPicker>

				{/* 底部版权或 Slogan 装饰 */}
				<View className="mt-8 flex justify-center items-center gap-3 text-gray-300">
					<View className="h-px w-12 bg-gray-200" />
					<Text className="text-xs uppercase tracking-widest font-medium">
						SaaS 数字化社区
					</Text>
					<View className="h-px w-12 bg-gray-200" />
				</View>
			</View>
		</View>
	);
}
