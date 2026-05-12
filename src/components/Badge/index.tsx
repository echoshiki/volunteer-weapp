import { Text, View } from '@tarojs/components';
import { ReactNode } from 'react';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'gray' | 'gold';
type BadgeSize = 'xs' | 'sm' | 'md';

interface BadgeProps {
	children: ReactNode;
	variant?: BadgeVariant;
	size?: BadgeSize;
	pill?: boolean; // 是否为胶囊形状（全圆角）
	className?: string;
	onClick?: () => void;
}

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
