import { http } from '@/utils/http';
import { ListRes, PageRes, ApprovalStatus } from '@/types/common';
import {
	DemandTarget,
	DemandTag,
	DemandItem,
	DemandDetail,
	ServiceUser,
	ServiceScope,
	DemandStatus,
} from '@/types/demand';

/** 获取需求服务对象分类列表（不分页） */
export const getDemandTargetListAPI = () =>
	http.get<ListRes<DemandTarget>>('/demand/target/web/targetList');

/** 获取需求标签列表（不分页，可根据服务对象ID过滤） */
export const getDemandTagListAPI = (params?: { categoryUserId?: number | string }) =>
	http.get<ListRes<DemandTag>>('/demand/tag/web/tagList', params);

/** 需求订单列表请求参数 */
export interface DemandListParams {
	orderName?: string;
	categoryUserId?: number | string;
	/** 是否集体服务 */
	serviceScope?: ServiceScope;
	/** 是否收费 */
	charge?: string;
	demandId?: number | string;
	status?: ApprovalStatus;
	/** 需求订单状态 */
	acceptStatus?: DemandStatus;
	/** 是否推荐 */
	isRecommend?: boolean;
	pageNum: number;
	pageSize: number;
}

/** 获取需求订单列表（分页）注意后端路径是 orderList */
export const getDemandListAPI = (params: DemandListParams) =>
	http.get<PageRes<DemandItem>>('/demand/order/web/orderList', params);

/** 获取需求订单详情 */
export const getDemandDetailAPI = (demandId: number | string) =>
	http.get<DemandDetail>(`/demand/order/web/${demandId}`);

interface GetServiceUserListParams {
	orderId: number | string;
	pageNum: number;
	pageSize: number;
}

/** 获取需求订单抢单用户列表（分页） */
export const getServiceUserListAPI = (params: GetServiceUserListParams) =>
	http.get<PageRes<ServiceUser>>('/demand/order/web/serviceUser', params);
