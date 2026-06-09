import { UploadFileItem } from './common';

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

/** 简历附件 */
export interface ResumeFileItem extends UploadFileItem {
	fileId?: number;
}

/** 简历详情 */
export interface ResumeDetail {
	resumeId: number;
	applicantName: string;
	applicantPhone: string;
	applicantEmail: string;
	/** 0男 1女 2未知 */
	applicantSex: '0' | '1' | '2';
	applicantAge: number;
	applicantAddress: string;
	/** 附件对应 ID */
	resumeFile: string;
	/** 简历审核状态：pending未审批，approved审批通过，rejected审批未通过 */
	reviewStatus: 'pending' | 'approved' | 'rejected';
	volunteerFile: ResumeFileItem[];
}

/** 简历投递记录 */
export interface AppliedJobItem {
	resumeId: number;
	/** 岗位 ID */
	id: number;
	/** 岗位名称 */
	title: string;
	enterprisesId: number;
	enterprisesName: string;
	logo: string;
	/** 求职状态：applied投递，accepted录用，rejected驳回 */
	jobStatus: 'applied' | 'accepted' | 'rejected';
}
