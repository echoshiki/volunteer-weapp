import { http } from '@/utils/http';
import { JobCategory, JobItem, JobDetail, EnterpriseItem, EnterpriseDetail } from '@/types/job';
import { PageRes, ListRes } from '@/types/common';

/** 获取岗位分类列表（不分页） */
export const getJobCategoryListAPI = () =>
	http.get<ListRes<JobCategory>>('/volunteer/job/web/allList');

/** 岗位列表请求参数 */
export interface JobListParams {
	/** 岗位分类 ID */
	jobIds?: (number | string)[];
	/** 关键字 */
	keyword?: string;
	/** 是否推荐 */
	isRecommend?: boolean;
	pageNum?: number;
	pageSize?: number;
}

/** 获取岗位列表（分页） */
export const getJobListAPI = (params: JobListParams) =>
	http.get<PageRes<JobItem>>('/volunteer/enterprises/web/jobList', params);

/** 获取岗位详情 */
export const getJobDetailAPI = (id: number | string) =>
	http.get<JobDetail>(`/volunteer/enterprises/web/job/${id}`);

/** 企业列表请求参数 */
export interface EnterpriseListParams {
	/** 市行政编码 */
	cityCode?: number;
	/** 区行政编码 */
	districtCode?: number;
	/** 是否推荐 */
	isRecommend?: boolean;
	/** 岗位分类id */
	jobId?: string[];
	/** 页码 */
	pageNum?: number;
	/** 每页显示条数 */
	pageSize?: number;
	/** 省行政编码 */
	provinceCode?: number;
}

/** 获取企业列表 */
export const getEnterpriseListAPI = (params: EnterpriseListParams) =>
	http.get<PageRes<EnterpriseItem>>('/volunteer/enterprises/web/list', params);

/** 获取企业详情 */
export const getEnterpriseDetailAPI = (enterprisesId: number | string) =>
	http.get<EnterpriseDetail>(`/volunteer/enterprises/web/${enterprisesId}`);
