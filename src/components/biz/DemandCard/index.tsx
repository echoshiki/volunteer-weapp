import { View, Text } from '@tarojs/components';
import { DemandStatusBadge } from '@/components/biz'; // 确保路径正确
import { mapsTo } from '@/utils/common';
import { DemandItem } from '@/types/demand';
import { Cell } from '@/components/ui';

export interface DemandCardProps {
	demand: DemandItem;
	/** 外部追加的容器样式 */
	className?: string;
}

/**
 * 需求列表项卡片
 */
export const DemandCard = ({ demand, className = '' }: DemandCardProps) => {
	return (
		<Cell
			className={`${className}`}
			onClick={() => mapsTo(`/pages/demand/detail/index?id=${demand.orderId}`)}
		>
			{/* 标题与状态 */}
			<View className="flex justify-between items-center mb-2">
				<Text className="text-text-title font-bold text-base line-clamp-1 flex-1 pr-2">
					{demand.orderName}
				</Text>
				<DemandStatusBadge value={demand.acceptStatus} />
			</View>

			{/* 核心标签区 */}
			<View className="flex items-center gap-2 mb-3">
				<Text className="text-xs text-text-muted bg-gray-100 px-2 py-0.5 rounded">
					{demand.categoryUserName}
				</Text>
				<Text className="text-xs text-primary bg-red-50 px-2 py-0.5 rounded">
					{demand.demandName}
				</Text>
				<Text
					className={`text-xs px-2 py-0.5 rounded ${
						demand.charge
							? 'text-green-600 bg-green-50'
							: 'text-orange-600 bg-orange-50'
					}`}
				>
					{demand.charge ? '公益免费' : '付费服务'}
				</Text>
			</View>

			{/* 需求描述正文 */}
			<Text className="text-sm text-text-body line-clamp-2 mb-3">{demand.description}</Text>

			{/* 底部发单人信息与操作按钮 */}
			<View className="flex justify-between items-end border-t border-gray-50 pt-3">
				<View className="flex flex-col gap-1">
					<View className="flex items-center gap-1 text-text-muted text-xs">
						<View className="icon-[ph--user] w-3 h-3" />
						<Text>{demand.nickName}</Text>
						<Text className="ml-1 px-1 bg-gray-100 rounded text-xs scale-90 origin-left whitespace-nowrap">
							{demand.serviceScope === 'group' ? '集体' : '个人'}
						</Text>
					</View>
				</View>

				{/* 仅在派单中状态展示去接单按钮 */}
				{demand.acceptStatus === 'dispatching' && (
					<View className="bg-primary text-white text-xs px-4 py-1.5 rounded-full font-bold shadow-sm shrink-0">
						去接单
					</View>
				)}
			</View>
		</Cell>
	);
};
