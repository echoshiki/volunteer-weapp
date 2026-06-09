/** 轮播图结构 */
export interface Banner {
	id: number;
	pic: string;
	url?: string;
}

/** 社区概览统计数据 */
export interface HomeStatistics {
	volunteerCount: number;
	totalDuration: number;
	resolvedDemands: number;
	associationName: string;
	associationId: number;
}

/** 首页聚合数据 */
export interface DashboradData {
	banners: Banner[];
	statistics: HomeStatistics;
	/** 预留滚动社区公告 */
	notices?: string[];
}
