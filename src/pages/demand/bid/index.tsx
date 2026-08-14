import { useRouter } from '@tarojs/taro';
import { Page } from '@/components/ui';
import { useDemandBid } from '@/hooks/useDemand';
import { BidForm } from '@/components/biz';
import { useConfigStore } from '@/store/config';
import { BidDemandRequest } from '@/services/demand';
import { requestNotification } from '@/utils/notification';

export default function DemandBidPage() {
	const { params } = useRouter();
	const demandId = Number(params.id);
	const { config } = useConfigStore();
	const { mutate: submitBid, isLoading } = useDemandBid();

	const handleSubmit = async (data: BidDemandRequest) => {
		try {
			const ids: string[] = [];
			// 选中通知 & 变更通知
			if (config.templateIds?.demandSelected) ids.push(config.templateIds.demandSelected);
			if (config.templateIds?.demandChange) ids.push(config.templateIds.demandChange);

			// 发起订阅请求
			if (ids.length > 0) await requestNotification(ids);
		} catch (error) {
			console.error('订阅消息触发失败', error);
		}
		submitBid({ ...data, demandId });
	};

	const isFree = params.charge === 'true';

	return (
		<Page className="pb-24">
			<BidForm isFree={isFree} isSubmitting={isLoading} onSubmit={handleSubmit} />
		</Page>
	);
}
