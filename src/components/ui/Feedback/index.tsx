import { View, Text } from '@tarojs/components';
import { ReactNode } from 'react';

// 定义支持的基础变体状态
export type FeedbackVariant = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface Props {
	/** 页面风格 */
	variant?: FeedbackVariant;
	/** Iconify 图标名称 */
	icon?: string;
	title?: string | ReactNode;
	subtitle?: string | ReactNode;
	/** 底部操作区 */
	extra?: ReactNode;
	/** 中间插槽 */
	children?: ReactNode;
	className?: string;
}

// 变体映射字典
const variantMap: Record<
	FeedbackVariant,
	{ defaultIcon: string; bgClass: string; iconClass: string }
> = {
	success: {
		defaultIcon: 'icon-[ph--check-circle-fill]',
		bgClass: 'bg-green-50',
		iconClass: 'text-green-500',
	},
	error: {
		defaultIcon: 'icon-[ph--x-circle-fill]',
		bgClass: 'bg-red-50',
		iconClass: 'text-red-500',
	},
	warning: {
		defaultIcon: 'icon-[ph--warning-circle-fill]',
		bgClass: 'bg-orange-50',
		iconClass: 'text-orange-500',
	},
	info: {
		defaultIcon: 'icon-[ph--info-fill]',
		bgClass: 'bg-blue-50',
		iconClass: 'text-blue-500',
	},
	loading: {
		defaultIcon: 'icon-[ph--spinner-gap]',
		bgClass: 'bg-transparent',
		iconClass: 'text-primary',
	},
};

export const Feedback = ({
	variant = 'info',
	icon,
	title,
	subtitle,
	extra,
	children,
	className = '',
}: Props) => {
	const config = variantMap[variant];
	const finalIcon = icon || config.defaultIcon;

	// 如果是 loading，加上旋转动画，并且不需要深色背景底
	const isLoading = variant === 'loading';

	return (
		<View className={`flex flex-col items-center w-full animate-fade-in ${className}`}>
			{/* 图标区 */}
			<View
				className={`
                flex items-center justify-center 
                ${isLoading ? '' : `w-16 h-16 rounded-full ${config.bgClass} mb-4`}
            `}
			>
				<View
					className={`
                    ${finalIcon} ${config.iconClass} 
                    ${isLoading ? 'w-12 h-12 animate-spin mb-6' : 'w-10 h-10'}
                `}
				/>
			</View>

			{/* 标题区 */}
			{title && (
				<Text
					className={`font-bold text-text-title mb-2 ${isLoading ? 'text-base' : 'text-2xl'}`}
				>
					{title}
				</Text>
			)}

			{/* 副标题/描述区 */}
			{subtitle && (
				<Text
					className={`text-sm text-text-muted text-center leading-relaxed px-4 ${children ? 'mb-6' : 'mb-10'}`}
				>
					{subtitle}
				</Text>
			)}

			{/* 核心内容插槽 (如打卡时长卡片) */}
			{children && <View className="w-full mb-8">{children}</View>}

			{/* 操作区 (如返回按钮) */}
			{extra && <View className="w-full">{extra}</View>}
		</View>
	);
};
