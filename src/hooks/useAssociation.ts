import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getAssociationListAPI, AssociationListRequest } from '@/services/association';
import { setTenant } from '@/utils/tenant';
import Taro from '@tarojs/taro';
import { mapsTo } from '@/utils/common';

/** Query 全域志愿者协会列表 */
export const useAssociationList = (params: Omit<AssociationListRequest, 'pageNum' | 'pageSize'>) => {
	const query = useInfiniteQuery({
		queryKey: ['association', 'all-list', params],
		queryFn: ({ pageParam = 1 }) =>
			getAssociationListAPI({
				...params,
				pageNum: pageParam,
				pageSize: 10,
			}),
		getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined),
	});
	const list = query.data?.pages.flatMap((page) => page.list || []) ?? [];
	return { ...query, list };
};

/** Mutation 管理入驻/切换大区的行为动作 */
export const useAssociationActions = () => {
	const queryClient = useQueryClient();
	const switchAssociation = (tenantId: number, tenantName: string) => {
		Taro.showModal({
			title: '切换志愿大区',
			content: `是否确认切换并入驻至【${tenantName}】？切换后首页大厅将为您呈现该区域的专属岗位与互助单。`,
			success: (res) => {
				if (res.confirm) {
					setTenant(tenantId.toString(), tenantName);
					Taro.showToast({ title: '入驻成功', icon: 'success' });
					queryClient.invalidateQueries();
					setTimeout(() => mapsTo('/pages/home/index', 'reLaunch'), 1000);
				}
			},
		});
	};

	return { switchAssociation };
};
