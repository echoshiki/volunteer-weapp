import { http } from '@/utils/http';
import { UserInfo } from '@/types/user';

/**
 * 登录响应对象
 */
export interface AuthLoginRes {
	/** 是否已注册 (true:直接登录, false:需绑定手机号) */
	isWxCode?: boolean;
	/** 用户 token (isWxCode 为 true 时返回) */
	token?: string;
	/** 用户临时登录凭证 (isWxCode 为 false 时返回，存入 Redis) */
	uuid?: string;
}

/**
 * 微信静默登陆接口 (预检)
 * @param code wx.login 获取的微信 code
 */
export const loginAPI = (code: string) => http.post<AuthLoginRes>(`/wx/isWxCode?code=${code}`);

/**
 * 微信绑定手机号请求参数
 */
export interface BindPhoneParams {
	/** 微信 getPhoneNumber 获取的手机号 code (code2) */
	code: string;
	/** 第一步获取的临时凭证 (authKey) */
	uuid: string;
}

/**
 * 绑定手机号响应对象
 */
export interface BindPhoneRes {
	/** 用户 token 凭证 */
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
