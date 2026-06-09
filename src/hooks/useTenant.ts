import { getTenantId } from '@/utils/tenant';

export const useTenantId = () => {
	return getTenantId();
};

export const hasTenantId = () => !!getTenantId();
