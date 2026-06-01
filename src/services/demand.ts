import { http } from '@/utils/http';
import { ListRes, PageRes } from '@/types/common';
import {
	DemandCategory,
	DemandTag,
	DemandItem,
	DemandDetail,
	ServiceUser,
	DemandStatus,
} from '@/types/demand';

/** 获取需求服务对象分类列表（不分页） */
export const getDemandCategoryListAPI = () =>
	http.get<ListRes<DemandCategory>>('/demand/target/web/targetList');

/** 获取需求标签列表（不分页，可根据服务对象ID过滤） */
export const getDemandTagListAPI = (params?: { categoryUserId?: number | string }) =>
	http.get<ListRes<DemandTag>>('/demand/tag/web/tagList', params);

/** 需求订单列表请求参数 */
export interface DemandListParams {
	/** 搜索关键词 */
	keyword?: string;
	/** 分类 ID */
	categoryId?: number | string;
	/** 是否收费 */
	charge?: string;
	/** 标签 ID */
	tagIds?: number | string;
	/** 需求订单状态 */
	acceptStatus?: DemandStatus;
	pageNum: number;
	pageSize: number;
	/** 是否推荐 */
	isRecommend?: boolean;
}

/** 获取需求订单列表（分页）注意后端路径是 orderList */
export const getDemandListAPI = (params: DemandListParams) =>
	http.get<PageRes<DemandItem>>('/demand/web/demandList', params);

/** 获取需求订单详情 */
export const getDemandDetailAPI = (demandId: number | string) =>
	http.get<DemandDetail>(`/demand/web/${demandId}`);

interface GetServiceUserListParams {
	demandId: number | string;
	pageNum: number;
	pageSize: number;
}

/** 获取需求订单抢单用户列表（分页） */
export const getServiceUserListAPI = (params: GetServiceUserListParams) =>
	http.get<PageRes<ServiceUser>>('/demand/web/serviceUser', params);
