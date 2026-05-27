/**
 * 登录阶段状态机
 */
export type AuthStage =
	| 'UNLOGIN' // 未登录
	| 'NEED_BIND_PHONE' // 需要绑定手机号
	| 'LOGGED_IN'; // 已登录

/**
 * 用户角色身份标识
 * 'user': 普通用户 | 'volunteer': 志愿者 | 'institution': 机构
 */
export type UserIdentity = 'user' | 'volunteer' | 'institution';

/**
 * 性别标识
 * '0': 男 | '1': 女 | '2': 未知
 */
export type UserSex = '0' | '1' | '2';

/** 用户信息实体 */
export interface UserInfo {
	/** 用户ID */
	userId?: string | number;
	/** 用户头像 URL */
	avatar?: string;
	/** 用户昵称 */
	nickName?: string;
	/** 性别 */
	sex?: UserSex | string;
	/** 联系电话 */
	phonenumber?: string;
	/** 生日 (格式如: YYYY-MM-DD) */
	birthday?: string;
	/** 邮箱 */
	email?: string;
	/** 身份标识 user: 普通用户 | volunteer: 志愿者 | institution: 机构 */
	identity?: UserIdentity;
	/** 用户总积分 */
	points: number;
	/** 志愿活动总时长 (小时) */
	duration: number;
	/** 审核信息ID (用于关联实名或资质审核记录) */
	reviewId: number;
	/** 省行政编码 */
	provinceCode?: number;
	/** 省名称 */
	provinceName?: string;
	/** 市行政编码 */
	cityCode?: number;
	/** 市名称 */
	cityName?: string;
	/** 区行政编码 */
	districtCode?: number;
	/** 区名称 */
	districtName?: string;
	/** 区域坐标父级ID（大区ID，用于关联志愿者协会大区） */
	parentId?: number;
	/** 区域坐标父级名称 */
	parentName?: string;
	/** 区域坐标ID（具体小区/社区坐标） */
	regionId?: number;
	/** 小区/社区名称 */
	regionName?: string;
	/** 地址 */
	address?: string;
}
