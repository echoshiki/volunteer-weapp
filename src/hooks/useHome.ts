import { useQuery } from '@tanstack/react-query';
import { getHomeDashboardAPI } from '@/services/home';

export const useHomeDashboard = () => {
	return useQuery({
		queryKey: ['homeDashboard'],
		queryFn: getHomeDashboardAPI,
		staleTime: 5 * 60 * 1000,
	});
};
