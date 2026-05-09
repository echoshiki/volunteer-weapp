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
	activityStartTime: string;
	activityEndTime: string;
	rules: string;
	address: string;
	attendance: number | string;
	maxPeople: number | string;
	organizer: string;
	banner: string;
	content: string;
	status: 'started' | 'ended';
}

/** 活动列表请求参数 */
export interface ActivityListParams {
	pageNum: number;
	pageSize: number;
	categoryId?: number;
	keyword?: string;
	status?: string;
}

/** 活动列表响应结构 */
export interface ActivityListRes {
	list: ActivityItem[];
	total: number;
	totalPage: number;
	page: number;
	limit: number;
}
