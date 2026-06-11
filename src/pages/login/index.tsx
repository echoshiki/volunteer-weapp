import { View, Text, Image } from '@tarojs/components';
import { useLogin } from '@/hooks/useLogin';
import { Page, Button, Alert } from '@/components/ui';
import { useConfigStore } from '@/store/config';
import { mapsTo } from '@/utils/common';
import Taro from '@tarojs/taro';

const LoginPage = () => {
	const { config } = useConfigStore();
	const { authStage, onManualLogin, onBindPhone } = useLogin();

	const handleNavigationBack = () => {
		const instance = Taro.getCurrentInstance();
		const queryBackUrl = instance.router?.params.back_url;

		if (queryBackUrl) {
			const target = decodeURIComponent(queryBackUrl);
			if (!target.includes('/pages/login/index')) {
				return mapsTo(target, 'redirectTo');
			}
		}

		const pages = Taro.getCurrentPages();
		if (pages.length > 1) {
			const prevPage = pages[pages.length - 2];
			if (prevPage && prevPage.route) {
				const prevRoute = `/${prevPage.route}`;
				if (!prevRoute.includes('/pages/login/index')) {
					return Taro.navigateBack({ delta: 1 });
				}
			}
		}

		mapsTo('/pages/home/index', 'reLaunch');
	};

	// 手动点击登陆
	const handleLoginClick = async () => {
		const res = await onManualLogin();
		if (res && res.stage === 'LOGGED_IN') handleNavigationBack();
	};

	// 绑定手机号
	const handleBindPhoneSuccess = async (e: any) => {
		const token = await onBindPhone(e);
		if (token) handleNavigationBack();
	};

	return (
		<Page className="flex flex-col justify-between items-center px-10 py-20">
			<View className="w-full flex flex-col items-center mt-20 animate-fade-in">
				{/* 小程序 Logo */}
				{config.appLogo ? (
					<Image src={config.appLogo} mode="aspectFit" className="size-32 mb-8" />
				) : (
					<View className="size-32 bg-white rounded-3xl shadow-xl shadow-primary/10 flex items-center justify-center mb-8">
						<View className="icon-[ph--house-line-duotone] size-16 text-primary" />
					</View>
				)}
				{/* 小程序名称 */}
				<Text className="text-2xl font-extrabold text-text-title mb-4 tracking-wider">{config.appName}</Text>
				{/* 小程序描述 */}
				<Text className="text-sm text-text-muted text-center leading-normal px-4">{config.appDescription}</Text>
			</View>

			<View className="w-full flex flex-col gap-4">
				{/* 第一阶段：静默预检未通过，先拿 UUID */}
				{authStage === 'UNLOGIN' && (
					<Button size="xl" variant="primary" onClick={handleLoginClick}>
						微信一键登录
					</Button>
				)}

				{/* 第二阶段：已拿 UUID，等手机号解密注册 */}
				{authStage === 'NEED_BIND_PHONE' && (
					<View className="flex flex-col gap-5">
						<Alert variant="info">为了保障服务安全与真实性，请授权绑定您的手机号完成最后一步注册。</Alert>
						<Button
							size="xl"
							variant="info"
							icon="icon-[ph--device-mobile]"
							openType="getPhoneNumber"
							onGetPhoneNumber={handleBindPhoneSuccess}
						>
							授权手机号并绑定
						</Button>
					</View>
				)}
			</View>

			<View className="pb-10">
				<Text className="text-xs text-gray-400">
					登录即代表同意{' '}
					<Text className="text-blue-500" onClick={() => mapsTo(config.agreementUrl || '/pages/home/index')}>
						《用户协议》
					</Text>{' '}
					与{' '}
					<Text className="text-blue-500" onClick={() => mapsTo(config.policyUrl || '/pages/home/index')}>
						《隐私政策》
					</Text>
				</Text>
			</View>
		</Page>
	);
};

export default LoginPage;
