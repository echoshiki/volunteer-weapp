import { http } from '@/utils/http';
import { ListRes, PageRes } from '@/types/common';
import {
	DemandTarget,
	DemandTag,
	DemandOrder,
	DemandOrderDetail,
	ServiceUser,
	ServiceScope,
	DemandOrderStatus,
} from '@/types/demand';
import { ApprovalStatus } from '@/types/common';

/** 获取需求服务对象分类列表（不分页） */
export const getDemandTargetListAPI = () =>
	http.get<ListRes<DemandTarget>>('/demand/target/web/targetList');

/** 获取需求标签列表（不分页，可根据服务对象ID过滤） */
export const getDemandTagListAPI = (params?: { categoryUserId?: number | string }) =>
	http.get<ListRes<DemandTag>>('/demand/tag/web/tagList', params);

/** 需求订单列表请求参数 */
export interface DemandOrderListParams {
	oderName?: string;
	categoryUserId?: number | string;
	/** 是否集体服务 */
	serviceScope?: ServiceScope;
	/** 是否收费 */
	charge?: string;
	demandId?: number | string;
	status?: ApprovalStatus;
	/** 需求订单状态 {@link DemandOrderStatus} */
	acceptStatus?: DemandOrderStatus;
	pageNum: number;
	pageSize: number;
}

/** 获取需求订单列表（分页）注意后端路径是 oderList */
export const getDemandOrderListAPI = (params: DemandOrderListParams) =>
	http.get<PageRes<DemandOrder>>('/demand/oder/web/oderList', params);

/** 获取需求订单详情 */
export const getDemandOrderDetailAPI = (oderId: number | string) =>
	http.get<DemandOrderDetail>(`/demand/oder/web/${oderId}`);

interface GetServiceUserListParams {
	oderId: number | string;
	pageNum: number;
	pageSize: number;
}

/** 获取需求订单抢单用户列表（分页） */
export const getServiceUserListAPI = (params: GetServiceUserListParams) =>
	http.get<PageRes<ServiceUser>>('/demand/oder/web/serviceUser', params);
