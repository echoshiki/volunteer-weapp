import { http } from '@/utils/http';
import {
	JobCategory,
	JobItem,
	JobDetail,
	EnterpriseItem,
	EnterpriseDetail,
	ResumeFileItem,
	ResumeDetail,
	AppliedJobItem,
} from '@/types/job';
import { PageRes, ListRes } from '@/types/common';

/** 获取岗位分类列表（不分页） */
export const getJobCategoryListAPI = () =>
	http.get<ListRes<JobCategory>>('/volunteer/job/web/allList');

/** 岗位列表请求参数 */
export interface JobListParams {
	/** 岗位分类 ID */
	jobIds?: string;
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
	jobIds?: string;
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

export interface AddResumeRequest {
	applicantName: string;
	applicantPhone: string;
	applicantEmail: string;
	volunteerFile: ResumeFileItem[];
}

/** 创建简历 */
export const addResumeAPI = (data: AddResumeRequest) =>
	http.post('/volunteer/resume/web/add', data);

/** 获取简历详情 */
export const getResumeDetailAPI = () => http.get<ResumeDetail>(`/volunteer/resume/web/info`);

export interface UpdateResumeRequest {
	resumeId: number;
	applicantName: string;
	applicantPhone: string;
	applicantEmail: string;
	volunteerFile: ResumeFileItem[];
}

/** 修改简历内容 */
export const updateResumeAPI = (data: UpdateResumeRequest) =>
	http.put('/volunteer/resume/web/update', data);

/** 获取已投递岗位列表（分页） */
export const getAppliedJobListAPI = (params: { pageNum: number; pageSize: number }) =>
	http.get<PageRes<AppliedJobItem>>('/volunteer/resume/web/appliedList', params);

export interface DeliverRequest {
	/** 岗位id */
	id: number;
}

/** 投递岗位 */
export const deliverJobAPI = (data: DeliverRequest) =>
	http.post('/volunteer/resume/web/deliver', data);
