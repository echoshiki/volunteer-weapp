import { View, Text } from '@tarojs/components';
import { MyBidItem } from '@/types/demand';
import { Button, Description, Divider } from '@/components/ui';
import { BidStatusBadge } from '../BizBadge';
import Taro from '@tarojs/taro';

export interface BidRecordCardProps {
	record: MyBidItem;
	onClickDemand?: (demandId: number) => void;
	onGoToOrder?: (demandId: number) => void;
	onEdit?: (record: MyBidItem) => void;
	className?: string;
}

export const BidRecordCard = ({
	record,
	onClickDemand,
	onGoToOrder,
	onEdit,
	className,
}: BidRecordCardProps) => {
	const canEdit = record.status === 'pending';
	return (
		<View className={`flex flex-col ${className || ''}`}>
			{/* 头部：需求单名称与我的报价状态 */}
			<View
				className="flex justify-between items-center mb-2"
				onClick={() => onClickDemand?.(record.demandId)}
			>
				<Text className="text-text-title font-bold text-base line-clamp-1 flex-1 pr-4">
					{record.demandName}
				</Text>
				<BidStatusBadge value={record.status} />
			</View>

			{/* 详情与我当时提交的报价 */}
			<View
				className="flex flex-col gap-3 mb-3"
				onClick={() => onClickDemand?.(record.demandId)}
			>
				<View className="flex items-center gap-2">
					<Text className="text-xs text-text-muted">
						报价时间：{record.createTime.split(' ')[0]}
					</Text>
				</View>

				{/* 我的报价方案摘要 */}
				<View className="bg-gray-50 rounded p-4 text-text-body flex flex-col gap-2">
					<Description label="我的报价" value={`¥${record.money}`} className="text-xs" />
					<Description label="联系人" value={record.name} className="text-xs" />
					<Description label="联系电话" value={record.phone} className="text-xs" />
				</View>
			</View>

			{record.status === 'selected' && record.employerPhone && (
				<View className="bg-blue-50/50 border border-blue-100 rounded p-3 mb-3 flex justify-between items-center">
					<View className="flex flex-col gap-1">
						<Text className="text-xs text-blue-800 font-medium">
							雇主已选您！请立刻联系对方：
						</Text>
						<Text className="text-sm font-bold text-text-title">
							{record.employerName}（{record.employerPhone}）
						</Text>
					</View>
					<View
						className="icon-[ph--phone-call] size-6 text-primary active:opacity-60"
						onClick={() => Taro.makePhoneCall({ phoneNumber: record.employerPhone! })}
					/>
				</View>
			)}

			<Divider />

			{/* 底部动作组 */}
			<View className="flex justify-between items-center">
				<Text className="text-xs text-text-muted">
					{record.status === 'invalid' && '原因：雇主修改了需求或取消了订单'}
				</Text>

				<View className="flex items-center gap-2">
					{/* 允许修改 */}
					{canEdit && (
						<Button variant="info" size="sm" onClick={() => onEdit?.(record)}>
							修改报价
						</Button>
					)}

					{/* 查看需求详情 */}
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onClickDemand?.(record.demandId)}
					>
						查看原需求
					</Button>

					{/* 如果中标了，引导服务方去查看进行中的服务订单 */}
					{record.status === 'selected' && (
						<Button
							variant="primary"
							size="sm"
							onClick={() => onGoToOrder?.(record.demandId)}
						>
							查看服务订单
						</Button>
					)}
				</View>
			</View>
		</View>
	);
};
