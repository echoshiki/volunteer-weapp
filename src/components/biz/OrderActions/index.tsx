import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Button } from '@/components/ui';
import { UnifiedOrderItem } from '@/types/order';
import { useOrderActions } from '@/hooks/useOrder';
import { mapsTo } from '@/utils/common';

interface OrderActionProps {
	order: UnifiedOrderItem;
}

/** 需求方专用的履约动作树 */
export const EmployerActions = ({ order }: OrderActionProps) => {
	const { updateStatus, runWechatPay, isActionLoading } = useOrderActions(order);
	console.log('OrderStatus', order.status);

	if (order.status === 'pending') {
		return (
			<>
				<Button
					variant="ghost"
					size="sm"
					onClick={() =>
						updateStatus.mutate({ orderId: order.orderId, status: 'cancelled' })
					}
				>
					取消订单
				</Button>
				<Button
					variant="danger"
					size="md"
					className="px-6 shadow-sm shadow-red-200"
					loading={isActionLoading}
					onClick={() => runWechatPay.mutate()}
				>
					立即支付
				</Button>
			</>
		);
	}

	if (order.status === 'confirming') {
		return (
			<Button
				variant="success"
				size="md"
				className="w-full shadow-sm shadow-emerald-200"
				loading={updateStatus.isLoading}
				onClick={() => updateStatus.mutate({ orderId: order.orderId, status: 'reviewing' })}
			>
				确认验收
			</Button>
		);
	}

	if (order.status === 'reviewing') {
		return (
			<Button
				variant="primary"
				size="md"
				className="w-full shadow-sm shadow-blue-200"
				onClick={() => mapsTo(`/pages/order/comment/index?id=${order.orderId}`)}
			>
				评价服务
			</Button>
		);
	}

	return null;
};

/** 接单服务方（志愿者/机构）专用的履约提示树 */
export const ProviderActions = ({ order }: Omit<OrderActionProps, 'orderId'>) => {
	console.log('OrderStatus II', order.status);
	if (order.status === 'paid' || order.status === 'serving') {
		return (
			<View className="text-sm text-center w-full text-orange-500 font-medium py-2 flex items-center justify-center gap-1">
				<View className="icon-[ph--info-bold] size-4" />
				请在上方上传实地照片以推进服务流程
			</View>
		);
	}

	if (order.status === 'confirming') {
		return (
			<View className="text-sm text-center w-full text-text-muted italic py-2">
				已向雇主发起完工申请，等待对方验收中...
			</View>
		);
	}

	return null;
};
