import { View, Text, Button } from '@tarojs/components';

interface Props {
	/** 状态提示标题 */
	title?: string;
	/** 状态提示副标题 */
	subTitle?: string;
	/** 按钮文本 */
	buttonText?: string;
	/** 图标名，使用 Iconify 图标类名 */
	icon?: string;
	/** 按钮点击事件 */
	onButtonClick?: () => void;
}

/**
 * 空状态组件
 */
export const Empty = ({
	title = '空空如也',
	subTitle = '暂无数据，试试其他搜索关键词吧',
	buttonText,
	icon = 'icon-[ph--mailbox]',
	onButtonClick,
}: Props) => {
	return (
		<View className="min-h-84 py-20 flex flex-col gap-5 items-center animate-fade-in">
			{/* 图片部分 */}
			<View className="rounded-full bg-gray-200 p-5">
				<View className={`w-12 h-12 ${icon} text-white`} />
			</View>

			{/* 文字部分 */}
			<View className="flex flex-col justify-center items-center gap-2">
				<Text className="text-xl font-bold text-zinc-500 text-center">{title}</Text>
				{subTitle && (
					<Text className="text-sm text-zinc-300 text-center px-6 leading-relaxed">
						{subTitle}
					</Text>
				)}
			</View>

			{/* 动作按钮 */}
			{buttonText && onButtonClick && (
				<Button
					className="m-0 px-10 h-10 rounded-full bg-primary text-white text-sm flex items-center"
					onClick={onButtonClick}
				>
					{buttonText}
				</Button>
			)}
		</View>
	);
};
