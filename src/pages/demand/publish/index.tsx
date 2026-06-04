import { Page } from '@/components/ui';
import { usePublishDemand } from '@/hooks/useDemand';
import { DemandForm } from '@/components/biz';

export default function PublishDemandPage() {
	const { mutate: publishDemand, isLoading } = usePublishDemand();
	return (
		<Page hasTabBar>
			<DemandForm isSubmitting={isLoading} onSubmit={publishDemand} />
		</Page>
	);
}
