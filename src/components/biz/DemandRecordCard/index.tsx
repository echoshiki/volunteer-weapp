import { View, Text } from '@tarojs/components';
import { DemandItem } from '@/types/demand';
import { Button, Divider } from '@/components/ui';
import { AuditStatusBadge } from '../BizBadge';

export interface DemandRecordCardProps {
	record: DemandItem;
	/** 点击卡片本体跳转详情 */
	onClick?: (demand: DemandItem) => void;
	/** 动作：去编辑 */
	onEdit?: (demand: DemandItem) => void;
	/** 动作：删除 */
	onDelete?: (demand: DemandItem) => void;
	/** 动作：查看抢单/接单人员 */
	onViewApplicants?: (demand: DemandItem) => void;
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
	onViewApplicants,
	className = '',
}: DemandRecordCardProps) => {
	return (
		<View className={`flex flex-col bg-white ${className}`}>
			<View
				className="flex justify-between items-center mb-3"
				onClick={() => onClick?.(record)}
			>
				<Text className="text-text-title font-bold text-base line-clamp-1 flex-1 pr-4">
					{record.demandName}
				</Text>
				<AuditStatusBadge value={record.status} />
			</View>

			<View className="flex flex-col gap-2 mb-2" onClick={() => onClick?.(record)}>
				{/* 标签与性质 */}
				<View className="flex items-center gap-2">
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
				<View className="flex flex-col gap-1 text-xs text-text-muted mt-1">
					{!record.charge && (record.minMoney > 0 || record.maxMoney > 0) && (
						<View className="flex items-center gap-1">
							<View className="icon-[ph--wallet] size-3" />
							<Text className="text-text-muted">预算金额：</Text>
							<Text className="text-orange-500 font-bold font-num">
								¥{record.minMoney} - ¥{record.maxMoney}
							</Text>
						</View>
					)}
					<View className="flex items-center gap-1">
						<View className="icon-[ph--clock] size-3" />
						<Text>发布时间：{record.createTime}</Text>
					</View>
					<View className="flex items-center gap-1">
						<View className="icon-[ph--map-pin] size-3" />
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
					{/* 所有状态都可以删除 */}
					<Button variant="danger" size="xs" onClick={() => onDelete?.(record)}>
						删除
					</Button>

					{/* 待审核 / 已驳回状态：允许编辑 */}
					{(record.status === 'pending' || record.status === 'rejected') && (
						<Button variant="info" size="xs" onClick={() => onEdit?.(record)}>
							修改需求
						</Button>
					)}

					{/* 已通过状态：允许查看抢单人员 */}
					{record.status === 'approved' && (
						<Button
							variant="success"
							size="xs"
							onClick={() => onViewApplicants?.(record)}
						>
							选择服务方
						</Button>
					)}
				</View>
			</View>
		</View>
	);
};
