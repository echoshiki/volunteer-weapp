import { Text, View } from '@tarojs/components';
import { ReactNode } from 'react';

/** 徽章变体 */
type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'gray' | 'gold';

/** 徽章尺寸 */
type BadgeSize = 'xs' | 'sm' | 'md';

interface BadgeProps {
	/** 视觉变体，默认 gray {@link BadgeVariant} */
	variant?: BadgeVariant;
	/** 尺寸，默认 sm {@link BadgeSize} */
	size?: BadgeSize;
	/** 是否为胶囊形状（全圆角），默认 false */
	pill?: boolean;
	/** 额外的 className */
	className?: string;
	/** 点击事件 */
	onClick?: () => void;
	/** 子节点 */
	children: ReactNode;
}

/**
 * 徽章标签组件
 * 用于显示状态、数量等信息，提供多种颜色和尺寸选项
 */
export const Badge = ({
	children,
	variant = 'gray',
	size = 'sm',
	pill = false,
	className = '',
	onClick,
}: BadgeProps) => {
	const variantMap: Record<BadgeVariant, string> = {
		primary: 'bg-primary/10 text-primary',
		success: 'bg-emerald-500/10 text-emerald-600',
		warning: 'bg-amber-500/10 text-amber-600',
		danger: 'bg-rose-500/10 text-rose-600',
		gray: 'bg-zinc-100 text-zinc-600',
		gold: 'bg-orange-400/10 text-orange-600',
	};

	const sizeMap: Record<BadgeSize, string> = {
		xs: 'text-[20rpx] px-1.5 py-0.5',
		sm: 'text-xs px-2 py-0.5',
		md: 'text-sm px-2.5 py-1',
	};

	return (
		<View
			onClick={onClick}
			className={`
				inline-flex items-center justify-center tracking-wider
				${pill ? 'rounded-full' : 'rounded'} 
				${variantMap[variant]} 
				${sizeMap[size]} 
				${className}
			`}
		>
			<Text>{children}</Text>
		</View>
	);
};
