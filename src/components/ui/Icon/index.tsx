import { View, Image } from '@tarojs/components';

/** 判断是否为图片路径的工具函数 */
const isImgPath = (path: string) => {
	return path.startsWith('http') || path.startsWith('https') || path.startsWith('/') || path.startsWith('data:');
};

// 预设的高级色彩矩阵（包含外层浅色背景与内层深色图标的完美撞色组合）
const ICON_THEMES = {
	primary: 'bg-primary/10 text-primary',
	blue: 'bg-blue-50 text-blue-600',
	orange: 'bg-orange-50 text-orange-600',
	green: 'bg-green-50 text-green-600',
	red: 'bg-red-50 text-red-600',
	zinc: 'bg-zinc-100 text-zinc-600',
	slate: 'bg-slate-100 text-slate-700',
};

// 尺寸组合包（外层容器尺寸 vs 内层图标尺寸）
const ICON_SIZES = {
	sm: { container: 'size-7 rounded-sm', icon: 'size-4' },
	md: { container: 'size-10 rounded-md', icon: 'size-5.5' },
	lg: { container: 'size-14 rounded-xl', icon: 'size-8' },
};

export interface IconProps {
	/** 图标名称或图片 URL */
	icon: string;
	/** 形状：none(无外观纯图标), circle(圆形盒), square(方形圆角盒) */
	shape?: 'none' | 'circle' | 'square';
	/** 尺寸档位 */
	size?: 'sm' | 'md' | 'lg';
	/** 预设颜色主题 */
	theme?: keyof typeof ICON_THEMES;
	/** 外部自定义扩展的样式类（作用于最外层） */
	className?: string;
	/** 内部图标或图片的额外自定义样式 */
	iconClassName?: string;
}

export const Icon = ({
	icon,
	shape = 'none',
	size = 'md',
	theme = 'primary',
	className = '',
	iconClassName = '',
}: IconProps) => {
	const isImage = isImgPath(icon);

	// 如果是纯图标模式，直接轻量化返回
	if (shape === 'none') {
		return isImage ? (
			<Image src={icon} className={`mode-fit ${className}`} mode="aspectFit" />
		) : (
			<View className={`${icon} ${className}`} />
		);
	}

	// 框型/衬底复合模式
	const currentSize = ICON_SIZES[size];
	const shapeClass = shape === 'circle' ? 'rounded-full' : '';
	const themeClass = ICON_THEMES[theme];

	return (
		<View
			className={`flex justify-center items-center shrink-0 transition-transform ${currentSize.container} ${shapeClass} ${themeClass} ${className}`}
		>
			{isImage ? (
				<Image src={icon} className={`${currentSize.icon} ${iconClassName}`} mode="aspectFit" />
			) : (
				<View className={`${icon} ${currentSize.icon} ${iconClassName}`} />
			)}
		</View>
	);
};
