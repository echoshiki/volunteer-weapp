import { View, Text } from '@tarojs/components';
import { ReactNode } from 'react';

export interface DescriptionProps {
	/** 标签文字 */
	label: string;
	/** 内容（可以是字符串或 React 节点） */
	value: ReactNode;
	/** 标签和内容水平对齐方式 */
	variant?: 'between' | 'start';
	/** 标签和内容垂直对齐方式 */
	align?: 'start' | 'center' | 'end';
	/** 内容颜色 */
	valueTextClass?: string;
	/** 标签颜色 */
	labelTextClass?: string;
	/** 标签宽度 */
	labelWidth?: string;
	/** 自定义样式类 */
	className?: string;
}

/**
 * 描述项组件属性
 * 左右结构的描述项，常用于规格参数描述表格块
 */
export const Description = ({
	label,
	value,
	variant = 'start',
	align = 'start',
	labelWidth = 'w-20',
	valueTextClass = 'text-text-title',
	labelTextClass = 'text-text-muted',
	className = '',
}: DescriptionProps) => {
	// 组装容器样式类
	const flexJustityClass = variant === 'between' ? 'justify-between' : 'justify-start';
	const flexAlignClass = align === 'start' ? 'items-start' : 'items-end';
	const containerClass = `text-sm flex ${flexJustityClass} ${flexAlignClass} ${className}`;

	const isSimpleText = typeof value === 'string' || typeof value === 'number';
	const labelClass = `${labelTextClass} shrink-0 ${variant === 'start' ? labelWidth : ''}`;
	const valueClass = `flex-1 ${variant === 'between' ? 'text-right' : 'text-left'} ${valueTextClass}`;

	return (
		<View className={`${containerClass} ${className}`}>
			{/* 标签部分 */}
			<Text className={labelClass}>{label}</Text>

			{/* 内容部分 */}
			{isSimpleText ? (
				<Text
					className={`line-clamp-3 ${
						variant === 'between' ? 'text-right' : 'text-left'
					} ${valueClass}`}
				>
					{value}
				</Text>
			) : (
				<View className={valueClass}>{value}</View>
			)}
		</View>
	);
};
