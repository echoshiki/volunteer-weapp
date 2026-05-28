import { View, Text } from '@tarojs/components';
import { Badge } from '@/components/ui';
import { TYPE_MAP, APPLY_STATUS_MAP } from '@/constants/apply';
import type { ApplyHistoryItem } from '@/types/user';
import { ApplyStatusBadge } from '../BizBadge';

export interface ApplyRecordCardProps {
	item: ApplyHistoryItem;
	className?: string;
}

/**
 * 申请历史记录列表卡片
 */
export const ApplyRecordCard = ({ item, className = '' }: ApplyRecordCardProps) => {
	const typeConfig = TYPE_MAP[item.reviewType];

	return (
		<View className={`flex flex-col ${className}`}>
			<View className="flex justify-between items-center pb-3 border-b border-gray-50 mb-3">
				<View className="flex items-center gap-2">
					<View className={`${typeConfig.icon} size-5 ${typeConfig.color}`} />
					<Text className="text-base font-bold text-text-title">{typeConfig.title}</Text>
				</View>
				<ApplyStatusBadge value={item.status} />
			</View>

			<View className="flex flex-col gap-2">
				{/* 动态展示主体 */}
				{item.reviewType === 1 && item.volunteerName ? (
					<View className="flex justify-between">
						<Text className="text-sm text-text-muted">意向协会</Text>
						<Text className="text-sm text-text-body">{item.volunteerName}</Text>
					</View>
				) : item.reviewType === 2 && item.institutionName ? (
					<View className="flex justify-between">
						<Text className="text-sm text-text-muted">申请机构</Text>
						<Text className="text-sm text-text-body">{item.institutionName}</Text>
					</View>
				) : null}

				{/* 时间信息 */}
				<View className="flex justify-between">
					<Text className="text-sm text-text-muted">提交时间</Text>
					<Text className="text-sm text-text-body">{item.createTime}</Text>
				</View>

				{item.status !== 'pending' && item.updateTime && (
					<View className="flex justify-between">
						<Text className="text-sm text-text-muted">处理时间</Text>
						<Text className="text-sm text-text-body">{item.updateTime}</Text>
					</View>
				)}

				{/* 驳回原因 (高亮) */}
				{item.status === 'rejected' && item.remark && (
					<View className="mt-2 p-3 bg-red-50/50 rounded-md">
						<Text className="text-xs text-red-500 leading-relaxed">
							驳回原因：{item.remark}
						</Text>
					</View>
				)}
			</View>
		</View>
	);
};
