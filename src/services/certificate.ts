import { http } from '@/utils/http';

export interface GenerateCertRequest {
	/** 志愿活动 ID */
	activityId: number;
}

export interface GenerateCertRes {
	/** 后端生成的高清证书照片绝对路径 */
	url: string;
}

/**
 * 志愿者生成活动荣誉证书接口
 */
export const generateCertificateAPI = (data: GenerateCertRequest) =>
	http.post<GenerateCertRes>('/volunteer/activity/web/certificate', data);
