/**
 * 活动状态类型
 * - pending: 待开始
 * - started: 进行中
 * - ended: 已结束
 */
export type ActivityStatus = 'pending' | 'started' | 'ended';

/**
 * 报名状态类型
 * - pending: 待开始
 * - started: 进行中
 * - ended: 已结束
 */
export type EnrollStatus = 'pending' | 'started' | 'ended';

/** 我的报名审核状态 */
export type AuditStatus = 'pending' | 'approved' | 'rejected';

/** 志愿活动分类 */
export interface ActivityCategory {
	categoryId: number;
	categoryName: string;
	description: string;
	img: string;
}

/** 志愿活动基础对象 */
export interface ActivityItem {
	activityId: number;
	activityName: string;
	categoryId: number;
	categoryName: string;
	startTime: string;
	endTime: string;
	/** 活动报名开始时间 */
	enrollStartTime: string;
	/** 活动报名截止时间 */
	enrollEndTime: string;
	rules: string;
	address: string;
	attendance: number | string;
	maxPeople: number | string;
	organizer: string;
	banner: string;
	content: string;
	status: ActivityStatus;
	/** 报名状态 */
	enrollStatus: EnrollStatus;
	/** 是否已报名 */
	isEnrolled: boolean;
}

export interface ActivityRecordItem {
	/** 活动 ID */
	activityId: number;
	/** 活动名称 */
	activityName: string;
	/** 分类名称 */
	categoryName: string;
	/** 组织者 */
	organizer: string;
	/** 活动图片 */
	banner: string;
	/** 活动开始时间 */
	startTime: string;
	/** 活动结束时间 */
	endTime: string;
	/** 活动地址 */
	address: string;
	/** 报名审核状态 */
	auditStatus: AuditStatus;
	/** 拒绝理由 */
	rejectReason?: string;
	/** 签到时间 */
	checkInTime: string | null;
	/** 签退时间 */
	checkOutTime: string | null;
	/** 服务时长 */
	duration: number | null;
}
