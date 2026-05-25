/** 统一响应结构 */
export interface BaseResponse<T> {
	code: number;
	data?: T;
	msg: string;
}

/** 基础分页结构 */
export interface PageRes<T> {
	list: T[];
	page: number;
	limit: number;
	total: number;
	totalPage: number;
}

/** 基础列表结构 */
export interface ListRes<T> {
	list: T[];
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

/** 审核状态 */
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type ThemeVariant = 'primary' | 'success' | 'secondary' | 'warning' | 'danger' | 'info';

export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** 自定义区域项 */
export interface TenantItem {
	id: number;
	name: string;
	longitude: number;
	latitude: number;
}
