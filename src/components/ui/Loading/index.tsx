import { View, Text } from '@tarojs/components';

interface Props {
	title?: string;
	showTitle?: boolean;
}

export const Loading = ({ title, showTitle = true }: Props) => {
	return (
		<View className="size-full flex flex-col gap-5 items-center justify-center py-20">
			<View className="size-10 rounded-full border-4 border-zinc-300 border-t-transparent animate-spin" />
			{showTitle && <Text className="text-xs text-zinc-500">{title || '加载中'}</Text>}
		</View>
	);
};
