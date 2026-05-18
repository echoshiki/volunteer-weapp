import { View, ViewProps } from '@tarojs/components';
import React from 'react';

interface ContainerProps extends ViewProps {
	/** 是否需要水平边距 (默认 true，对应 px-4) */
	px?: boolean;
	/** 是否需要垂直边距 (默认 true，对应 py-3) */
	py?: boolean;
	/** 内部元素的垂直间距 (默认 'sm') */
	spacing?: 'none' | 'sm' | 'md' | 'lg';
	children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
	px = true,
	py = true,
	spacing = 'sm',
	className = '',
	children,
	...props
}) => {
	// 🎨 统一全局垂直间距规范
	const spacingMap = {
		none: '',
		sm: 'space-y-3', // 常规卡片列表间距
		md: 'space-y-4', // 表单项间距
		lg: 'space-y-6', // 大模块之间的间距
	};

	const baseClasses = `
        ${px ? 'px-4' : ''}
        ${py ? 'py-3' : ''}
        ${spacingMap[spacing]}
        ${className}
    `
		.replace(/\s+/g, ' ')
		.trim();

	return (
		<View className={baseClasses} {...props}>
			{children}
		</View>
	);
};
