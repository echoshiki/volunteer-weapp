import { useRouter } from '@tarojs/taro';
import { Page, Loading, Empty } from '@/components/ui';
import { useEditDemand, useDemandDetail } from '@/hooks/useDemand';
import { PublishDemandRequest } from '@/services/demand';
import { DemandForm } from '@/components/biz';

export default function EditDemandPage() {
	const { params } = useRouter();
	const id = Number(params.id);

	const { data: demandDetail, isLoading: isDetailLoading } = useDemandDetail(id);
	const { mutate: editDemand, isLoading } = useEditDemand();

	const handleSubmit = (data: PublishDemandRequest) => editDemand({ ...data, demandId: id });

	if (isDetailLoading) return <Loading />;
	if (!demandDetail) return <Empty title="未找到该需求单信息" />;

	return (
		<Page hasTabBar>
			<DemandForm
				initialData={demandDetail}
				submitText="保存修改"
				isSubmitting={isLoading}
				onSubmit={handleSubmit}
			/>
		</Page>
	);
}
