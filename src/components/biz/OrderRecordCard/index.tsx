import { View, Text, Image } from '@tarojs/components';
import { UnifiedOrderItem } from '@/types/order';
import { Badge, Button, Divider } from '@/components/ui';
import { OrderStatusBadge, UserIdentityBadge } from '../BizBadge';
import Taro from '@tarojs/taro';

export interface OrderRecordCardProps {
	record: UnifiedOrderItem;
	/** 呈现视角：'employer' 代表需求方看，'provider' 代表服务方看 */
	viewMode: 'employer' | 'provider';
	onClick?: (id: string) => void;
	onAction?: (
		actionType: 'pay' | 'cancel' | 'confirm' | 'comment',
		item: UnifiedOrderItem,
	) => void;
	className?: string;
}

export const OrderRecordCard = ({
	record,
	viewMode,
	onClick,
	onAction,
	className = '',
}: OrderRecordCardProps) => {
	const isEmployer = viewMode === 'employer';

	// 动态决定渲染对方的联系人资料
	const targetName = isEmployer ? record.name : record.employerName;
	const targetPhone = isEmployer ? record.phone : record.employerPhone;
	const targetAvatar = isEmployer ? record.avatar : '';

	return (
		<View className={`flex flex-col ${className}`} onClick={() => onClick?.(record.orderId)}>
			{/* 头部：单号与状态 */}
			<View className="flex justify-between items-center mb-3 font-num">
				<Text className="text-xs text-text-muted">订单号：{record.orderId}</Text>
				<OrderStatusBadge value={record.status} />
			</View>

			{/* 中部：服务基本信息与对方的名片 */}
			<View className="bg-gray-50 rounded-lg p-3 mb-3 flex flex-col gap-2">
				<Text className="text-sm font-bold text-text-title line-clamp-1">
					{record.orderName}
				</Text>

				{/* 差异化地址渲染 */}
				<View className="text-xs text-text-muted flex items-start gap-1">
					<View className="icon-[ph--map-pin] size-3.5 shrink-0 mt-0.5" />
					<Text className="line-clamp-1">服务地址：{record.address}</Text>
				</View>

				{/* 关联方卡片 */}
				<View className="flex justify-between items-center mt-1 pt-2 border-t border-gray-100/60">
					<View className="flex items-center gap-2">
						{isEmployer && (
							<Image
								src={targetAvatar}
								className="size-10 rounded-full bg-gray-200"
							/>
						)}

						<View className="flex flex-col gap-1">
							<Text className="text-xs text-text-title">
								{isEmployer ? `服务方: ${targetName}` : `雇主: ${targetName}`}
							</Text>
							{isEmployer && (
								<UserIdentityBadge className="scale-90" value={record.identity} />
							)}
						</View>
					</View>

					{/* 快捷拨打电话 */}
					<View
						className="flex items-center gap-1 text-primary font-medium text-xs"
						onClick={(e) => {
							e.stopPropagation();
							Taro.makePhoneCall({ phoneNumber: targetPhone });
						}}
					>
						<View className="icon-[ph--phone-call] size-4" />
						{targetPhone}
					</View>
				</View>
			</View>

			{/* 价格与属性摘要 */}
			<View className="flex justify-between items-center text-xs text-text-muted mb-1 font-num">
				<View className="flex items-center gap-1.5">
					<Text className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
						{record.payType === 'online' ? '线上支付' : '线下结算'}
					</Text>
					{record.charge && <Badge variant="success">公益单</Badge>}
				</View>
				<Text className="text-text-title">
					合计:{' '}
					<Text className="text-orange-500 font-bold text-base">
						¥{record.orderTotal}
					</Text>
				</Text>
			</View>
			{/* 底部动作按钮配置驱动 */}
			<OrderCardActions record={record} viewMode={viewMode} onAction={onAction} />
		</View>
	);
};

const OrderCardActions = ({
	record,
	viewMode,
	onAction,
}: Omit<OrderRecordCardProps, 'className' | 'onClick'>) => {
	const isEmployer = viewMode === 'employer';

	// 需求方（雇主）动作树
	if (isEmployer) {
		if (record.status === 'pending') {
			return (
				<>
					<Divider className="my-2" />
					<View
						className="w-full flex justify-end gap-2"
						onClick={(e) => e.stopPropagation()}
					>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onAction?.('cancel', record)}
						>
							取消订单
						</Button>
						<Button
							variant="danger"
							className="w-56"
							size="sm"
							onClick={() => onAction?.('pay', record)}
						>
							立即付款
						</Button>
					</View>
				</>
			);
		}
		if (record.status === 'confirming') {
			return (
				<>
					<Divider className="my-2" />
					<View className="flex justify-end" onClick={(e) => e.stopPropagation()}>
						<Button
							variant="success"
							size="sm"
							onClick={() => onAction?.('confirm', record)}
						>
							确认完工验收
						</Button>
					</View>
				</>
			);
		}
		if (record.status === 'reviewing') {
			return (
				<>
					<Divider className="my-2" />
					<View className="flex justify-end" onClick={(e) => e.stopPropagation()}>
						<Button
							variant="primary"
							size="sm"
							onClick={() => onAction?.('comment', record)}
						>
							去评价
						</Button>
					</View>
				</>
			);
		}
	}

	// 服务方（志愿者/机构）动作树
	if (!isEmployer) {
		if (record.status === 'paid') {
			return (
				<>
					<Divider className="my-2" />
					<View className="flex justify-end text-xs text-text-muted italic">
						请尽快线下联系雇主上门服务...
					</View>
				</>
			);
		}
		if (record.status === 'confirming') {
			return (
				<>
					<Divider className="my-2" />
					<View className="flex justify-end text-xs text-orange-500 font-medium">
						已提交完工，等待雇主验收结算...
					</View>
				</>
			);
		}
	}

	return null;
};
