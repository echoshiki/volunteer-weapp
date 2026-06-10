import Taro from '@tarojs/taro';

/**
 * 微信模版通知订阅
 * @param templateIds 后端申请并提供给你的模版 ID 数组
 */
export const requestNotification = (templateIds: string[]): Promise<boolean> => {
	return new Promise((resolve) => {
		if (Taro.getEnv() !== Taro.ENV_TYPE.WEAPP) return resolve(false);
		Taro.requestSubscribeMessage({
			tmplIds: templateIds,
			entityIds: templateIds,
			success: (res) => {
				const isAccepted = templateIds.every((id) => res[id] === 'accept');
				if (isAccepted) {
					console.log('用户全部同意订阅通知');
				} else {
					console.warn('用户拒绝了部分或全部通知');
				}
				resolve(true);
			},
			fail: (err) => {
				console.error('唤起订阅消息失败', err);
				resolve(false);
			},
		});
	});
};
