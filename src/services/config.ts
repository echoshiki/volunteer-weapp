import { http } from '@/utils/http';
import { WeappConfig } from '@/types/common';

/**
 * 获取系统全局基础配置
 * 无鉴权的公开接口
 */
export const getWeappConfigAPI = () => http.get<WeappConfig>('/volunteer/config/web');
