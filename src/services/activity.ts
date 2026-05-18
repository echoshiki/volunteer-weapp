import { http } from '@/utils/http';
import { ActivityCategory, ActivityItem, ActivityListRes } from '@/types/activity';

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
	http.get<ActivityListRes>('/volunteer/activity/web/list', params);

/** 获取活动详情 */
export const getActivityDetailAPI = (activityId: string | number) =>
	http.get<ActivityItem>(`/volunteer/activity/web/${activityId}`);
