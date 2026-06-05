import { View, Text } from '@tarojs/components';
import { DemandItem } from '@/types/demand';
import { Button, Divider } from '@/components/ui';
import { AuditStatusBadge } from '../BizBadge';

export interface DemandRecordCardProps {
	record: DemandItem;
	onClick?: (demand: DemandItem) => void;
	onEdit?: (demand: DemandItem) => void;
	onDelete?: (demand: DemandItem) => void;
	/** 查看抢单/接单人员 */
	onViewBid?: (demand: DemandItem) => void;
	/** 查看关联的服务订单 */
	onViewOrder?: (demand: DemandItem) => void;
	className?: string;
}

/**
 * 个人中心：我的需求单卡片
 */
export const DemandRecordCard = ({
	record,
	onClick,
	onEdit,
	onDelete,
	onViewBid,
	onViewOrder,
	className = '',
}: DemandRecordCardProps) => {
	// 提取需求单状态
	const canEdit = ['pending', 'rejected', 'approved'].includes(record.status);
	const isApproved = record.status === 'approved';
	const isCompleted = record.status === 'completed';

	return (
		<View className={`flex flex-col ${className}`}>
			<View
				className="flex justify-between items-center mb-2"
				onClick={() => onClick?.(record)}
			>
				<Text className="text-text-title font-bold text-base line-clamp-1 flex-1 pr-4">
					{record.demandName}
				</Text>
				<AuditStatusBadge value={record.status} />
			</View>

			<View className="flex flex-col gap-2 mb-2" onClick={() => onClick?.(record)}>
				{/* 标签与性质 */}
				<View className="flex items-center gap-2 mb-1">
					<Text className="text-xs text-text-muted bg-gray-50 px-2 py-0.5 rounded">
						{record.categoryName}
					</Text>
					{record.charge && (
						<Text className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
							公益
						</Text>
					)}
				</View>

				{/* 时间与地址摘要 */}
				<View className="flex flex-col gap-1 text-sm text-text-muted">
					{!record.charge && (record.minMoney > 0 || record.maxMoney > 0) && (
						<View className="flex items-center gap-1">
							<View className="icon-[ph--wallet] size-4" />
							<Text className="text-text-muted">预算金额：</Text>
							<Text className="text-orange-500 font-bold font-num">
								¥{record.minMoney} - ¥{record.maxMoney}
							</Text>
						</View>
					)}
					<View className="flex items-center gap-1">
						<View className="icon-[ph--clock] size-4" />
						<Text>发布时间：{record.createTime}</Text>
					</View>
					<View className="flex items-center gap-1">
						<View className="icon-[ph--map-pin] size-4" />
						<Text className="line-clamp-1">
							服务区域：{record.cityName}
							{record.districtName}
							{record.tenantName}
						</Text>
					</View>
				</View>
			</View>

			<Divider className="my-0" />

			<View className="flex justify-between items-center">
				{/* 左侧：可以放一些提示，比如驳回原因，或者收到的抢单数 */}
				<View className="flex-1">
					{record.status === 'rejected' && (
						<Text className="text-xs text-red-500 line-clamp-1">
							驳回原因：请修改后重新提交
						</Text>
					)}
				</View>

				{/* 右侧：动作按钮组 (根据状态动态渲染) */}
				<View className="flex items-center gap-2 shrink-0">
					{/* 待审核 / 已驳回 / 已通过状态：允许编辑 */}
					{canEdit && (
						<Button variant="info" size="sm" onClick={() => onEdit?.(record)}>
							修改需求
						</Button>
					)}

					{/* 已通过状态：允许查看抢单人员 */}
					{isApproved && (
						<Button variant="success" size="sm" onClick={() => onViewBid?.(record)}>
							选择服务方
						</Button>
					)}

					{/* 已完成状态：允许查看订单 */}
					{isCompleted && (
						<Button variant="primary" size="sm" onClick={() => onViewOrder?.(record)}>
							查看订单
						</Button>
					)}

					{/* 已完成状态：无法删除 */}
					{!isCompleted && (
						<Button variant="ghost" size="sm" onClick={() => onDelete?.(record)}>
							<Text className=" text-primary underline">删除</Text>
						</Button>
					)}
				</View>
			</View>
		</View>
	);
};
