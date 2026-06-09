import { useQuery } from '@tanstack/react-query';
import { getHomeDashboardAPI } from '@/services/home';
import { enabledWithTenant, tenantKey } from '@/utils/tenant';

export const useHomeDashboard = () => {
	return useQuery({
		queryKey: [...tenantKey(), 'homeDashboard'],
		queryFn: getHomeDashboardAPI,
		staleTime: 5 * 60 * 1000,
		enabled: enabledWithTenant(),
	});
};
