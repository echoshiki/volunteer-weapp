/** 岗位分类 */
export interface JobCategory {
	jobId: number;
	jobTitle: string;
	description?: string;
}

/** 岗位列表请求参数 */
export interface JobListParams {
	jobId?: number | string; // 按分类筛选
	keyword?: string; // 预留关键字搜索
	pageNum: number;
	pageSize: number;
}

/** 岗位实体 */
export interface Job {
	id: number;
	title: string;
	enterprisesId: number;
	enterprisesName: string;
	jobId: number;
	jobTitle: string;
	description: string;
	hireCount: number;
	salaryBudget: string;
}

/** 岗位详情实体 */
export interface JobDetail {
	id: number;
	title: string;
	enterprisesId: number;
	enterprisesName: string;
	jobId: number;
	jobTitle: string;
	description: string;
	hireCount: number;
	salaryBudget: string; // 薪资范围，如 "5-8"
}

/** 企业详情内的简易岗位实体 */
export interface EnterpriseJob {
	id: number;
	title: string;
	description: string;
	jobId: number;
	jobTitle: string;
	hireCount: number;
	salaryBudget: string;
}

/** 企业详情 */
export interface EnterpriseDetail {
	enterprisesId: number;
	enterprisesName: string;
	contactName: string;
	contactPhone: string;
	provinceCode: number;
	cityCode: number;
	districtCode: number;
	provinceName: string;
	cityName: string;
	districtName: string;
	address: string;
	logo: string;
	setupTime: string;
	description: string;
	jobList: EnterpriseJob[];
}
