import { View, Text, Image } from '@tarojs/components';

interface Props {
	/** 已上传的图片 URL（有值则展示全屏预览，无值展示占位符） */
	value?: string;
	/** 点击触发的上传回调 */
	onClick?: () => void;
	/** 占位图标的类名 (Ph Icon) */
	icon?: string;
	/** 占位提示文字 */
	label?: string;
	/** 扩展的自定义样式类 */
	className?: string;
}

export const UploadBox = ({
	value,
	onClick,
	icon = 'icon-[ph--image-duotone]',
	label = '点击上传',
	className = '',
}: Props) => {
	// 基础样式：包含了虚线边框、背景、居中、点击反馈以及固定宽高比
	const baseClasses = `
        border-2 border-dashed border-gray-200 rounded-card bg-gray-50/50 p-3 
        flex flex-col items-center justify-center gap-2 
        relative overflow-hidden aspect-video h-28 
        active:bg-gray-100/50 transition-colors cursor-pointer
        ${className}
    `
		.replace(/\s+/g, ' ')
		.trim();

	return (
		<View className={baseClasses} onClick={onClick}>
			{value ? (
				// 预览状态
				<Image
					src={value}
					mode="aspectFill"
					className="absolute inset-0 w-full h-full z-0"
				/>
			) : (
				// 空白占位状态
				<>
					<View className={`${icon} size-7 text-zinc-400 z-10`} />
					<Text className="text-xs text-text-body font-medium z-10">{label}</Text>
				</>
			)}
		</View>
	);
};
