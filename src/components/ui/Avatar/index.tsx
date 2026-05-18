import { View, Text, Image } from '@tarojs/components';
import { useState } from 'react';

interface Props {
	/** 头像图片地址 */
	src?: string;
	/** 头像名称，用于显示首字母 */
	name?: string;
	/** 头像尺寸 */
	size?: 'sm' | 'md' | 'lg' | 'xl';
	/** 自定义类名 */
	className?: string;
}

/** 预设配色方案 */
const BG_COLORS = [
	'bg-blue-400',
	'bg-emerald-400',
	'bg-violet-400',
	'bg-amber-400',
	'bg-rose-400',
	'bg-indigo-400',
	'bg-cyan-400',
];

/**
 * 基础头像组件
 * 在无头像时显示首字母
 */
export const BaseAvatar = ({ src, name = 'U', size = 'md', className = '' }: Props) => {
	const [isError, setIsError] = useState(false);

	// 尺寸映射
	const sizeClasses = {
		sm: 'w-8 h-8 text-xs',
		md: 'w-12 h-12 text-sm',
		lg: 'w-16 h-16 text-base',
		xl: 'w-20 h-20 text-xl',
	};

	// 根据名称计算一个固定的背景色（保证同一个人的颜色是一样的）
	const getBgColor = (str: string) => {
		const charCodeSum = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return BG_COLORS[charCodeSum % BG_COLORS.length];
	};

	// 获取展示字符：取第一个字符，若是英文则转大写
	const displayChar = name.charAt(0).toUpperCase();

	return (
		<View
			className={`rounded-full overflow-hidden flex items-center justify-center shrink-0 border-2 border-white/10 ${sizeClasses[size]} ${className}`}
		>
			{src && !isError ? (
				<Image
					src={src}
					className="w-full h-full"
					mode="aspectFill"
					onError={() => setIsError(true)}
				/>
			) : (
				<View
					className={`w-full h-full flex items-center justify-center ${getBgColor(name)}`}
				>
					<Text className="text-white font-black">{displayChar}</Text>
				</View>
			)}
		</View>
	);
};
