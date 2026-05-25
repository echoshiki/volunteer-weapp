import { useQuery } from '@tanstack/react-query';
import { getHomeDashboardAPI } from '@/services/home';
import { getTenantId } from '@/utils/tenant';

export const useHomeDashboard = () => {
	return useQuery({
		queryKey: ['tenant', getTenantId(), 'homeDashboard'],
		queryFn: getHomeDashboardAPI,
		staleTime: 5 * 60 * 1000,
	});
};
