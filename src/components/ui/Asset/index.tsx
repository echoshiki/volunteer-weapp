import { View, Text } from '@tarojs/components';

interface Props {
	/** 资产项名称 */
	label: string;
	/** 产项值 */
	value: string | number;
	/** 资产项值颜色 */
	valueColor?: string;
	/** 容器额外样式 */
	className?: string;
	/** 点击事件 */
	onClick?: () => void;
}

export const Asset = ({ label, value, valueColor, className, onClick }: Props) => (
	<View className={`flex-1 flex flex-col items-center gap-1 ${className}`} onClick={onClick}>
		<Text className={`text-lg font-bold ${valueColor || 'text-primary'}`}>{value}</Text>
		<Text className="text-sm text-black/50">{label}</Text>
	</View>
);
