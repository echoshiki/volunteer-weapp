import { http } from '@/utils/http';
import { UserInfo } from '@/types/user';

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
	// /** 省行政编码 */
	// provinceName: number;
	// /** 市行政编码 */
	// cityName: number;
	// /** 区行政编码 */
	// districtName: number;
	/** 详细地址 */
	address: string;
}

/**
 * 更新用户个人资料
 * @param data UserProfileRequest
 */
export const updateUserInfoAPI = (data: UpdatesUserInfoRequest) => http.put('/wx/edit', data);
