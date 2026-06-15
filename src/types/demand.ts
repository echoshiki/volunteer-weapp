import { AuditStatus } from './common';
import { UserIdentity } from './user';

/** 报价单状态 */
export type BidStatus = 'pending' | 'selected' | 'unselected' | 'invalid';

/** 需求服务对象分类 (如：一老一小、通用) */
export interface DemandCategory {
	categoryId: number;
	categoryName: string;
	description: string;
	img?: string;
}

/** 需求标签 (如：助老陪诊、家电维修) */
export interface DemandTag {
	tagId: number;
	tagName: string;
}

/** 需求订单实体 */
export interface DemandItem {
	/** 需求单 ID */
	demandId: number;
	/** 需求单标题 */
	demandName: string;
	/** 需求单分类 ID */
	categoryId: number;
	/** 需求单分类名称 */
	categoryName: string;
	/** 需求单标签 */
	tags: DemandTag[];
	/** 需求单详情描述 */
	content: string;
	provinceCode: number;
	provinceName: string;
	cityCode: number;
	cityName: string;
	districtCode: number;
	districtName: string;
	tenantId: number;
	tenantName: string;
	/** 转换的服务订单 ID */
	orderId: number;
	userId: number;
	/** 需求单详细地址 */
	address: string;
	/** 联系人 */
	name: string;
	/** 联系电话 */
	phone: string;
	/** 应急电话 */
	emergencyCall: string;
	/** true 代表免费，false 代表收费 */
	charge: boolean;
	/** 最低预算 */
	minMoney: number;
	/** 最高预算 */
	maxMoney: number;
	/** 需求单状态 pending/approved/rejected/completed */
	status: AuditStatus;
	/** 是否推荐 */
	isRecommend: boolean;
	/** 当前用户是否报过价 */
	isBid: boolean;
	/** 报价总计 */
	serviceUserCount: number;
	/** 发布时间 */
	createTime: string;
}

/** 需求订单详情 */
export interface DemandDetail extends DemandItem {}

/** 需求单里的报价单 */
export interface DemandBidItem {
	id: number;
	userId: number;
	/** 服务方名称 */
	name: string;
	/** 服务方身份 */
	identity: Exclude<UserIdentity, 'user'>;
	/** 服务方头像 */
	avatar: string;
	/** 服务方电话 */
	phone: string;
	/** 服务单总数 */
	serviceCount: number;
	/** 报价金额 */
	money: number;
	/** 报价描述 */
	description: string;
	/** 报价时间 */
	createTime: string;
}

/** 服务方用户中心的报价单 */
export interface MyBidItem {
	id: number;
	demandId: number;
	demandName: string;
	userId: number;
	name: string;
	phone: string;
	money: number;
	description: string;
	createTime: string;
	status: BidStatus;
	employerName: string;
	employerPhone: string;
}
