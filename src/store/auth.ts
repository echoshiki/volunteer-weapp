import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Taro from '@tarojs/taro';
import { AuthStage, UserInfo } from '@/types/user';

/**
 * 认证状态
 * @param uid 用户ID
 * @param token 用户 token
 * @param uuid 临时通行证，用于绑定手机号
 * @param userInfo 用户信息
 * @param authStage 登陆阶段状态机：UNLOGIN-未登录, NEED_BIND_PHONE-需绑定手机, LOGGED_IN-已登录
 * @param setLoginSuccess 状态设置：登录成功
 * @param setNeedBind 状态设置：需要绑定手机号
 * @param updateUserInfo 更新用户信息
 * @param setLogout 退出登录，清空状态并重置存储
 */
interface AuthState {
	uid: string | number | null;
	token: string | null;
	uuid: string | null;
	userInfo: UserInfo | null;
	authStage: AuthStage;

	setLoginSuccess: (token: string, userInfo?: UserInfo) => void;
	setNeedBind: (uuid: string) => void;
	updateUserInfo: (info: UserInfo) => void;
	setLogout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			uid: null,
			token: null,
			uuid: null,
			userInfo: null,
			authStage: 'UNLOGIN',

			// 状态 A：直接登录成功
			setLoginSuccess: (token) =>
				set({
					token,
					authStage: 'LOGGED_IN',
					uuid: null,
				}),

			// 状态 B：半登录，需补全手机号
			setNeedBind: (uuid) =>
				set({
					uuid: uuid,
					authStage: 'NEED_BIND_PHONE',
					token: null,
					uid: null,
					userInfo: null,
				}),

			updateUserInfo: (userInfo) =>
				set({
					uid: userInfo.userId,
					userInfo: userInfo,
				}),

			setLogout: () => {
				set({
					token: null,
					uid: null,
					uuid: null,
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
