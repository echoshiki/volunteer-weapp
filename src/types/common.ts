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

/** 通用审核状态 */
export type AuditStatus = 'pending' | 'approved' | 'rejected' | 'completed';

/** 通用主题变体 */
export type ThemeVariant = 'primary' | 'success' | 'secondary' | 'warning' | 'danger' | 'info';

/** 通用尺寸变体 */
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** 后端省市区类型 */
export interface RegionItem {
	areaCode: string;
	name: string;
	parentCode: string;
}

/** 自定义区域项 */
export interface TenantItem {
	id: number;
	name: string;
	longitude: number;
	latitude: number;
}

/**
 * 全局系统配置
 */
export interface WeappConfig {
	/** 平台名称 */
	appName: string;
	/** 平台全局 Logo URL */
	appLogo?: string;
	/** 平台描述 */
	appDescription?: string;
	/** 全局客服热线 */
	servicePhone?: string;
	/** 全局客服热线 */
	serviceEmail?: string;
	/** 用户协议 URL */
	agreementUrl?: string;
	/** 用户协议摘要 */
	agreementExpert?: string;
	/** 隐私条款 URL */
	policyUrl?: string;
	/** 隐私条款摘要 */
	policyExpert?: string;
	/** 版权信息 */
	copyright?: string;
	/** 备案号 */
	icp?: string;
	/** 订阅模板 */
	templateIds?: {
		demandChange: string;
		demandSelected: string;
	};
}

export interface UploadFileItem {
	fileName: string;
	filePath: string;
	fileSize: number;
	fileType: string;
}
