import { http } from '@/utils/http';
import {
	ApplyHistoryItem,
	ApplyReview,
	ProviderOrderItem,
	ProviderOrderListParams,
	ReviewStatus,
	ServiceProviderProfile,
	UserInfo,
} from '@/types/user';
import { PageRes } from '@/types/common';

/**
 * 获取用户信息接口
 */
export const getUserInfoAPI = () => http.get<UserInfo>('/wx/getInfo');

export interface UpdatesUserInfoRequest {
	/** 昵称 */
	nickName: string;
	/** 头像 URL */
	avatar: string;
	/** 生日 (YYYY-MM-DD) */
	birthday: string;
	/** 性别，0=男, 1=女, 2=未知 */
	sex: string;
	/** 省行政编码 */
	provinceCode: number;
	/** 市行政编码 */
	cityCode: number;
	/** 区行政编码 */
	districtCode: number;
	/** 详细地址 */
	address: string;
}

/**
 * 更新用户个人资料
 * @param data UserProfileRequest
 */
export const updateUserInfoAPI = (data: UpdatesUserInfoRequest) => http.put('/wx/edit', data);

/**
 * 志愿者审核信息
 */
export type ApplyVolunteerRequest = Omit<
	ApplyReview,
	'institutionName' | 'legalPerson' | 'legalPersonPhone' | 'orgCode' | 'orgCodeCertUrl'
>;

/**
 * 机构审核信息
 */
export type ApplyInstitutionRequest = ApplyReview;

/** 提交实名认证申请 */
export const submitApplyReviewAPI = (data: ApplyReview) => http.post('/volunteer/review/add', data);

/** 岗位列表请求参数 */
export interface ApplyHistoryRequest {
	status?: ReviewStatus;
	pageNum?: number;
	pageSize?: number;
}

/**
 * 获取申请历史记录列表
 * @param params 可选的 status 过滤
 */
export const getApplyHistoryListAPI = (params: ApplyHistoryRequest) =>
	http.get<PageRes<ApplyHistoryItem>>('/volunteer/review/userList', params);

/**
 * 获取服务方公开主页合规脱敏资料
 * @param userId 目标服务方的用户ID
 */
export const getProviderProfileAPI = (userId: number): Promise<ServiceProviderProfile> => {
	return http.get(`/demand/web/user/${userId}`);
};

/** 更新服务方履历请求体 */
export interface UpdateProviderResumeRequest {
	/** 志愿者/机构履历信息 */
	resume: string;
}

/**
 * 更新服务方履历信息
 * @param data 包含 resume 字段的对象
 */
export const updateProviderResumeAPI = (data: UpdateProviderResumeRequest) => http.put('/demand/web/user/edit', data);

/**
 * 获取服务方历史服务单简易列表
 * @param params 分页与目标用户ID
 */
export const getProviderOrderListAPI = (params?: ProviderOrderListParams) =>
	http.get<PageRes<ProviderOrderItem>>('/demand/web/user/orderList', params);
