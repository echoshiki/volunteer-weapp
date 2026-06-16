import Taro from '@tarojs/taro';

/**
 * 安全获取地理位置
 */
export const getSafeLocation = async (): Promise<{ latitude: number; longitude: number }> => {
	// return new Promise((resolve, reject) => {
	// 	Taro.getLocation({
	// 		type: 'gcj02',
	// 		isHighAccuracy: true,
	// 		success: (res) => resolve({ latitude: res.latitude, longitude: res.longitude }),
	// 		fail: (err) => {
	// 			console.error('获取定位失败', err);

	// 			if (err.errMsg?.includes('auth deny') || err.errMsg?.includes('auth denied')) {
	// 				Taro.showModal({
	// 					title: '定位权限未开启',
	// 					content: '打卡履约需要获取您的实时地理位置，请在随后打开的设置页中勾选“使用我的地理位置”。',
	// 					confirmText: '去开启',
	// 					success: (modalRes) => {
	// 						if (modalRes.confirm) Taro.openSetting();
	// 					},
	// 				});
	// 			} else if (err.errMsg?.includes('system permission denied')) {
	// 				Taro.showModal({
	// 					title: '系统定位未开启',
	// 					content:
	// 						'检测到您的手机系统或微信客户端的定位开关已关闭，请在手机系统「设置」中允许微信访问位置。',
	// 					showCancel: false,
	// 				});
	// 			} else {
	// 				Taro.showToast({ title: '卫星定位搜寻失败，请挪步到开阔地带重试', icon: 'none' });
	// 			}

	// 			reject(err);
	// 		},
	// 	});
	// });

	console.warn('已启用 Mock 定位数据，跳过微信授权');
	return {
		latitude: 32.3938,
		longitude: 119.4126,
	};
};

/**
 * 高精度球面距离计算器（单位：km）
 */
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): string => {
	if (!lat1 || !lng1 || !lat2 || !lng2) return '';

	const TO_RAD = Math.PI / 180;
	const R = 6371; // 地球平均半径 (KM)

	const dLat = (lat2 - lat1) * TO_RAD;
	const dLng = (lng2 - lng1) * TO_RAD;

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * TO_RAD) * Math.cos(lat2 * TO_RAD) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = R * c;

	// 如果小于 1 公里，展示米(m)；大于 1 公里，保留一位小数展示公里(km)
	if (distance < 1) {
		return `${Math.round(distance * 1000)}m`;
	}
	return `${distance.toFixed(1)}km`;
};
