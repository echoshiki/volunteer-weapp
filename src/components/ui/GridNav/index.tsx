import { View, Text } from '@tarojs/components';
import { mapsTo } from '@/utils/common';

export type NavIconVariant = 'primary' | 'success' | 'secondary' | 'warning' | 'danger' | 'info';

const variantMap: Record<NavIconVariant, string> = {
	primary: 'bg-primary/10 text-primary',
	success: 'bg-emerald-500/10 text-emerald-600',
	secondary: 'bg-gray-500/10 text-gray-600',
	warning: 'bg-amber-500/10 text-amber-600',
	danger: 'bg-rose-500/10 text-rose-600',
	info: 'bg-blue-500/10 text-blue-600',
};

export interface GridNavProps {
	/** 导航标签 */
	label: string;
	/** 导航目标路径 */
	path: string;
	/** Iconify 图标类名 */
	icon?: string;
	/** 图标风格 */
	variant?: NavIconVariant;
}

/**
 * 常规矩阵结构图标导航
 * 适用于首页、个人中心等模块的核心功能入口
 */
export const GridNav = ({ label, path, icon, variant = 'primary' }: GridNavProps) => {
	return (
		<View
			className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
			onClick={() => mapsTo(path)}
		>
			<View
				className={`w-12 h-12 rounded-card ${variantMap[variant]} flex items-center justify-center`}
			>
				<View className={`${icon} w-6 h-6`} />
			</View>
			<Text className="text-xs text-text-title">{label}</Text>
		</View>
	);
};
