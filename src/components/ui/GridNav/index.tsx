import { View, Text } from '@tarojs/components';
import { mapsTo } from '@/utils/common';

interface Props {
	/** Iconify 图标类名 */
	icon: string;
	/** 导航标签 */
	label: string;
	/** 导航目标路径 */
	path: string;
}

/**
 * 常规矩阵结构图标导航
 * 适用于首页、个人中心等模块的核心功能入口
 */
export const GridNav = ({ icon, label, path }: Props) => (
	<View
		className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
		onClick={() => mapsTo(path)}
	>
		<View
			className={`w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-primary shadow-sm`}
		>
			<View className={`${icon} w-6 h-6`} />
		</View>
		<Text className="text-xs font-medium text-text-title">{label}</Text>
	</View>
);
