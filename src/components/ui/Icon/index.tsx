import { View, Image } from '@tarojs/components';

/** 判断是否为图片路径的工具函数 */
const isImgPath = (path: string) => {
	return (
		path.startsWith('http') ||
		path.startsWith('https') ||
		path.startsWith('/') ||
		path.startsWith('data:')
	);
};

export interface IconProps {
	/** 图标类名 */
	icon: string;
	/** 图标类名 */
	className?: string;
}

/**
 * 统一图标渲染器
 * 支持两种模式：
 * 1. 如果传入的 icon 是图片路径，则使用 Image 组件渲染。
 * 2. 否则，认为它是一个图标类名，使用 View 组件渲染。
 */
export const Icon = ({ icon, className }: IconProps) => {
	return isImgPath(icon) ? (
		<Image src={icon} className={className} mode="aspectFit" />
	) : (
		<View className={`${icon} ${className}`} />
	);
};
