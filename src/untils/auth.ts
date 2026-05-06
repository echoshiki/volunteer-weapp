import Taro from '@tarojs/taro';
import { useAuthStore } from '@/store/auth';
import { getCurrentPageUrl, mapsTo } from './common';

/**
 * 场景一：页面内验证 (In-page Check)
 * 逻辑：[页面A] -> [登录页] -> [页面A]
 * 表现：替换当前页面，防止返回时再次看到“需登录”的空白页
 */
export const checkLogin = (targetUrl?: string): boolean => {
	const { token } = useAuthStore.getState();
	if (!token) {
		const backUrl = targetUrl || getCurrentPageUrl();
		mapsTo(`/pages/login/index?back_url=${encodeURIComponent(backUrl)}`, 'redirectTo');
		return false;
	}
	return true;
};

/**
 * 场景二：跳转前验证 (Pre-navigation Check)
 * 逻辑：[页面A] -> [页面A, 登录页] -> [页面A, 目标页B]
 * 表现：保留当前页 A，登录成功后替换掉登录页，点返回回到 A
 */
export function navigateWithAuth(targetUrl: string): void {
	const { token } = useAuthStore.getState();
	if (token) {
		mapsTo(targetUrl);
	} else {
		mapsTo(`/pages/login/index?back_url=${encodeURIComponent(targetUrl)}`, 'navigateTo');
	}
}

/**
 * 鉴权执行器 (Auth-guarded Executor)
 * 逻辑：在任何需要登录的操作前调用，自动处理登录流程
 * 表现：如果未登录，先引导登录，登录成功后继续执行原操作
 */
export const runWithAuth = (action: () => void, targetUrl?: string) => {
	const { token } = useAuthStore.getState();
	if (token) {
		action();
	} else {
		const backUrl = targetUrl || getCurrentPageUrl();
		mapsTo(`/pages/login/index?back_url=${encodeURIComponent(backUrl)}`, 'navigateTo');
	}
};

/**
 * 身份权限校验 (新增)
 * @param role 要求的角色 'volunteer' | 'institution'
 */
export const checkRole = (role: string): boolean => {
	const { token, userInfo } = useAuthStore.getState();
	if (!token) {
		checkLogin();
		return false;
	}
	if (userInfo?.identity !== role) {
		Taro.showToast({ title: '无权访问该模块', icon: 'none' });
		return false;
	}
	return true;
};
