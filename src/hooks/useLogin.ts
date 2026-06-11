import Taro from '@tarojs/taro';
import { useAuthStore } from '@/store/auth';
import { loginAPI, bindPhoneAPI, logoutAPI } from '@/services/auth';
import { getUserInfoAPI } from '@/services/user';
import { formatUserInfo } from '@/utils/user';

export const useLogin = () => {
	const { authStage, uuid, setLoginSuccess, setNeedBind, updateUserInfo, setLogout } = useAuthStore();

	/**
	 * 统一处理登录成功的副作用
	 * @description 同步登陆状态、拉取用户信息
	 */
	const handleLoginEffect = async (token: string) => {
		setLoginSuccess(token);
		try {
			// 获取并格式化用户信息到本地
			const raw = await getUserInfoAPI();
			updateUserInfo(formatUserInfo(raw));
		} catch (e) {
			console.error('获取用户信息失败，请检查 token 有效性', e);
		}
	};

	/**
	 * 执行微信登录并进行静默预检
	 * @param isManual 是否由用户手动触发（决定是否显示 Loading）
	 * @returns 返回当前登录所处的最新阶段状态，供页面层进行路由流转
	 */
	const execWxLogin = async (isManual = false) => {
		if (isManual) Taro.showLoading({ title: '登录中...', mask: true });
		try {
			const { code } = await Taro.login();
			const res = await loginAPI(code);
			if (res.token) {
				await handleLoginEffect(res.token);
				return { success: true, stage: 'LOGGED_IN' as const };
			} else if (res.uuid) {
				setNeedBind(res.uuid);
				return { success: true, stage: 'NEED_BIND_PHONE' as const };
			}
			return { success: false };
		} catch (e) {
			if (isManual) Taro.showToast({ title: '登录服务异常', icon: 'none' });
			return { success: false };
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
		if (!e.detail.code || !uuid) return;
		Taro.showLoading({ title: '安全校验中...', mask: true });
		try {
			const res = await bindPhoneAPI({
				uuid: uuid!,
				code: e.detail.code,
			});
			if (res.token) {
				await handleLoginEffect(res.token);
				Taro.showToast({ title: '欢迎回来', icon: 'success' });
				return res.token;
			}
		} catch (err) {
			console.error('手机号绑定失败', err);
		} finally {
			Taro.hideLoading();
		}
		return null;
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
