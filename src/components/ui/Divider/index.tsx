import { View } from '@tarojs/components';
import React from 'react';

interface Props {
	/** 分割线方向 */
	orientation?: 'horizontal' | 'vertical';
	/** 是否为虚线 */
	dashed?: boolean;
	/** 分割线中间的文本或节点 (仅水平方向生效) */
	children?: React.ReactNode;
	/** 自定义外层类名 (常用于控制外边距，如 my-6, mx-3) */
	className?: string;
}

export const Divider = ({
	orientation = 'horizontal',
	dashed = false,
	children,
	className = '',
}: Props) => {
	if (orientation === 'vertical') {
		const verticalClasses = `
            inline-block w-[1px] min-h-[1em] mx-2 align-middle self-center shrink-0
            ${dashed ? 'border-l border-dashed border-gray-200 bg-transparent' : 'bg-gray-200'}
            ${className}
        `
			.replace(/\s+/g, ' ')
			.trim();

		return <View className={verticalClasses} />;
	}

	if (!children) {
		const horizontalClasses = `
            w-full h-[1px] my-3
            ${dashed ? 'border-t border-dashed border-gray-200 bg-transparent' : 'bg-gray-200'}
            ${className}
        `
			.replace(/\s+/g, ' ')
			.trim();

		return <View className={horizontalClasses} />;
	}

	const lineClasses = `
        flex-1 h-[1px] 
        ${dashed ? 'border-t border-dashed border-gray-200 bg-transparent' : 'bg-gray-200'}
    `
		.replace(/\s+/g, ' ')
		.trim();

	return (
		<View className={`flex items-center w-full my-4 ${className}`}>
			<View className={lineClasses} />
			<View className="px-4 text-xs text-text-muted font-sans shrink-0">{children}</View>
			<View className={lineClasses} />
		</View>
	);
};
