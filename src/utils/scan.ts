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
				// 生产环境建议开启，测试环境可注销
				onlyFromCamera: true,
			});

			const resultText = res.result;

			// 校验与路由
			if (resultText && resultText.includes('activityId=')) {
				const targetActId = resultText.replace('activityId=', '').trim();
				mapsTo(`/pages/activity/check-result/index?activityId=${targetActId}`);
			} else {
				Taro.showToast({ title: '请扫描官方指定的活动二维码', icon: 'none' });
			}
		} catch (error) {
			console.log('扫码取消或失败', error);
		}
	});
};
