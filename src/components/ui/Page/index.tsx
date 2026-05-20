import { View } from '@tarojs/components';
import React from 'react';

interface Props {
	/** 是否包含底部 TabBar（用于留出底部安全高度） */
	hasTabBar?: boolean;
	children: React.ReactNode;
	className?: string;
}

export const Page = ({ hasTabBar = false, children, className = '' }: Props) => {
	const pbClass = hasTabBar ? 'pb-24' : 'pb-safe';
	return (
		<View className={`min-h-screen bg-main-bg flex flex-col relative ${pbClass} ${className}`}>
			{children}
		</View>
	);
};
