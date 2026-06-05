import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Page, Loading } from '@/components/ui';
import { useUpdateBid } from '@/hooks/useDemand';
import { MyBidItem } from '@/types/demand';
import { BidForm } from '@/components/biz';

export default function BidEditPage() {
	const { mutate: updateBid, isLoading } = useUpdateBid();
	const [initialData, setInitialData] = useState<MyBidItem | null>(null);

	useEffect(() => {
		const cacheData = Taro.getStorageSync('temp_edit_bid_data') as MyBidItem;
		if (cacheData) {
			setInitialData(cacheData);
			Taro.removeStorageSync('temp_edit_bid_data');
		}
	}, []);

	if (!initialData) return <Loading />;

	return (
		<Page className="pb-24">
			<BidForm
				initialData={initialData}
				isFree={initialData.money === 0}
				submitText="保存修改方案"
				isSubmitting={isLoading}
				onSubmit={(data) => {
					updateBid({
						id: initialData.id,
						...data,
					});
				}}
			/>
		</Page>
	);
}
