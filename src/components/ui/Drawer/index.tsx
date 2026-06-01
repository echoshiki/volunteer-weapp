import { View, Text, ScrollView } from '@tarojs/components';
import { ReactNode } from 'react';

export interface DrawerProps {
	/** 控制抽屉的显隐 */
	isOpen: boolean;
	/** 关闭抽屉的回调 */
	onClose: () => void;
	/** 抽屉标题（可选，不传则不显示 Header） */
	title?: string;
	/** 抽屉主体内容 */
	children: ReactNode;
	/** 底部吸底操作区（可选，专门用来放“重置/确定”按钮） */
	footer?: ReactNode;
	/** 抽屉宽度，默认占屏幕 85% */
	width?: string;
}

/**
 * 抽屉组件
 */
export const Drawer = ({
	isOpen,
	onClose,
	title,
	children,
	footer,
	width = 'w-[85vw]',
}: DrawerProps) => {
	return (
		<View
			className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${
				isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
			}`}
		>
			{/* 黑色半透明遮罩层，catchMove 阻断底层滑动穿透 */}
			<View className="absolute inset-0 bg-black/40" onClick={onClose} catchMove />

			{/* 抽屉白板面板本体，transform 与 translate-x 开启加速 */}
			<View
				className={`absolute top-0 right-0 ${width} h-full bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out transform ${
					isOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				{/* 头部：标题与关闭按钮 */}
				{title && (
					<View className="flex items-center justify-between px-4 h-14 border-b border-gray-100 shrink-0">
						<Text className="text-sm font-medium text-text-title">{title}</Text>
						<View
							className="icon-[ph--x-bold] size-5 text-gray-400 active:text-gray-600 transition-colors p-2"
							onClick={onClose}
						/>
					</View>
				)}

				{/* 内容区：局部独立滚动 */}
				<ScrollView scrollY className="flex-1 w-full h-full overflow-hidden relative">
					{children}
				</ScrollView>

				{/* 底部吸底操作区：用于放置筛选的 确定/重置 按钮 */}
				{footer && (
					<View className="shrink-0 p-4 border-t border-gray-50 bg-white pb-safe">
						{footer}
					</View>
				)}
			</View>
		</View>
	);
};
