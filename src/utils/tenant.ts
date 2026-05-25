import Taro from '@tarojs/taro';

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
export const setTenant = (id: string, name: string) => {
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
