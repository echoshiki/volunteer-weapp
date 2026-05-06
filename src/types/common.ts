// 统一请求响应格式
export interface BaseResponse<T> {
	code: number;
	data: T;
	msg: string;
}

// 基础分页结构，对齐你提供的 JSON 结构
export interface PageRes<T> {
	list: T[];
	page: number;
	limit: number;
	total: number;
	totalPage: number;
}

// 轮播图数据
export interface SwiperData {
	id?: number | string;
	pic: string;
	url?: string;
}

// Tab 项
export interface TabItem {
	label: string;
	value: string;
}

/**
 * 推广分享配置
 * @param title 分享标题
 * @param path 分享路径（小程序内路径，必须以 / 开头）
 * @param imageUrl 分享图片 URL
 * @param params 额外的参数对象，会被序列化到 path 中
 */
export interface ShareConfig {
	title?: string;
	path?: string;
	imageUrl?: string;
	params?: Record<string, any>;
}
