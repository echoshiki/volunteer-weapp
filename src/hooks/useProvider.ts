import { useQuery } from '@tanstack/react-query';
import { getProviderProfileAPI } from '@/services/user';

/**
 * 获取并管理公开服务资料主页数据状态 Hook
 */
export const useProviderProfile = (userId: number) => {
	return useQuery({
		queryKey: ['provider', 'public', 'profile', userId],
		queryFn: () => getProviderProfileAPI(userId),
		enabled: !!userId,
		staleTime: 3 * 60 * 1000,
	});
};
