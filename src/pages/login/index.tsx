import { View, Text, Image } from '@tarojs/components';
import { useLogin } from '@/hooks/useLogin';
import { Page, Button, Alert } from '@/components/ui';
import { useConfigStore } from '@/store/config';
import { mapsTo, stripHtml } from '@/utils/common';
import Taro from '@tarojs/taro';
import { useState } from 'react';

const LoginPage = () => {
	const { config } = useConfigStore();
	const { authStage, onManualLogin, onBindPhone } = useLogin();
	const [isAgreed, setIsAgreed] = useState(false);

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

	const checkPrivacyAgreement = (): boolean => {
		if (!isAgreed) {
			Taro.showModal({
				title: '提示',
				content: '请先阅读并勾选页面下方的《用户协议》与《隐私政策》',
				confirmText: '我知道了',
				showCancel: false,
			});
			return false;
		}
		return true;
	};

	// 手动点击登陆
	const handleLoginClick = async () => {
		if (!checkPrivacyAgreement()) return;
		const res = await onManualLogin();
		if (res && res.stage === 'LOGGED_IN') handleNavigationBack();
	};

	// 绑定手机号
	const handleBindPhoneSuccess = async (e: any) => {
		if (!checkPrivacyAgreement()) return;
		const token = await onBindPhone(e);
		if (token) handleNavigationBack();
	};

	const handleShowTextModal = (title: string, content: string) => {
		console.log('clicked');
		Taro.showModal({
			title: title,
			content: content,
			confirmText: '我已阅读',
			showCancel: false,
		});
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

			<View className="pb-10 flex items-start gap-2 max-w-[90%]">
				<View
					onClick={() => setIsAgreed(!isAgreed)}
					className={`size-4 rounded-full border flex items-center justify-center mt-0.5 transition-colors duration-200 shrink-0 ${
						isAgreed ? 'bg-primary border-primary' : 'border-gray-300'
					}`}
				>
					{isAgreed && <View className="icon-[ph--check-bold] size-2.5 text-white" />}
				</View>

				<View className="text-xs text-gray-400 leading-normal">
					<Text>我已阅读并同意</Text>
					<Text
						className="text-blue-500 font-semibold px-0.5"
						onClick={(e) => {
							e.stopPropagation();
							handleShowTextModal(
								'用户服务协议',
								stripHtml(config.agreementExpert || '暂无服务协议内容'),
							);
						}}
					>
						《用户服务协议》
					</Text>
					<Text>与</Text>
					<Text
						className="text-blue-500 font-semibold px-0.5"
						onClick={(e) => {
							e.stopPropagation();
							handleShowTextModal('隐私政策协议', stripHtml(config.policyExpert || '暂无服务协议内容'));
						}}
					>
						《隐私政策》
					</Text>
					<Text>，未勾选此项将无法继续登录服务。</Text>
				</View>
			</View>
		</Page>
	);
};

export default LoginPage;
