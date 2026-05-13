// src/hooks/useUser.ts
import { useQuery } from '@tanstack/react-query';
import { getUserInfoAPI } from '@/services/user';
import { useAuthStore } from '@/store/auth';

/**
 * 用户信息状态同步 Hook
 * @description 利用 React Query 的 staleTime 机制进行数据保鲜，并在后台默默同步给 Zustand
 */
export const useUser = () => {
	const { updateUserInfo, authStage } = useAuthStore();
	const isLoggedIn = authStage === 'LOGGED_IN';

	return useQuery({
		queryKey: ['user', 'profile'],
		queryFn: async () => {
			const res = await getUserInfoAPI();
			updateUserInfo(res);
			return res;
		},
		enabled: isLoggedIn,
		staleTime: 1000 * 60 * 5,
	});
};
