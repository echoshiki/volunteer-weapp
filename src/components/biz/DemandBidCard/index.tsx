import { View, Image, Text } from '@tarojs/components';
import { UserIdentityBadge } from '../BizBadge';
import { DemandBidItem } from '@/types/demand';
import { Button, Divider } from '@/components/ui';

export interface DemandBidCardProps {
	/** 活动数据源 */
	user: DemandBidItem;
	/** 动作：查看资料 */
	onViewProfile?: (user: DemandBidItem) => void;
	/** 动作：确认选择（中标） */
	onSelect?: (user: DemandBidItem) => void;
	/** 外部追加的容器样式 */
	className?: string;
}

export const DemandBidCard = ({
	user,
	onViewProfile,
	onSelect,
	className = '',
}: DemandBidCardProps) => {
	return (
		<View className={`flex flex-col ${className}`}>
			{/* 服务方身份信息 */}
			<View className="flex items-center justify-between mb-3">
				<View className="flex items-center gap-3">
					<Image
						src={user.avatar}
						className="size-12 rounded-full bg-gray-100 shrink-0"
					/>
					<View className="flex flex-col gap-1">
						<View className="flex items-center gap-2">
							<Text className="text-sm font-bold text-text-title">{user.name}</Text>
							<UserIdentityBadge value={user.identity} />
						</View>
						<View className="flex items-center gap-2 text-xs text-text-muted">
							<Text>已服务 {user.serviceCount} 次</Text>
							<Text>|</Text>
							<Text>报价时间: {user.createTime.split(' ')[0]}</Text>
						</View>
					</View>
				</View>

				{/* 报价金额高亮展示 */}
				<View className="flex flex-col items-end">
					{user.money > 0 ? (
						<Text className="text-orange-500 font-bold font-num text-lg">
							<Text className="text-sm">¥</Text>
							{user.money}
						</Text>
					) : (
						<Text className="text-green-500 font-bold text-sm">公益免单</Text>
					)}
				</View>
			</View>

			{/* 报价留言/描述 */}
			{user.description && (
				<View className="bg-gray-50 rounded p-3 mb-3 relative">
					{/* 小三角气泡指示器 */}
					<View className="absolute -top-2 left-6 w-0 h-0 border-l-[6px] border-r-[6px] border-b-8 border-transparent border-b-gray-50" />
					<Text className="text-sm text-text-body line-clamp-3 leading-relaxed">
						“{user.description}”
					</Text>
				</View>
			)}

			<Divider className="my-0 mb-3" />

			{/* 操作按钮 */}
			<View className="flex justify-between items-center">
				<View
					className="flex items-center gap-1 text-primary active:opacity-70 transition-opacity"
					onClick={() => onViewProfile?.(user)}
				>
					<View className="icon-[ph--user-circle] size-4" />
					<Text className="text-xs">查看详细资料</Text>
				</View>

				<Button
					variant="primary"
					size="sm"
					className="px-6 shadow-sm shadow-blue-200"
					onClick={() => onSelect?.(user)}
				>
					确认选 Ta
				</Button>
			</View>
		</View>
	);
};
