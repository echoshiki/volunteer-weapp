import { View, Image, Text } from '@tarojs/components';
import { UserIdentityBadge } from '../BizBadge';
import { ServiceUser } from '@/types/demand';

export interface ServiceUserCardProps {
	/** 活动数据源 */
	user: ServiceUser;
	/** 外部追加的容器样式 */
	className?: string;
}

export const ServiceUserCard = ({ user }: ServiceUserCardProps) => {
	return (
		<View key={user.userId} className="flex items-center justify-between">
			<View className="flex items-center gap-2">
				<Image src={user.avatar} className="size-12 rounded-full bg-gray-100" />
				<View className="flex flex-col gap-1">
					<Text className="text-sm font-bold text-text-title block">{user.name}</Text>
					<View className="flex items-center gap-2">
						<Text className="text-xs text-text-muted">{user.createTime}</Text>
						<UserIdentityBadge value={user.identity} />
					</View>
				</View>
			</View>
			<View className="px-3 py-1 border border-primary text-primary text-xs rounded-full">
				查看资料
			</View>
		</View>
	);
};
