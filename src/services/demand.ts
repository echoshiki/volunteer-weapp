import { http } from '@/utils/http';
import { ListRes, PageRes } from '@/types/common';
import { DemandCategory, DemandTag, DemandItem, DemandDetail, ServiceUser } from '@/types/demand';

/** 获取需求分类列表 */
export const getDemandCategoryListAPI = () =>
	http.get<ListRes<DemandCategory>>('/demand/target/web/targetList');

/** 获取需求标签列表 */
export const getDemandTagListAPI = (params?: { categoryUserId?: number | string }) =>
	http.get<ListRes<DemandTag>>('/demand/tag/web/tagList', params);

/** 需求单列表请求参数 */
export interface GetDemandListRequest {
	/** 搜索关键词 */
	keyword?: string;
	/** 分类 ID */
	categoryId?: number;
	/** 是否收费 */
	charge?: string;
	/** 标签 ID */
	tagIds?: number[];
	/** 是否推荐 */
	isRecommend?: boolean;
	pageNum: number;
	pageSize: number;
}

/** 获取需求单列表 */
export const getDemandListAPI = (params: GetDemandListRequest) =>
	http.get<PageRes<DemandItem>>('/demand/web/demandList', params);

/** 获取需求订单详情 */
export const getDemandDetailAPI = (demandId: number) =>
	http.get<DemandDetail>(`/demand/web/${demandId}`);

/** 需求单抢单用户列表请求参数 */
interface GetServiceUserListParams {
	demandId: number | string;
	pageNum: number;
	pageSize: number;
}

/** 获取需求单抢单用户列表 */
export const getServiceUserListAPI = (params: GetServiceUserListParams) =>
	http.get<PageRes<ServiceUser>>('/demand/web/serviceUser', params);

/** 我发布的需求单列表请求参数 */
export interface GetUserDemandListRequest {
	pageNum: number;
	pageSize: number;
}

/** 获取我发布的需求单列表 */
export const getUserDemandListAPI = (params: GetUserDemandListRequest) =>
	http.get<PageRes<DemandItem>>('/demand/web/demandUserList', params);

/** 发布/编辑需求单的入参 */
export interface PublishDemandRequest {
	demandName: string;
	categoryId: number;
	tagIds: number[];
	content: string;
	provinceCode: number;
	cityCode: number;
	districtCode: number;
	tenantId: number;
	address: string;
	name: string;
	phone: string;
	emergencyCall: string;
	minMoney: number;
	maxMoney: number;
	charge: boolean;
	isRecommend?: boolean;
}

/**
 * 发布需求订单
 */
export const publishDemandAPI = (data: PublishDemandRequest) => {
	return http.post('/demand/web/add', data);
};
