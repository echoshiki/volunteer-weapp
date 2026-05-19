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

/** 活动列表响应结构 */
export interface ActivityListRes {
	list: ActivityItem[];
	total: number;
	totalPage: number;
	page: number;
	limit: number;
}
