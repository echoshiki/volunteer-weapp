import { ApprovalStatus } from './common';

/** 需求订单状态 */
export type DemandStatus =
	| 'dispatching' // 派单中
	| 'accepted' // 已接单
	| 'serving' // 服务中
	| 'completed' // 已完成
	| 'cancelled'; // 已取消

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
	description: string;
	img?: string;
}

/** 需求订单实体 */
export interface DemandItem {
	/** 需求单 ID */
	orderId: number;
	/** 需求单标题 */
	orderName: string;
	/** 需求单分类 ID */
	categoryId: number;
	/** 需求单分类名称 */
	categoryName: string;
	/** 需求单标签 */
	tags: string[];
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
	/** 需求单状态 pending/approved/rejected */
	status: ApprovalStatus;
	/** 是否推荐 */
	isRecommend: boolean;
	/** 发布时间 */
	createTime: string;
}

/** 需求订单详情 */
export interface DemandDetail extends DemandItem {}

/** 抢单/申请列表中的服务方用户 */
export interface ServiceUser {
	userId: number;
	/** 服务方名称 */
	userName: string;
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
