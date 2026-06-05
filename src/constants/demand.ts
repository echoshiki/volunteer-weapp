import { ThemeVariant } from '@/types/common';
import { BidStatus } from '@/types/demand';

export const BID_STATUS_MAP: Record<BidStatus, { label: string; variant: ThemeVariant }> = {
	pending: { label: '待选择', variant: 'primary' },
	selected: { label: '已选中', variant: 'success' },
	unselected: { label: '未选中', variant: 'secondary' },
	invalid: { label: '已失效', variant: 'danger' },
};
