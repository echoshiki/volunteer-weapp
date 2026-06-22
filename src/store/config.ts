import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Taro from '@tarojs/taro';
import { WeappConfig } from '@/types/common';
import { getWeappConfigAPI } from '@/services/config';

interface ConfigState {
	config: WeappConfig;
	/** 是否已加载完毕 */
	isLoaded: boolean;
	fetchConfig: () => Promise<void>;
}

// 定义默认兜底配置
const defaultConfig: WeappConfig = {
	appName: '志愿活动服务平台',
	appLogo: '/assets/images/default-logo.png',
	review: true,
};

export const useConfigStore = create<ConfigState>()(
	persist(
		(set) => ({
			config: defaultConfig,
			isLoaded: false,
			fetchConfig: async () => {
				try {
					const data = await getWeappConfigAPI();
					set({ config: data, isLoaded: true });
				} catch (error) {
					set({ isLoaded: true });
				}
			},
		}),
		{
			name: 'config_store',
			storage: createJSONStorage(() => ({
				getItem: Taro.getStorageSync,
				setItem: Taro.setStorageSync,
				removeItem: Taro.removeStorageSync,
			})),
			partialize: (state) => ({ config: state.config }),
		},
	),
);
