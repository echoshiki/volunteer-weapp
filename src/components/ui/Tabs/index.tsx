import { View, Text, ScrollView } from '@tarojs/components';

export interface TabItem {
	label: string;
	/** 支持字符串与数字 */
	value: string | number;
}

export interface TabsProps {
	/** Tab 项列表，支持字符串或对象形式 */
	tabs: TabItem[];
	/** 当前选中 Tab 索引 */
	current: string | number;
	/** Tab 切换回调，返回索引和值 */
	onChange: (value: string | number, index: number) => void;
	/** 是否开启吸顶功能 */
	sticky?: boolean;
	/** 是否启用横向滚动，默认为 false */
	scrollable?: boolean;
	/** 激活状态文本颜色 */
	activeColor?: string;
	/** 是否有背景色 */
	hasBackground?: boolean;
}

export const Tabs = ({
	tabs,
	current,
	onChange,
	sticky = true,
	scrollable = false,
	hasBackground = true,
}: TabsProps) => {
	// 容器样式
	const containerClassName = [
		sticky && 'sticky top-0 z-10',
		hasBackground && 'bg-white border-b border-gray-100',
		!scrollable && 'flex',
	]
		.filter(Boolean)
		.join(' ');

	const tabNodes = tabs.map(({ label, value }, index) => {
		const isActive = current === value;
		return (
			<View
				key={value}
				className={`${scrollable ? 'px-6' : 'flex-1'} pt-4 pb-2 flex flex-col items-center gap-2`}
				onClick={() => onChange(value, index)}
			>
				<Text
					className={`text-sm font-medium whitespace-nowrap ${isActive ? 'text-primary' : 'text-text-title'}`}
				>
					{label}
				</Text>
				<View
					className={`h-0.5 w-8 rounded-full ${isActive ? 'bg-primary' : 'bg-transparent'}`}
				/>
			</View>
		);
	});

	if (scrollable) {
		return (
			<ScrollView
				scrollX
				scrollWithAnimation
				enhanced
				showScrollbar={false}
				className={containerClassName}
			>
				<View className="flex flex-row items-center">{tabNodes}</View>
			</ScrollView>
		);
	}

	return <View className={containerClassName}>{tabNodes}</View>;
};
