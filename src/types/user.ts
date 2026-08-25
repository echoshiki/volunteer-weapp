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

/** 认证审核资料 */
export interface ApplyReview {
	id?: number;
	/** 审核类型 1=机构审核 2=志愿者审核 */
	reviewType: 1 | 2;
	provinceCode: number;
	cityCode: number;
	districtCode: number;
	address: string;
	phone: string;
	/** 真实姓名 */
	realName?: string;
	/** 身份证号 */
	idCard?: string;
	/** 身份证正面 */
	idCardFront?: string;
	/** 身份证反面 */
	idCardBack?: string;
	/** 机构名称 */
	institutionName?: string;
	/** 法人姓名 */
	legalPerson?: string;
	/** 法人手机号 */
	legalPersonPhone?: string;
	/** 组织机构代码 */
	orgCode?: string;
	/** 组织机构代码证 */
	orgCodeCertUrl?: string;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

/**
 * 申请历史记录单条数据项
 */
export interface ApplyHistoryItem {
	/** 审核信息id */
	reviewId: number;
	/** 志愿者协会名称 (reviewType=1 时有效) */
	volunteerName: string;
	/** 机构名称 (reviewType=2 时有效) */
	institutionName: string;
	/** 审核认证类型: 1：志愿者；2：服务机构 */
	reviewType: 1 | 2;
	tenantId: number;
	/** 审核状态 */
	status: ReviewStatus;
	/** 创建时间 */
	createTime: string;
	/** 审核通过/失败时间 */
	updateTime: string;
	/** 审核描述 (如驳回原因) */
	remark: string;
}

/** 公开的服务资料主页 */
export interface ServiceProviderProfile {
	userId: number;
	/** 志愿者/机构负责人名称 */
	realName: string;
	/** 头像 */
	avatar: string;
	/** 机构名称 */
	institutionName: string;
	/** 认证时间 */
	reviewTime: string;
	/** 身份标识 */
	identity: UserIdentity;
	/** 志愿活动总时长 (小时) */
	duration: number;
	/** 历史服务次数 */
	serviceCount: number;
	/** 常驻省 */
	provinceName: string;
	/** 常驻市 */
	cityName: string;
	/** 常驻区 */
	districtName: string;
	/** 常驻服务区域 */
	tenantName: string;
	/** 办公驻地/服务点详细地址 */
	address: string;
	/** 履历 */
	resume: string;
}
