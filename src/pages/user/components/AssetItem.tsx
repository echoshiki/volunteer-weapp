import { View, Text } from '@tarojs/components';

/**
 * 用户资产项组件
 * @param label 资产项名称
 * @param value 资产项值
 * @param valueColor 资产项值颜色
 * @param className 容器额外样式
 * @param onClick 点击事件
 */
interface Props {
	label: string;
	value: string | number;
	valueColor?: string;
	className?: string;
	onClick?: () => void;
}

export const AssetItem = ({ label, value, valueColor, className, onClick }: Props) => (
	<View className={`flex-1 flex flex-col items-center gap-1 ${className}`} onClick={onClick}>
		<Text className={`text-lg font-bold ${valueColor || 'text-primary'}`}>{value}</Text>
		<Text className="text-sm text-black/50">{label}</Text>
	</View>
);
