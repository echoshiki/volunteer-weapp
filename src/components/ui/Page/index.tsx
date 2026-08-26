import { QuickNav } from '@/components/biz';
import { useConfigStore } from '@/store/config';
import { View } from '@tarojs/components';
import React from 'react';

export interface PageProps {
	/** 是否包含底部 TabBar（用于留出底部安全高度） */
	hasTabBar?: boolean;
	children: React.ReactNode;
	className?: string;
}

/**
 * 页面级布局组件
 */
export const Page = ({ hasTabBar = false, children, className = '' }: PageProps) => {
	const pbClass = hasTabBar ? 'pb-24' : 'pb-safe';

	const { config } = useConfigStore();
	const isWechatReview = config?.review ?? true;

	return (
		<View className={`min-h-screen bg-main-bg flex flex-col relative ${pbClass} ${className}`}>
			{children}
			{/* 悬浮快捷导航入口 */}
			{!isWechatReview && <QuickNav hasTabBar />}
		</View>
	);
};
