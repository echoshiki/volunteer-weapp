import { View, Text } from '@tarojs/components';
import { mapsTo } from '@/utils/common';
import { Icon } from '../Icon';

interface Props {
	/** 标题文字 */
	title: string;
	/** Iconify 图标类名 */
	icon?: string;
	/** 右侧“查看更多”链接配置 */
	link?: {
		name: string;
		url: string;
	};
}

/**
 * 通用区块标题
 */
export const SectionTitle = ({ title, icon, link }: Props) => {
	return (
		<View className="w-full flex justify-between items-center mb-6">
			{/* 左侧：装饰与标题 */}
			<View className="flex items-center gap-2">
				{icon ? (
					<View className="flex items-center justify-center">
						<Icon icon={icon} className="w-6 h-6 text-primary" />
					</View>
				) : (
					<View className="w-1 h-6 bg-primary rounded-full" />
				)}

				{/* 标题文本动态样式 */}
				<Text className="text-title text-lg font-bold">{title}</Text>
			</View>

			{/* 右侧：跳转链接 */}
			{link && (
				<View
					className="text-sm flex justify-end items-center gap-1"
					onClick={() => mapsTo(link.url)}
				>
					<Text className="text-zinc-500 text-xs">{link.name}</Text>
					<View className="icon-[ph--caret-right] w-4 h-4 text-zinc-500" />
				</View>
			)}
		</View>
	);
};
