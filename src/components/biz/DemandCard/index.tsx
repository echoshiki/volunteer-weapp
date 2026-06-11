import { View, Text } from '@tarojs/components';
import { stripHtml } from '@/utils/common';
import { DemandItem } from '@/types/demand';
import { Badge } from '@/components/ui';
import { navigateWithAuth } from '@/utils/auth';

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
		<View
			className={`${className}`}
			onClick={() => navigateWithAuth(`/pages/demand/detail/index?id=${demand.demandId}`)}
		>
			{/* 标题与状态 */}
			<View className="flex justify-between items-center mb-2">
				<Text className="text-text-title font-bold text-base line-clamp-1 flex-1 pr-2">
					{demand.demandName}
				</Text>
				{demand.charge && <Badge variant="success">公益</Badge>}
			</View>

			{/* 核心标签区 */}
			<View className="flex items-center flex-wrap gap-1 mb-3">
				{demand.tags.map((tag) => (
					<Badge key={tag.tagId} variant="primary">
						{tag.tagName}
					</Badge>
				))}
			</View>

			{/* 需求描述正文 */}
			<Text className="text-sm text-text-body line-clamp-2 mb-3">{stripHtml(demand.content)}</Text>

			{/* 底部发单人信息与操作按钮 */}
			<View className="flex justify-between items-end border-t border-gray-50 pt-3">
				<View className="flex gap-4 items-center">
					<View className="flex items-center gap-1 text-text-muted text-xs">
						<View className="icon-[ph--user] size-4" />
						<Text>{demand.name}</Text>
					</View>
					<View className="flex items-center gap-1 text-text-muted text-xs">
						<View className="icon-[ph--calendar-blank] size-4" />
						<View>{demand.createTime.split(' ')[0]}</View>
					</View>
				</View>

				<Badge variant="info">{demand.categoryName}</Badge>
			</View>
		</View>
	);
};
