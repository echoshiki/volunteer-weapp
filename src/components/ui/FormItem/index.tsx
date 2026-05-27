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
	/** 容器附加样式 */
	className?: string;
}

export const FormItem = ({
	label,
	children,
	border = true,
	onClick,
	helper,
	required = false,
	className = '',
}: FormItemProps) => {
	return (
		<View
			className={`flex flex-col justify-center min-h-14 py-3 ${border ? 'border-b border-slate-50' : ''} ${className}`}
			onClick={onClick}
		>
			{/* 上半部分：主体内容行 */}
			<View className="flex justify-between items-center w-full">
				{/* 左侧 Label 区 */}
				<View className="flex items-center shrink-0 mr-4">
					{required && <Text className="text-red-500 mr-1 mt-0.5">*</Text>}
					<Text className="text-sm text-text-title">{label}</Text>
				</View>

				{/* 右侧 Children 区 */}
				<View className="flex-1 flex justify-end items-center min-w-0 h-full w-full">
					{children}
				</View>
			</View>

			{/* 下半部分：Helper 辅助文字 */}
			{helper && (
				<View className="mt-1.5">
					<Text className="text-xs text-text-muted leading-normal">{helper}</Text>
				</View>
			)}
		</View>
	);
};
