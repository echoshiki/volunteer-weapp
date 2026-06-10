import Taro from '@tarojs/taro';
import { mapsTo, serializeParams } from './common';

// 统一管理 Storage Key
const TENANT_KEY = 'tenant_id';
const TENANT_NAME_KEY = 'tenant_name';
const ACTIVE_PROVINCE_KEY = 'active_province_code';
const ACTIVE_CITY_KEY = 'active_city_code';
const ACTIVE_DISTRICT_KEY = 'active_district_code';

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
 * 获取本地缓存中的省市区强数字编码
 */
export const getActiveRegionCodes = () => {
	return {
		provinceCode: Taro.getStorageSync(ACTIVE_PROVINCE_KEY)
			? Number(Taro.getStorageSync(ACTIVE_PROVINCE_KEY))
			: undefined,
		cityCode: Taro.getStorageSync(ACTIVE_CITY_KEY)
			? Number(Taro.getStorageSync(ACTIVE_CITY_KEY))
			: undefined,
		districtCode: Taro.getStorageSync(ACTIVE_DISTRICT_KEY)
			? Number(Taro.getStorageSync(ACTIVE_DISTRICT_KEY))
			: undefined,
	};
};

/**
 * 设置/切换 租户信息
 * @param id 租户/街道/协会 ID
 * @param name 租户/街道/协会 名称
 * @param provinceCode 省市区 强数字编码
 * @param cityCode 省市区 强数字编码
 * @param districtCode 省市区 强数字编码
 */
export const setTenant = (
	id: string | number,
	name: string,
	provinceCode?: string | number,
	cityCode?: string | number,
	districtCode?: string | number,
) => {
	Taro.setStorageSync(TENANT_KEY, id);
	Taro.setStorageSync(TENANT_NAME_KEY, name);
	if (provinceCode) Taro.setStorageSync(ACTIVE_PROVINCE_KEY, Number(provinceCode));
	if (cityCode) Taro.setStorageSync(ACTIVE_CITY_KEY, Number(cityCode));
	if (districtCode) Taro.setStorageSync(ACTIVE_DISTRICT_KEY, Number(districtCode));
};

/**
 * 清除租户信息
 */
export const clearTenant = () => {
	Taro.removeStorageSync(TENANT_KEY);
	Taro.removeStorageSync(TENANT_NAME_KEY);
	Taro.removeStorageSync(ACTIVE_PROVINCE_KEY);
	Taro.removeStorageSync(ACTIVE_CITY_KEY);
	Taro.removeStorageSync(ACTIVE_DISTRICT_KEY);
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

/**
 * 带 tenant 隔离的 queryKey 前缀
 * 用于所有需要按街道隔离数据的 React Query key
 */
export const tenantKey = () => ['tenant', getTenantId()];

/**
 * 需要 tenant 才能发起查询的 enabled 守卫
 * @param extraCondition 额外的启用条件，默认 true
 */
export const enabledWithTenant = (extraCondition = true): boolean => hasTenant() && extraCondition;
