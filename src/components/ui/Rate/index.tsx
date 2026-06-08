import { View, Text } from '@tarojs/components';

interface RateProps {
	/** 当前分数 */
	value: number;
	/** 最大分数，默认 5 */
	max?: number;
	/** 标签文字，如果不传则不显示 */
	label?: string;
	/** 评价文案数组，例如 ['非常差', '一般', '非常好'] */
	texts?: string[];
	/** 是否只读，默认 false */
	readonly?: boolean;
	/** 改变时的回调 */
	onChange?: (val: number) => void;
	/** 星星大小，默认 6 */
	size?: number;
}

export const Rate = ({
	value,
	max = 5,
	label,
	texts = ['', '非常差', '差', '一般', '满意', '非常满意'],
	readonly = false,
	onChange,
	size = 6,
}: RateProps) => {
	const stars = Array.from({ length: max }, (_, i) => i + 1);

	const handleToggle = (num: number) => {
		if (readonly || !onChange) return;
		onChange(num);
	};

	return (
		<View className="flex justify-start items-center gap-4">
			{label && <Text className="text-sm text-title w-16">{label}</Text>}

			<View className={`flex items-center gap-${size / 3} ${readonly && 'cursor-default'}`}>
				{stars.map((num) => (
					<View
						key={num}
						onClick={() => handleToggle(num)}
						className={`icon-[ph--star-fill] w-${size} h-${size} transition-all duration-200 ${
							num <= value ? 'text-primary' : 'text-gray-200'
						}`}
					/>
				))}
			</View>

			{/* 显示评价文案 */}
			{!readonly && texts[value] && (
				<Text className="text-sm text-gold ml-2 animate-fade-in">{texts[value]}</Text>
			)}
		</View>
	);
};
