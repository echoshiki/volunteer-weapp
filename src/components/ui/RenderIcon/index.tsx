import { View, Text, Image } from '@tarojs/components';
import { mapsTo } from '@/utils/common';

/** 判断是否为图片路径的工具函数 */
const isImgPath = (path: string) => {
	return (
		path.startsWith('http') ||
		path.startsWith('https') ||
		path.startsWith('/') ||
		path.startsWith('data:')
	);
};

/**
 * 统一图标渲染器
 * 支持两种模式：
 * 1. 如果传入的 icon 是图片路径，则使用 Image 组件渲染。
 * 2. 否则，认为它是一个图标类名，使用 View 组件渲染。
 */
export const RenderIcon = ({ icon, className }: { icon: string; className: string }) => {
	if (isImgPath(icon)) {
		return <Image src={icon} className={className} mode="aspectFit" />;
	}
	return <View className={`${icon} ${className}`} />;
};
