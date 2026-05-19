import { http } from '@/utils/http';
import { JobCategory, JobItem, JobDetail, EnterpriseDetail } from '@/types/job';
import { PageRes, ListRes } from '@/types/common';

/** 获取岗位分类列表（不分页） */
export const getJobCategoryListAPI = () =>
	http.get<ListRes<JobCategory>>('/volunteer/job/web/allList');

/** 岗位列表请求参数 */
export interface JobListParams {
	/** 岗位分类 ID */
	jobId?: number | string;
	/** 关键字 */
	keyword?: string;
	pageNum: number;
	pageSize: number;
}

/** 获取岗位列表（分页） */
export const getJobListAPI = (params: JobListParams) =>
	http.get<PageRes<JobItem>>('/volunteer/enterprises/web/jobList', params);

/** 获取岗位详情 */
export const getJobDetailAPI = (id: number | string) =>
	http.get<JobDetail>(`/volunteer/enterprises/web/job/${id}`);

/** 获取企业详情 */
export const getEnterpriseDetailAPI = (enterprisesId: number | string) =>
	http.get<EnterpriseDetail>(`/volunteer/enterprises/web/${enterprisesId}`);
