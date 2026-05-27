import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Taro from '@tarojs/taro';
import { AuthStage, UserInfo } from '@/types/user';

interface AuthState {
	/** 登录成功后的 Token 值 */
	token: string | null;
	/** 临时的 UUID 值，用于用户注册时绑定手机号 */
	uuid: string | null;
	/** 用户信息 */
	userInfo: UserInfo | null;
	/** 登陆阶段状态机：UNLOGIN-未登录, NEED_BIND_PHONE-需绑定手机, LOGGED_IN-已登录 */
	authStage: AuthStage;

	/** 状态设置：登录成功 */
	setLoginSuccess: (token: string) => void;
	/** 状态设置：需要绑定手机号 */
	setNeedBind: (uuid: string) => void;
	/** 更新用户信息 */
	updateUserInfo: (info: UserInfo) => void;
	/** 退出登录，清空状态并重置存储 */
	setLogout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
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
					userInfo: null,
				}),

			updateUserInfo: (userInfo) => set({ userInfo }),

			setLogout: () => {
				set({
					token: null,
					uuid: null,
					userInfo: null,
					authStage: 'UNLOGIN' as AuthStage,
				});
			},
		}),
		{
			name: 'auth_store',
			storage: createJSONStorage(() => ({
				getItem: Taro.getStorageSync,
				setItem: Taro.setStorageSync,
				removeItem: Taro.removeStorageSync,
			})),
		},
	),
);
