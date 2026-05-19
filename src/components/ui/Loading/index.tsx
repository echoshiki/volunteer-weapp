import { View, Text } from '@tarojs/components';

interface Props {
	label?: string;
	showLabel?: boolean;
}

export const Loading = ({ label, showLabel = true }: Props) => {
	return (
		<View className="size-full flex flex-col gap-5 items-center justify-center py-10">
			<View className="size-10 rounded-full border-4 border-zinc-300 border-t-transparent animate-spin" />
			{showLabel && <Text className="text-xs text-zinc-500">{label || '加载中'}</Text>}
		</View>
	);
};
