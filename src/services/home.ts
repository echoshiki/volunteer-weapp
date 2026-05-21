import { http } from '@/utils/http';
import { DashboradData } from '@/types/home';

/**
 * 获取首页聚合看板数据 (Banners、统计等)
 */
export const getHomeDashboardAPI = () => {
	return http.get<DashboradData>('/volunteer/index/web');
};
