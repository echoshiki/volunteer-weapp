import { View, Text, Image } from '@tarojs/components';
import { UnifiedOrderItem, OrderStatus } from '@/types/order';
import { Button, Divider } from '@/components/ui';
import { UserIdentityBadge } from '../BizBadge';
import { Badge } from '@/components/ui';
import Taro from '@tarojs/taro';

// 状态印章对齐你新定的状态机
const OrderStatusBadge = ({ value }: { value: OrderStatus }) => {
	const config: Record<
		OrderStatus,
		{
			label: string;
			variant: 'danger' | 'warning' | 'primary' | 'info' | 'success' | 'secondary';
		}
	> = {
		pending: { label: '待支付', variant: 'danger' },
		serving: { label: '待服务', variant: 'warning' },
		confirming: { label: '待您确认完工', variant: 'info' }, // 雇主视角提示
		reviewing: { label: '待评价', variant: 'primary' },
		completed: { label: '已完成', variant: 'success' },
		refunding: { label: '退款中', variant: 'danger' },
		cancelled: { label: '已取消', variant: 'secondary' },
	};
	return (
		<Badge variant={config[value]?.variant || 'secondary'} size="sm">
			{config[value]?.label || '未知'}
		</Badge>
	);
};

export interface OrderRecordCardProps {
	record: UnifiedOrderItem;
	/** 呈现视角：'employer' 代表需求方看，'provider' 代表服务方看 */
	viewMode: 'employer' | 'provider';
	onClick?: (id: string) => void;
	/** 统一动作分发，方便外层挂载业务行为 */
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
	const targetAvatar = isEmployer ? record.avatar : ''; // 雇主通常不带头像，用兜底图

	return (
		<View
			className={`flex flex-col bg-white p-4 ${className}`}
			onClick={() => onClick?.(record.orderId)}
		>
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
						<Image
							src={targetAvatar || 'https://placeholder.com/50'}
							className="size-8 rounded-full bg-gray-200"
						/>
						<View className="flex flex-col">
							<Text className="text-xs font-medium text-text-title">
								{isEmployer ? `服务方: ${targetName}` : `雇主: ${targetName}`}
							</Text>
							{isEmployer && (
								<View className="scale-75 origin-left -mt-0.5">
									<UserIdentityBadge value={record.identity} />
								</View>
							)}
						</View>
					</View>

					{/* 快捷拨打电话 */}
					<View
						className="icon-[ph--phone-call] size-5 text-primary active:opacity-60 p-1"
						onClick={(e) => {
							e.stopPropagation();
							Taro.makePhoneCall({ phoneNumber: targetPhone });
						}}
					/>
				</View>
			</View>

			{/* 价格与属性摘要 */}
			<View className="flex justify-between items-center text-xs text-text-muted mb-1 font-num">
				<View className="flex items-center gap-1.5">
					<Text className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">
						{record.payType === 'online' ? '线上支付' : '线下结算'}
					</Text>
					{record.charge && (
						<Text className="bg-green-50 text-green-600 px-1.5 py-0.5 rounded text-[10px]">
							公益单
						</Text>
					)}
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

// 💡 内部抽取动作控制栏，将复杂的业务按钮高内聚分离
const OrderCardActions = ({
	record,
	viewMode,
	onAction,
}: Omit<OrderRecordCardProps, 'className' | 'onClick'>) => {
	const isEmployer = viewMode === 'employer';

	// 1. 需求方（雇主）动作树
	if (isEmployer) {
		if (record.status === 'pending') {
			return (
				<>
					<Divider className="my-2" />
					<View className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onAction?.('cancel', record)}
						>
							取消订单
						</Button>
						<Button
							variant="danger"
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

	// 2. 服务方（志愿者/机构）动作树
	if (!isEmployer) {
		if (record.status === 'serving') {
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
