import { View, ScrollView, ScrollViewProps } from '@tarojs/components';
import React from 'react';

interface Props extends ScrollViewProps {
	/** 是否包含底部 TabBar（用于留出底部安全高度） */
	hasTabBar?: boolean;
	/** 是否需要全屏滚动 (默认 true) */
	scroll?: boolean;
	children: React.ReactNode;
	className?: string;
}

export const Page = ({
	hasTabBar = false,
	scroll = true,
	children,
	className = '',
	...props
}: Props) => {
	// 第一层统一底色和最小高度
	const baseClass = `min-h-screen bg-main-bg flex flex-col relative ${className}`;

	// 底部留白，防止被系统小白条或 TabBar 遮挡
	const pbClass = hasTabBar ? 'pb-24' : 'pb-safe';

	if (scroll) {
		return (
			<View className={baseClass}>
				{/* TODO: 触底监听 */}
				<ScrollView scrollY className={`h-screen flex-1 ${pbClass}`} {...props}>
					{children}
				</ScrollView>
			</View>
		);
	}

	return <View className={`${baseClass} ${pbClass}`}>{children}</View>;
};
