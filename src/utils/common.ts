import Taro from '@tarojs/taro';

/**
 * 将对象转换为查询参数字符串，用于拼接到 URL 后面
 * @param params 要转换的对象
 */
export const serializeParams = (params: any = {}): string => {
	const query = Object.entries(params)
		.filter(([, value]) => value !== undefined && value !== null && value !== '')
		.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
		.join('&');
	return query ? `?${query}` : '';
};

/**
 * 获取当前页面的 URL
 */
export const getCurrentPageUrl = (): string => {
	const pages = Taro.getCurrentPages();
	const currentPage = pages[pages.length - 1];
	if (!currentPage) return '/pages/home/index';
	const route = `/${currentPage.route}`;
	const queryString = serializeParams(currentPage.options);
	return `${route}${queryString}`;
};

/**
 * 判断是否为 TabBar 页面
 * @param path 页面路径
 */
export const isTabBarPage = (path: string): boolean => {
	const tabBars = [
		'pages/home/index',
		'pages/category/index',
		'pages/cart/index',
		'pages/user/center/index',
	];
	const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
	const purePath = normalizedPath.split('?')[0];
	return tabBars.includes(purePath);
};

/**
 * 跳转到指定页面
 * @param url 页面路径
 * @param type 跳转类型
 */
export const mapsTo = (
	url: string,
	type: 'navigateTo' | 'redirectTo' | 'reLaunch' = 'navigateTo',
) => {
	const path = url.split('?')[0];
	isTabBarPage(path) ? Taro.switchTab({ url }) : Taro[type]({ url });
};

/**
 * 获取占位图
 * @param width 宽度
 * @param height 高度
 * @param bgColor 背景颜色
 * @param textColor 文字颜色
 * @param text 文字内容
 */
export const getPlaceholder = (
	width: number,
	height: number,
	bgColor: string = 'cdcdcd',
	textColor: string = '969696',
	text: string = '加载中',
) => {
	return `https://placehold.jp/${bgColor}/${textColor}/${width}x${height}.png?text=${encodeURIComponent(text)}`;
};

/**
 * 一键复制功能
 * @param text 要复制的文本
 */
export const handleCopy = (text: string) => {
	Taro.setClipboardData({
		data: text,
		success: () => Taro.showToast({ title: '已复制', icon: 'success' }),
	});
};

/**
 * 格式化销量数字
 * 超过 10000 时显示为 x.xx万 格式
 */
export const formatSales = (num: number | string): string => {
	const n = Number(num);
	if (isNaN(n)) return '0';
	if (n >= 10000) {
		const wan = n / 10000;
		// 去掉末尾多余的 0，如 1.50 → 1.5，1.00 → 1
		return parseFloat(wan.toFixed(2)) + '万';
	}
	return String(n);
};

/**
 * 格式化志愿时长 (单位：分钟或小时)
 * @param minutes 分钟数
 */
export const formatDuration = (minutes: number): string => {
	if (!minutes || isNaN(minutes)) return '0';
	if (minutes < 60) return `${minutes}分钟`;
	const hours = (minutes / 60).toFixed(1);
	return `${parseFloat(hours)}小时`;
};

/**
 * 格式化富文本中的图片
 * @param html
 * @returns
 */
export const cleanHTML = (html: string, noMargin: boolean = false) => {
	if (!html) return '';
	return (
		html
			// 移除 figure 标签但保留内部内容
			.replace(/<figure[^>]*>/g, '')
			.replace(/<\/figure>/g, '')
			// 移除危险标签
			.replace(/<script[^>]*>.*?<\/script>/gi, '')
			.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
			// 视频标签转换
			.replace(/<video/gi, '<video style="max-width:100%;height:auto;" ')
			// 移除 figcaption 标签
			.replace(/<figcaption[^>]*>.*?<\/figcaption>/g, '')
			// 移除 data-trix-* 自定义属性
			.replace(/ data-trix-[^=]+="[^"]*"/g, '')
			// 为图片添加自适应样式（核心修改）
			.replace(/<img([^>]*)>/gi, (_match, attrs) => {
				// 保留原有属性，移除可能存在的width/height
				const cleanAttrs = attrs
					.replace(/(width|height)\s*=\s*["']\d+["']/gi, '')
					.replace(/style\s*=\s*["'][^"']*["']/gi, '');
				return `<img style="display:block;margin-top:${noMargin ? '0' : '12px'};margin-bottom:${noMargin ? '0' : '12px'};max-width:100%;height:auto;${cleanAttrs.match(/style\s*=\s*["']([^"']*)["']/)?.[1] || ''}" ${cleanAttrs}>`;
			})
	);
};
