import { create } from 'zustand';
import Taro from '@tarojs/taro';
import { WeappConfig } from '@/types/common';
import { getWeappConfigAPI } from '@/services/config';

interface ConfigStore {
	config: WeappConfig | null;
	isLoaded: boolean; // 标记是否已经加载过
	fetchConfig: () => Promise<void>;
}

// 定义默认兜底配置（防止接口挂了页面白屏）
const defaultConfig: WeappConfig = {
	appName: '家门口服务平台',
	appLogo: '/assets/images/default-logo.png',
};

export const useConfigStore = create<ConfigStore>((set) => ({
	// 初始状态先尝试从本地 Storage 捞一把旧数据，保证极速渲染
	config: Taro.getStorageSync('sys_global_config') || defaultConfig,
	isLoaded: false,

	fetchConfig: async () => {
		try {
			// 请求后端全局配置接口
			const data = await getWeappConfigAPI();

			// 存入内存 (Zustand)
			set({ config: data, isLoaded: true });

			// 异步存入硬盘 (Storage)，供下次冷启动时瞬间读取
			Taro.setStorage({ key: 'sys_global_config', data });
		} catch (error) {
			console.error('获取系统全局配置失败', error);
			// 接口报错时，依然标记为已加载，使用缓存或默认值，不阻塞流程
			set({ isLoaded: true });
		}
	},
}));
