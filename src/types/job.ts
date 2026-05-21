/** 岗位分类 */
export interface JobCategory {
	jobId: number;
	jobTitle: string;
	description?: string;
}

/** 岗位列表项目 */
export interface JobItem {
	id: number;
	title: string;
	content: string;
	enterprisesId: number;
	enterprisesName: string;
	/** 岗位分类 ID */
	jobId: number;
	/** 岗位分类名称 */
	jobTitle: string;
	/** 招聘数目 */
	hireCount: number;
	/** 薪资范围，单位 k */
	salaryBudget: string;
}

/** 岗位详情实体 */
export interface JobDetail extends JobItem {}

/** 企业列表项 */
export interface EnterpriseItem {
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
	/** 成立时间 */
	setupTime: string;
	description: string;
}

/** 企业详情 */
export interface EnterpriseDetail extends EnterpriseItem {
	/** 岗位列表 */
	jobList: EnterpriseJob[];
}

/** 企业详情内的简易岗位实体 */
export interface EnterpriseJob {
	id: number;
	title: string;
	description: string;
	/** 岗位分类 ID */
	jobId: number;
	/** 岗位分类名称 */
	jobTitle: string;
	/** 招聘数目 */
	hireCount: number;
	/** 薪资范围，单位 k */
	salaryBudget: string;
}
