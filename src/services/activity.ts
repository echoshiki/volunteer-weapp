import { http } from '@/utils/http';
import { ActivityCategory, ActivityItem, MyActivityItem } from '@/types/activity';
import { PageRes } from '@/types/common';

/** 获取分类列表 */
export const getActivityCategoryListAPI = () =>
	http.get<ActivityCategory[]>('/volunteer/category/web/list');

/** 活动列表请求参数 */
export interface ActivityListParams {
	/** 页码 */
	pageNum: number;
	/** 每页数据量 */
	pageSize: number;
	/** 分类 id */
	categoryId?: number;
	/** 搜索关键词 */
	keyword?: string;
	/** 活动状态 */
	status?: string;
}

/** 获取活动列表 */
export const getActivityListAPI = (params: ActivityListParams) =>
	http.get<PageRes<ActivityItem>>('/volunteer/activity/web/list', params);

/** 获取活动详情 */
export const getActivityDetailAPI = (activityId: string | number) =>
	http.get<ActivityItem>(`/volunteer/activity/web/${activityId}`);

/**
 * 志愿者报名活动
 */
export const enrollActivityAPI = (activityId: number) => {
	return http.post('/volunteer/activity/web/entry', {
		activityId,
	});
};

/**
 * 获取我的志愿活动列表
 */
export const getMyActivityListApi = (pageNum: number, pageSize: number = 10) => {
	return http.get<PageRes<MyActivityItem>>('/volunteer/activity/web/activityList', {
		pageNum,
		pageSize,
	});
};

export interface CheckActivityParams {
	/** 打卡活动 ID */
	activityId: number;
	latitude?: number;
	longitude?: number;
}

export interface CheckActivityRes {
	/** 打卡类型：签到/签退 */
	actionType: 'checkIn' | 'checkOut';
	/** 打卡时间 */
	checkTime: string;
	/** 服务时长 */
	duration: number | null;
	message: string;
}

/**
 * 志愿活动打卡
 */
export const checkActivityAPI = (params: CheckActivityParams) => {
	return http.post<CheckActivityRes>('/volunteer/activity/web/check', params);
};
