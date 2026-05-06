import { http } from '@/utils/http';
import { UserInfo } from '@/types/user';

/**
 * 获取用户信息接口
 */
export const getUserInfoAPI = () => http.get<UserInfo>('/wx/getInfo');
