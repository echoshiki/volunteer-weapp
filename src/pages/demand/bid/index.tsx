import { useRouter } from '@tarojs/taro';
import { Page } from '@/components/ui';
import { useDemandBid } from '@/hooks/useDemand';
import { BidForm } from '@/components/biz';

export default function DemandBidPage() {
	const { params } = useRouter();
	const demandId = Number(params.id);
	const isFree = params.charge === 'true';
	const { mutate: submitBid, isLoading } = useDemandBid();

	return (
		<Page className="pb-24">
			<BidForm
				isFree={isFree}
				isSubmitting={isLoading}
				onSubmit={(data) => {
					submitBid({ ...data, demandId });
				}}
			/>
		</Page>
	);
}
