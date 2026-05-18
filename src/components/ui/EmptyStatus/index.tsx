import { View, Text, Button } from '@tarojs/components';

/**
 * 基础空状态组件属性
 * @param title 提示标题
 * @param subTitle 副标题/详细描述
 * @param buttonText 按钮文字
 * @param onButtonClick 按钮点击回调，如果不传则不显示按钮
 * @param iconClass 自定义图标类名 (优先级高于 type)
 */
interface Props {
	title?: string;
	subTitle?: string;
	buttonText?: string;
	onButtonClick?: () => void;
	icon?: string;
}

export const EmptyStatus = ({
	title = '空空如也',
	subTitle = '暂无数据，试试其他搜索关键词吧',
	buttonText,
	onButtonClick,
	icon = 'icon-[ph--mailbox]',
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
