import { http } from '@/utils/http';
import { TenantItem, RegionItem, ListRes, PageRes } from '@/types/common';

export const getProvinceListAPI = () => {
	return http.get<PageRes<RegionItem>>('/volunteer/region/web/provinceList', {
		pageNum: 1,
		pageSize: 100,
	});
};

export const getCityListAPI = (parentCode: number) => {
	return http.get<PageRes<RegionItem>>('/volunteer/region/web/cityList', {
		parentCode,
		pageNum: 1,
		pageSize: 100,
	});
};

export const getDistrictListAPI = (parentCode: number) => {
	return http.get<PageRes<RegionItem>>('/volunteer/region/web/districtLIst', {
		parentCode,
		pageNum: 1,
		pageSize: 100,
	});
};

/** 根据行政区代码获取自定义街道/租户列表 */
export const getTenantListAPI = (areaCode: string | number) => {
	return http.get<ListRes<TenantItem>>('/volunteer/tenant/web/tenantList', { areaCode });
};
