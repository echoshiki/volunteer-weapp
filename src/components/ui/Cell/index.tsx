import { View, ViewProps } from '@tarojs/components';

interface Props extends ViewProps {
	/** 取消内部边距 (用于包含全宽图片的卡片) */
	noPadding?: boolean;
	/** 开启点击下按反馈 (用于列表项) */
	clickable?: boolean;
	children: React.ReactNode;
}

export const Cell = ({
	noPadding = false,
	clickable = false,
	className = '',
	children,
	...props
}: Props) => {
	const hasCustomBg = className.includes('bg-');
	// 统一的白底、圆角、阴影、间距
	const baseClasses = `
        ${hasCustomBg ? '' : 'bg-white'} rounded-card overflow-hidden
        ${noPadding ? '' : 'p-4'}
        ${clickable ? 'active:scale-[0.98] transition-transform' : ''}
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
