import { View, Text } from '@tarojs/components';
import { ReactNode } from 'react';

// 定义支持的提示类型
export type AlertVariant = 'warning' | 'info' | 'success' | 'error';

export interface AlertProps {
	/** 主题色调 */
	variant?: AlertVariant;
	/** 自定义图标（覆盖默认图标） */
	icon?: string;
	/** 提示文案，支持纯文本或复杂的 ReactNode */
	children: ReactNode;
	/** 外层容器的追加样式 */
	className?: string;
}

// 样式字典配置
const variantMap: Record<
	AlertVariant,
	{ defaultIcon: string; bgClass: string; iconClass: string; textClass: string }
> = {
	warning: {
		defaultIcon: 'icon-[ph--warning-circle]',
		bgClass: 'bg-orange-50',
		iconClass: 'text-orange-500',
		textClass: 'text-orange-600',
	},
	info: {
		defaultIcon: 'icon-[ph--info]',
		bgClass: 'bg-blue-50',
		iconClass: 'text-blue-500',
		textClass: 'text-blue-600',
	},
	success: {
		defaultIcon: 'icon-[ph--check-circle]',
		bgClass: 'bg-green-50',
		iconClass: 'text-green-500',
		textClass: 'text-green-600',
	},
	error: {
		defaultIcon: 'icon-[ph--x-circle]',
		bgClass: 'bg-red-50',
		iconClass: 'text-red-500',
		textClass: 'text-red-600',
	},
};

export const Alert = ({ variant = 'warning', icon, children, className = '' }: AlertProps) => {
	const config = variantMap[variant];
	const finalIcon = icon || config.defaultIcon;

	return (
		<View className={`rounded-card p-4 flex items-start gap-2 ${config.bgClass} ${className}`}>
			<View className={`${finalIcon} w-4 h-4 mt-0.5 shrink-0 ${config.iconClass}`} />
			<View className={`flex-1 text-xs leading-normal ${config.textClass}`}>
				{typeof children === 'string' ? <Text>{children}</Text> : children}
			</View>
		</View>
	);
};
