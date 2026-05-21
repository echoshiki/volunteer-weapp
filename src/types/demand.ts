import { ApprovalStatus } from './common';

/** 需求订单状态 */
export type DemandStatus =
	| 'dispatching' // 派单中
	| 'accepted' // 已接单
	| 'serving' // 服务中
	| 'completed' // 已完成
	| 'cancelled'; // 已取消

/** 需求订单服务范围（服务多人、服务单人） */
export type ServiceScope = 'group' | 'individual';

/** 需求服务对象分类 (如：一老一小、通用) */
export interface DemandTarget {
	categoryUserId: number;
	categoryUserName: string;
	description: string;
	img?: string;
}

/** 需求标签 (如：助老陪诊、家电维修) */
export interface DemandTag {
	demandId: number;
	categoryUserId: number;
	demandName: string;
	description: string;
	img?: string;
}

/** 需求订单实体 */
export interface DemandItem {
	orderId: number;
	orderName: string;
	publisher: number;
	nickName: string;
	description: string;
	categoryUserId: number;
	categoryUserName: string;
	serviceScope: ServiceScope; // group代表集体，individual代表个人
	charge: boolean; // true代表免费，false代表收费
	demandId: number;
	demandName: string;
	status: ApprovalStatus;
	acceptStatus: DemandStatus;
}

/** 需求订单详情 */
export interface DemandDetail {
	orderId: number;
	orderName: string;
	publisher: number;
	nickName: string;
	description: string;
	categoryUserId: number;
	categoryUserName: string;
	serviceScope: ServiceScope; // group代表集体，individual代表个人
	charge: boolean; // true代表免费，false代表收费
	demandId: number;
	demandName: string;
	status: ApprovalStatus;
	acceptStatus: DemandStatus;
	auditorId: number;
	auditorName: string;
	userId: number; // 已接单用户ID (最终确定的)
	userName: string; // 已接单用户名称
	categoryServiceId: number;
	categoryPaidId: number;
	categoryPaidName: string; // 收费类型：按小时/天等
	money: number; // 单价
	serviceQuantity: number; // 数量
	serviceManpower: number; // 人数
	servicePrice: number; // 服务总额
	orderTotal: number; // 订单最终总额
	rating: number; // 评价分
	comment: string; // 评价内容
}

/** 抢单/申请列表中的服务方用户 */
export interface ServiceUser {
	userId: number;
	userName: string;
	avatar: string;
	categoryServiceId: string;
	demandId: number;
	demandName: string;
	categoryUserId: number;
	categoryUserName: string;
	categoryPaidId: number;
	categoryPaidName: string;
	money: number;
}
