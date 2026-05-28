import { View, Text } from '@tarojs/components';

export interface LoadingProps {
	/** 加载说明文字 */
	title?: string;
	/** 是否显示加载说明文字 */
	showTitle?: boolean;
}

/**
 * 加载状态组件
 */
export const Loading = ({ title, showTitle = true }: LoadingProps) => {
	return (
		<View className="size-full flex flex-col gap-2 items-center justify-center ">
			<View className="size-8 icon-[ph--arrow-clockwise-light] animate-spin text-zinc-500" />
			{showTitle && <Text className="text-xs text-zinc-500 ">{title || '加载中'}</Text>}
		</View>
	);
};
