import { http } from '@/utils/http';
import { JobCategory, Job, JobDetail, JobListParams, EnterpriseDetail } from '@/types/job';
import { PageRes, ListRes } from '@/types/common';

/** 获取岗位分类列表（不分页） */
export const getJobCategoryListAPI = () =>
	http.get<ListRes<JobCategory>>('/volunteer/job/web/allList');

/** 获取岗位列表（分页） */
export const getJobListAPI = (params: JobListParams) =>
	http.get<PageRes<Job>>('/volunteer/enterprises/web/jobList', params);

/** 获取岗位详情 */
export const getJobDetailAPI = (id: number | string) =>
	http.get<JobDetail>(`/volunteer/enterprises/web/job/${id}`);

/** 获取企业详情 */
export const getEnterpriseDetailAPI = (enterprisesId: number | string) =>
	http.get<EnterpriseDetail>(`/volunteer/enterprises/web/${enterprisesId}`);
