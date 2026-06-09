import { http } from '@/utils/http';
import { PageRes } from '@/types/common';
import { AssociationItem } from '@/types/association';

export interface AssociationListRequest {
	pageNum: number;
	pageSize: number;
	provinceCode?: number;
	cityCode?: number;
	districtCode?: number;
}

/**
 * 获取全域志愿者协会列表
 */
export const getAssociationListAPI = (params: AssociationListRequest) => {
	return http.get<PageRes<AssociationItem>>('/volunteer/association/web/list', params);
};
