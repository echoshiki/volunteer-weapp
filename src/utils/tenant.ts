import Taro from '@tarojs/taro';
import { mapsTo, serializeParams } from './common';

// 统一管理 Storage Key，防止拼写错误
const TENANT_KEY = 'global_tenant_id';
const TENANT_NAME_KEY = 'global_tenant_name';

/**
 * 获取当前选中的租户 ID
 */
export const getTenantId = (): string => {
	return Taro.getStorageSync(TENANT_KEY) || '';
};

/**
 * 获取当前选中的租户名称 (用于在首页顶部直接展示，避免每次重刷)
 */
export const getTenantName = (): string => {
	return Taro.getStorageSync(TENANT_NAME_KEY) || '';
};

/**
 * 设置/切换 租户信息
 * @param id 租户/街道/协会 ID
 * @param name 租户/街道/协会 名称
 */
export const setTenant = (id: string | number, name: string) => {
	Taro.setStorageSync(TENANT_KEY, id);
	Taro.setStorageSync(TENANT_NAME_KEY, name);
};

/**
 * 清除租户信息 (通常用于极特殊情况的重置)
 */
export const clearTenant = () => {
	Taro.removeStorageSync(TENANT_KEY);
	Taro.removeStorageSync(TENANT_NAME_KEY);
};

/**
 * 判断是否已经选择了租户
 */
export const hasTenant = (): boolean => {
	return !!getTenantId();
};

/**
 * 启动时的租户守卫
 * 逻辑：未选择过街道的用户，会被强制重定向到引导页，并携带最初的目标地址
 * @param options useLaunch 获取到的启动参数
 */
export const guardUnselectedTenant = (options: Taro.getLaunchOptionsSync.LaunchOptions) => {
	const tenantId = getTenantId();

	// 已经选过街道，直接放行
	if (tenantId) return;

	const { path, query } = options;
	const targetPath = path.startsWith('/') ? path : `/${path}`;

	// 如果用户本来就是要去引导页，或者没有目标路径，直接返回
	if (targetPath.includes('pages/onboarding/index')) return;

	// 借助 common 中的 serializeParams 组装完整的原生路径
	const queryString = serializeParams(query);
	const targetUrl = `${targetPath}${queryString}`;

	// 带着目标页路径参数
	mapsTo(`/pages/onboarding/index?redirect=${encodeURIComponent(targetUrl)}`, 'reLaunch');
};
