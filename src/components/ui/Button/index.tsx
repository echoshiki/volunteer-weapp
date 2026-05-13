import { Button as TaroButton, ButtonProps as TaroButtonProps, View } from '@tarojs/components';
import React from 'react';

/** 按钮尺寸预设 */
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** 按钮视觉变体 */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

interface Props extends Omit<TaroButtonProps, 'size' | 'type'> {
	/** 尺寸，默认 md */
	size?: ButtonSize;
	/** 变体，默认 primary */
	variant?: ButtonVariant;
	/** 图标类名 (Iconify) */
	icon?: string;
	/** 是否为圆角，默认 true */
	rounded?: boolean;
	/** 是否占满整行 */
	block?: boolean;
	/** 加载状态 */
	loading?: boolean;
	children?: React.ReactNode;
}

export const Button: React.FC<Props> = ({
	size = 'md',
	variant = 'primary',
	icon,
	rounded = true,
	block = false,
	loading = false,
	className = '',
	children,
	disabled,
	...props
}) => {
	// 尺寸样式映射 (高度、内边距、字体、图标大小)
	const sizeMap: Record<ButtonSize, string> = {
		xs: 'h-7 px-3 text-xs gap-1',
		sm: 'h-9 px-4 text-xs gap-1',
		md: 'h-11 px-6 text-sm gap-1.5',
		lg: 'h-13 px-8 text-base gap-2',
		xl: 'h-15 px-10 text-lg gap-2',
	};

	// 尺寸对应的图标大小 (w-h)
	const iconSizeMap: Record<ButtonSize, string> = {
		xs: 'w-3.5 h-3.5',
		sm: 'w-4 h-4',
		md: 'w-5 h-5',
		lg: 'w-6 h-6',
		xl: 'w-7 h-7',
	};

	// 变体颜色映射 (利用 theme 变量)
	const variantMap: Record<ButtonVariant, string> = {
		primary: 'bg-primary text-white border-none active:opacity-90',
		secondary: 'bg-gray-100 text-text-body border-none active:bg-gray-200',
		outline: 'bg-transparent text-primary border border-primary active:bg-red-50',
		ghost: 'bg-transparent text-text-muted border-none active:bg-gray-100',
		danger: 'bg-red-500 text-white border-none active:bg-red-600',
	};

	// 基础类名构建
	const baseClasses = `
        flex items-center justify-center font-bold transition-all overflow-hidden
        ${block ? 'w-full' : 'inline-flex w-fit'}
        ${rounded ? 'rounded-full' : 'rounded-card'}
        ${disabled || loading ? 'opacity-50 grayscale pointer-events-none' : ''}
        ${sizeMap[size]}
        ${variantMap[variant]}
        ${className}
    `
		.replace(/\s+/g, ' ')
		.trim();

	return (
		<TaroButton className={baseClasses} disabled={disabled || loading} {...props}>
			{/* 加载或自定义图标 */}
			{(loading || icon) && (
				<View
					className={`
                        ${loading ? 'icon-[ph--spinner-gap-bold] animate-spin' : icon} 
                        ${iconSizeMap[size]}
                    `}
				/>
			)}
			{children}
		</TaroButton>
	);
};
