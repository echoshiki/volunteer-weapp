import Taro from '@tarojs/taro';
import { useAuthStore } from '@/store/auth';
import { loginAPI, bindPhoneAPI, logoutAPI } from '@/services/auth';
import { getUserInfoAPI } from '@/services/user';
import { mapsTo } from '@/utils/common';

export const useLogin = () => {
	const { authStage, uuid, setLoginSuccess, setNeedBind, updateUserInfo, setLogout } =
		useAuthStore();

	/**
	 * 统一处理登录成功的副作用
	 * @description 包含：保存 Token、拉取用户信息、同步身份状态、处理页面回跳
	 */
	const handleLoginEffect = async (token: string, shouldJump = false) => {
		// 设置登录成功状态
		setLoginSuccess(token);
		try {
			// 获取包含身份标识 (identity) 的完整用户信息
			const info = await getUserInfoAPI();
			updateUserInfo(info);
			if (shouldJump) {
				const instance = Taro.getCurrentInstance();
				const backUrl = instance.router?.params.back_url;
				const target = backUrl ? decodeURIComponent(backUrl) : '/pages/home/index';
				mapsTo(target, 'redirectTo');
			}
		} catch (e) {
			console.error('获取用户信息失败，请检查 token 有效性', e);
		}
	};

	/**
	 * 执行微信登录并进行静默预检
	 * @param isManual 是否由用户手动触发（决定是否显示 Loading 和回跳）
	 */
	const execWxLogin = async (isManual = false) => {
		if (isManual) Taro.showLoading({ title: '登录中...', mask: true });

		try {
			const { code } = await Taro.login();
			const res = await loginAPI(code);

			if (res.token) {
				await handleLoginEffect(res.token, isManual);
			} else if (res.uuid) {
				setNeedBind(res.uuid);
			}
		} catch (e) {
			if (isManual) Taro.showToast({ title: '登录服务异常', icon: 'none' });
		} finally {
			if (isManual) Taro.hideLoading();
		}
	};

	/**
	 * 启动登录 (App.tsx 调用)
	 * @description 静默执行，不干扰用户 UI
	 */
	const onSilentLogin = () => execWxLogin(false);

	/**
	 * 手动重试/登录 (登录页“点击登录”调用)
	 * @description 带有交互反馈和回跳逻辑
	 */
	const onManualLogin = () => execWxLogin(true);

	/**
	 * 手机号一键绑定
	 * @description 流程的核心第二步[cite: 1]
	 */
	const onBindPhone = async (e: any) => {
		if (!e.detail.code) return; // 用户取消授权

		Taro.showLoading({ title: '安全校验中...', mask: true });
		try {
			const res = await bindPhoneAPI({
				uuid: uuid!,
				code: e.detail.code,
			});

			if (res.token) {
				await handleLoginEffect(res.token, true);
				Taro.showToast({ title: '欢迎回来', icon: 'success' });
			}
		} catch (err) {
			console.error('手机号绑定失败', err);
		} finally {
			Taro.hideLoading();
		}
	};

	/**
	 * 注销登录
	 */
	const onLogout = async () => {
		try {
			await logoutAPI();
		} finally {
			setLogout();
			Taro.reLaunch({ url: '/pages/home/index' });
		}
	};

	return {
		onSilentLogin,
		onManualLogin,
		onBindPhone,
		onLogout,
		authStage,
		isLoggedIn: authStage === 'LOGGED_IN',
	};
};
