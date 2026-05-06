import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Taro from '@tarojs/taro';
import { AuthStage, UserInfo } from '@/types/user';

/**
 * 认证状态
 * @param uid 用户ID
 * @param token 用户 token
 * @param tempCode wxcode
 * @param authKey 临时通行证，用于绑定手机号
 * @param userInfo 用户信息
 * @param spread 推广人 ID
 * @param authStage 登陆阶段状态机
 * @param setLoginSuccess 状态设置：登录成功
 * @param setNeedBind 状态设置：需要绑定手机号
 * @param updateUserInfo 更新用户信息
 * @param setSpread 设置推广人 ID
 * @param clearSpread 清除推广人 ID
 * @param logout 退出登录
 */
interface AuthState {
	uid: number | null;
	token: string | null;
	tempCode: string | null;
	authKey: string | null;
	userInfo: UserInfo | null;
	spread: number | null;
	authStage: AuthStage;

	setLoginSuccess: (token: string, uid: number) => void;
	setNeedBind: (key: string, code: string) => void;
	updateUserInfo: (info: UserInfo) => void;
	setSpread: (id: number) => void;
	clearSpread: () => void;
	setLogout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			uid: null,
			token: null,
			authKey: null,
			tempCode: null,
			userInfo: null,
			authStage: 'UNLOGIN',
			spread: null,

			setSpread: (id) => set({ spread: id }),
			clearSpread: () => set({ spread: null }),

			// 状态 A：直接登录成功
			setLoginSuccess: (token, uid) =>
				set({
					uid,
					token,
					authStage: 'LOGGED_IN',
					authKey: null,
					tempCode: null,
				}),

			// 状态 B：半登录，需补全手机号
			setNeedBind: (key, code) =>
				set({
					authKey: key,
					tempCode: code,
					authStage: 'NEED_BIND_PHONE',
					token: null,
				}),

			updateUserInfo: (userInfo) => set({ userInfo }),

			setLogout: () => {
				set({
					token: null,
					uid: null,
					authKey: null,
					userInfo: null,
					authStage: 'UNLOGIN',
				});
				Taro.removeStorageSync('auth-storage');
			},
		}),
		{
			name: 'auth-storage',
			storage: createJSONStorage(() => ({
				getItem: Taro.getStorageSync,
				setItem: Taro.setStorageSync,
				removeItem: Taro.removeStorageSync,
			})),
		},
	),
);
