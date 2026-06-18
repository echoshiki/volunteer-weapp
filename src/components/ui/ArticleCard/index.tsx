import { View, Text, Image } from '@tarojs/components';
import { Cell } from '../Cell';

export interface ArticleCardProps {
	title: string;
	cover: string;
	summary?: string;
	createAt?: string;
	onClick?: () => void;
}

export const ArticleCard = ({ title, cover, summary, createAt, onClick }: ArticleCardProps) => {
	return (
		<View className="flex gap-4 items-start active:bg-gray-50 transition-colors" onClick={onClick}>
			{/* 左侧文章封面图 */}
			<Image src={cover} mode="aspectFill" className="size-20 rounded-lg bg-gray-100 shrink-0 shadow-sm" />
			{/* 右侧文本描述 */}
			<View className="flex-1 min-w-0 flex flex-col justify-between h-20 py-0.5">
				<View>
					<Text className="text-sm font-semibold text-text-title line-clamp-1">{title}</Text>
					<Text className="text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed">
						{summary || '暂无内容摘要描述...'}
					</Text>
				</View>
				<View className="flex justify-between items-center text-xs text-gray-400">
					<Text>便民信息</Text>
					<Text>{createAt?.split(' ')[0]}</Text>
				</View>
			</View>
		</View>
	);
};
