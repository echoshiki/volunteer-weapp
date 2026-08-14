import { View, Text, Image } from '@tarojs/components';
import { AssociationItem } from '@/types/association';
import { Badge, Button, Divider } from '@/components/ui';
import { getTenantId } from '@/utils/tenant';

export interface AssociationCardProps {
	record: AssociationItem;
	/** 触发入驻大区动作 */
	onSwitch?: (tenantId: number, tenantName: string) => void;
	className?: string;
}

export const AssociationCard = ({ record, onSwitch, className = '' }: AssociationCardProps) => {
	const activeTenantId = getTenantId();
	// 如果卡片上的 tenantId 等于当前本地存的 tenantId，说明就是用户当前所在的组织
	const isCurrentArea = activeTenantId === record.tenantId.toString();

	return (
		<View className={`w-full flex flex-col ${className}`}>
			{/* 上部：组织基础简介大栏 (左图右文) */}
			<View className="flex gap-3 items-start w-full min-w-0">
				<Image
					src={record.logo || 'https://placeholder.com/100'}
					className="size-15 rounded-xl bg-gray-50 border border-gray-100 shrink-0"
					mode="aspectFit"
				/>

				<View className="flex-1 min-w-0 flex flex-col gap-1.5">
					<View className="flex items-center gap-2 flex-wrap">
						<Text className="text-base font-bold text-text-title truncate">{record.associationName}</Text>
						{isCurrentArea && <Badge>当前入驻</Badge>}
					</View>
					<View className="text-xs text-text-muted font-num flex items-center gap-1">
						<Badge variant="info">{record.tenantName}</Badge>
						<View className="icon-[ph--map-pin] size-3.5 shrink-0" />
						{record.provinceName}
						{record.cityName}
						{record.districtName}
					</View>
				</View>
			</View>

			<Divider className="my-3 opacity-60" />

			{/* 下部：负责人资料审计与核心动作切码对齐 */}
			<View className="flex justify-between items-center w-full">
				<View className="flex flex-col gap-0.5 text-xs text-text-muted">
					<Text>
						负责人：<Text className="text-text-title font-medium">{record.leader}</Text>
					</Text>
					<Text className="font-num mt-0.5">联系电话：{record.phone}</Text>
				</View>

				{/* 触发器 */}
				{/* <Button
					variant={isCurrentArea ? 'success' : 'outline'}
					size="xs"
					className="px-4 font-bold shrink-0"
					disabled={isCurrentArea} // 当前大区不可重复点击
					onClick={(e) => {
						e.stopPropagation();
						onSwitch?.(record.tenantId, record.associationName);
					}}
				>
					{isCurrentArea ? '服务中' : '申请入驻'}
				</Button> */}
			</View>
		</View>
	);
};
