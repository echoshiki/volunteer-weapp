import { View, Image, Text } from '@tarojs/components';

export interface ImagePreviewProps {
	/** 显隐控制 */
	visible: boolean;
	/** 想要预览的图片绝对路径 */
	src: string;
	/** 关闭弹窗的回调 */
	onClose: () => void;
	/** 底部自定义操作区域的插槽 */
	actions?: React.ReactNode;
	/** 是否开启微信原生的长按弹出菜单 */
	showMenuByLongpress?: boolean;
	/** 外部自定义容器样式 */
	className?: string;
}

/**
 * 工业级通用高保真全屏图片预览器
 */
export const ImagePreview = ({
	visible,
	src,
	onClose,
	actions,
	showMenuByLongpress = true,
	className = '',
}: ImagePreviewProps) => {
	if (!visible) return null;

	return (
		<View
			className={`fixed inset-0 bg-black/90 z-50 flex flex-col justify-between items-center px-6 py-12 animate-fade-in ${className}`}
		>
			{/* 顶部纯净关闭区域 */}
			<View className="w-full flex justify-end">
				<View
					className="icon-[ph--x-circle-fill] size-8 text-white/50 active:text-white/80 transition-colors"
					onClick={onClose}
				/>
			</View>

			{/* 图片高保真渲染核心区 */}
			<View className="w-full flex-1 flex items-center justify-center py-4">
				{src ? (
					<Image
						src={src}
						mode="widthFix"
						className="w-full rounded-lg shadow-2xl bg-zinc-900 transition-all"
						showMenuByLongpress={showMenuByLongpress}
					/>
				) : (
					<Text className="text-sm text-white/40">暂无图片内容</Text>
				)}
			</View>

			{/* 底部动态扩展动作槽（如果没有传 actions，默认给个长按提示） */}
			<View className="w-full px-4 flex flex-col gap-3">
				{actions
					? actions
					: showMenuByLongpress && (
							<Text className="text-center text-xs text-white/30 tracking-wide">
								提示：您可以长按图片进行转发或保存
							</Text>
						)}
			</View>
		</View>
	);
};
