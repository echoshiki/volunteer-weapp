import { http } from '@/utils/http';
import {
	ActivityCategory,
	ActivityItem,
	ActivityListParams,
	ActivityListRes,
} from '@/types/activity';

/** 获取分类列表 */
export const getActivityCategoryListAPI = () =>
	http.get<ActivityCategory[]>('/volunteer/category/web/list');

/** 获取活动列表 */
export const getActivityListAPI = (params: ActivityListParams) =>
	http.get<ActivityListRes>('/volunteer/activity/web/list', params);

/** 获取活动详情 */
export const getActivityDetailAPI = (activityId: string | number) =>
	http.get<ActivityItem>(`/volunteer/activity/web/${activityId}`);
