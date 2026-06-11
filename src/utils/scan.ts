import Taro from '@tarojs/taro';
import { runWithAuth } from './auth';
import { mapsTo } from './common';

/**
 * 全局扫码打卡统筹函数
 * 可以在首页、个人中心、悬浮加号等任何地方调用
 */
export const doGlobalScan = () => {
	// 未登录会自动拦截并跳转登录页
	runWithAuth(async () => {
		try {
			// 唤起扫码
			const res = await Taro.scanCode({
				onlyFromCamera: true,
			});

			// ==========================================
			// 场景 A：扫的是微信官方生成的小程序码
			// ==========================================
			if (res.scanType === 'WX_CODE' && res.path) {
				let targetPath = res.path.startsWith('/') ? res.path : `/${res.path}`;

				if (targetPath.includes('scene=')) {
					const parts = targetPath.split('scene=');
					const basePath = parts[0];
					const sceneValue = parts[1];
					targetPath = `${basePath}scene=${encodeURIComponent(sceneValue)}`;
				}

				mapsTo(targetPath);
				return;
			}

			// ==========================================
			// 场景 B：扫的是普通方形二维码
			// ==========================================
			if (res.result && res.result.includes('activityId=')) {
				// 用正则安全提取纯数字 ID，防止链接里混杂其他参数
				const match = res.result.match(/activityId=(\d+)/);
				if (match && match[1]) {
					const targetActId = match[1];
					mapsTo(`/pages/activity/check/index?activityId=${targetActId}`);
					return;
				}
			}

			Taro.showToast({ title: '请扫描官方指定的活动二维码', icon: 'none' });
		} catch (error) {
			console.log('扫码取消或失败', error);
		}
	});
};
