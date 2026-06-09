import { http } from '@/utils/http';
import { TenantItem, ListRes } from '@/types/common';

/**
 * 根据行政区代码获取自定义街道/租户列表
 * @param areaCode 区域 code，如 110100
 */
export const getTenantListApi = (areaCode: string | number) => {
	return http.get<ListRes<TenantItem>>('/volunteer/tenant/web/tenantList', { areaCode });
};
