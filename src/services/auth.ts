import { http } from '@/utils/http';
import { UserInfo } from '@/types/user';

/**
 * 登录响应对象
 * @param isWxCode 是否已注册 (true:直接登录, false:需绑定手机号)
 * @param token 用户正式 token (isWxCode 为 true 时返回)
 * @param uuid 用户临时登录凭证 (isWxCode 为 false 时返回，存入 Redis)
 * @param userInfo 用户详细信息
 */
export interface AuthLoginRes {
	isWxCode?: boolean;
	token?: string;
	uuid?: string;
}

/**
 * 微信静默登陆接口 (预检)
 * @param code wx.login 获取的微信 code
 */
export const loginAPI = (code: string) => http.post<AuthLoginRes>(`/wx/isWxCode?code=${code}`);

/**
 * 微信绑定手机号请求参数
 * @param code 微信 getPhoneNumber 获取的手机号 code (code2)
 * @param uuid 第一步获取的临时凭证 (authKey)
 */
export interface BindPhoneParams {
	code: string;
	uuid: string;
}

/**
 * 绑定手机号响应对象
 * @param token 用户 token
 * @param userInfo 用户信息
 */
export interface BindPhoneRes {
	token?: string;
}

/**
 * 绑定手机号接口 (正式注册/登录)
 * @param data 包含 uuid 和手机号凭证的对象
 */
export const bindPhoneAPI = (data: BindPhoneParams) => http.post<BindPhoneRes>(`/wx/login`, data);

/**
 * 用户登出
 */
export const logoutAPI = () => http.get('/logout');
