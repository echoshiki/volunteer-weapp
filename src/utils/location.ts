import Taro from '@tarojs/taro';

/**
 * 安全获取地理位置
 */
export const getSafeLocation = async (): Promise<{ latitude: number; longitude: number }> => {
	// TODO: 生产环境真正调用微信 API
	// if (process.env.NODE_ENV === 'production') {
	// 	return new Promise((resolve, reject) => {
	// 		Taro.getLocation({
	// 			type: 'gcj02',
	// 			isHighAccuracy: true,
	// 			success: (res) => {
	// 				resolve({ latitude: res.latitude, longitude: res.longitude });
	// 			},
	// 			fail: (err) => {
	// 				console.error('获取定位失败', err);
	// 				reject(err);
	// 			},
	// 		});
	// 	});
	// }

	// 如果是开发环境，返回 Mock 数据
	console.warn('已启用 Mock 定位数据，跳过微信授权');
	return {
		latitude: 32.3938,
		longitude: 119.4126,
	};
};
