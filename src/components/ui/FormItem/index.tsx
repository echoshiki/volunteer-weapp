import { View, Text } from '@tarojs/components';

export const FormItem = ({ label, children, border = true, onClick }: any) => (
	<View
		className={`flex justify-between items-center h-14 ${border ? 'border-b border-slate-50' : ''}`}
		onClick={onClick}
	>
		<Text className="text-sm text-text-title">{label}</Text>
		<View className="flex-1 flex justify-end items-center h-full">{children}</View>
	</View>
);
