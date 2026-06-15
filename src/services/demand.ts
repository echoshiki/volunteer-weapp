import { http } from '@/utils/http';
import { ListRes, PageRes } from '@/types/common';
import { DemandCategory, DemandTag, DemandItem, DemandDetail, DemandBidItem, MyBidItem } from '@/types/demand';

/** 获取需求分类列表 */
export const getDemandCategoryListAPI = () => http.get<ListRes<DemandCategory>>('/demand/target/web/targetList');

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
	tagIds?: string;
	/** 是否推荐 */
	isRecommend?: boolean;
	pageNum: number;
	pageSize: number;
}

/** 获取需求单列表 */
export const getDemandListAPI = (params: GetDemandListRequest) =>
	http.get<PageRes<DemandItem>>('/demand/web/demandList', params);

/** 获取需求单详情 */
export const getDemandDetailAPI = (demandId: number) => http.get<DemandDetail>(`/demand/web/${demandId}`);

/** 需求单抢单用户列表请求参数 */
interface GetDemandBidListParams {
	demandId: number | string;
	pageNum: number;
	pageSize: number;
}

/** 获取需求单的报价列表 */
export const getDemandBidListAPI = (params: GetDemandBidListParams) =>
	http.get<PageRes<DemandBidItem>>('/demand/web/serviceUser', params);

/** 我发布的需求单列表请求参数 */
export interface GetUserDemandListRequest {
	tagsId?: string;
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
 * 发布需求单
 */
export const publishDemandAPI = (data: PublishDemandRequest) => {
	return http.post('/demand/web/add', data);
};

export interface UpdateDemandRequest extends PublishDemandRequest {
	demandId: number;
}

/**
 * 编辑需求单
 */
export const updateDemandAPI = (data: UpdateDemandRequest) => {
	return http.put('/demand/web/update', data);
};

/**
 * 删除需求单
 */
export const deleteDemandAPI = (demandId: number) => http.delete<void>(`/demand/web/${demandId}`);

export interface BidDemandRequest {
	demandId: number;
	description: string;
	money: number;
	name: string;
	phone: string;
}

/** 服务方：参与抢单/提交报价 */
export const bidDemandAPI = (data: BidDemandRequest) => {
	return http.post('/demand/web/addOrderUser', data);
};

/** 服务方：获取我发布的报价单/抢单记录列表 */
export const getMyBidsAPI = (params: { pageNum: number; pageSize: number }) => {
	return http.get<PageRes<MyBidItem>>('/demand/web/orderUserList', params);
};

/** 修改报价单的请求入参 */
export interface UpdateBidRequest {
	id: number;
	money: number;
	description: string;
	name: string;
	phone: string;
}

export const updateBidAPI = (data: UpdateBidRequest) => {
	return http.put('/demand/web/updateOrderUser', data);
};
