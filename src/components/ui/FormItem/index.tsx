import { View, Text } from '@tarojs/components';
import { ReactNode } from 'react';

export interface FormItemProps {
	/** 左侧标签文字 */
	label: string;
	/** 右侧表单内容 */
	children: ReactNode;
	/** 是否显示底部边框 */
	border?: boolean;
	/** 点击事件 */
	onClick?: () => void;
	/** 底部辅助说明文字 */
	helper?: string | ReactNode;
	/** 是否必填（展示红星） */
	required?: boolean;
	/** 布局方式 */
	layout?: 'row' | 'column';
	/** 容器附加样式 */
	className?: string;
}

/**
 * 表单项组件
 */
export const FormItem = ({
	label,
	children,
	border = true,
	onClick,
	helper,
	required = false,
	layout = 'row',
	className = '',
}: FormItemProps) => {
	const isColumn = layout === 'column';

	return (
		<View
			className={`flex flex-col justify-center min-h-12 py-2 ${border ? 'border-b border-gray-100' : ''}`}
			onClick={onClick}
		>
			<View
				className={`flex w-full ${isColumn ? 'flex-col gap-4' : 'flex-row justify-between items-center'}`}
			>
				{/* Label */}
				<View className="flex items-center shrink-0 mr-4">
					{required && <Text className="text-red-500 mr-1 mt-0.5">*</Text>}
					<Text className="text-sm text-text-title">{label}</Text>
				</View>

				<View
					className={`${isColumn ? 'w-full' : 'flex-1 flex justify-end items-center min-w-0 text-right'} ${className}`}
				>
					{children}
				</View>
			</View>

			{helper && (
				<View className="mt-1.5">
					{typeof helper === 'string' ? (
						<Text className="text-xs text-text-muted leading-normal">{helper}</Text>
					) : (
						helper
					)}
				</View>
			)}
		</View>
	);
};
