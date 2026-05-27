import { View, Text } from '@tarojs/components';
import { Cell } from '@/components/ui/Cell';
import { mapsTo } from '@/utils/common';

// 主题色映射表
const THEME_MAP = {
	blue: {
		bg: 'bg-linear-to-br from-blue-100 via-white to-white border-blue-200',
		iconBg: 'bg-blue-100 text-blue-600',
		arrowBg: 'bg-blue-100/50 text-blue-600',
		decorText: 'text-blue-600',
	},
	orange: {
		bg: 'bg-linear-to-br from-orange-100 via-white to-white border-orange-200',
		iconBg: 'bg-orange-100 text-orange-600',
		arrowBg: 'bg-orange-100/50 text-orange-600',
		decorText: 'text-orange-600',
	},
	green: {
		bg: 'bg-linear-to-br from-green-100 via-white to-white border-green-200',
		iconBg: 'bg-green-100 text-green-600',
		arrowBg: 'bg-green-100/50 text-green-600',
		decorText: 'text-green-600',
	},
};

export interface EntryCardProps {
	/** 标题 */
	title: string;
	/** 描述文案 */
	desc: string;
	/** Ph 图标类名，例如 'icon-[ph--user-focus-duotone]' */
	icon: string;
	/** 点击跳转的目标路由 */
	url: string;
	/** 主题色调 */
	theme?: keyof typeof THEME_MAP;
	/** 是否置灰禁用（比如用户已经在审核中，禁止重复点击） */
	disabled?: boolean;
}

export const EntryCard = ({
	title,
	desc,
	icon,
	url,
	theme = 'blue',
	disabled = false,
}: EntryCardProps) => {
	const activeTheme = THEME_MAP[theme];

	const handleClick = () => {
		if (disabled) return;
		mapsTo(url);
	};

	return (
		<Cell
			clickable={!disabled}
			className={`p-6 relative overflow-hidden border ${activeTheme.bg} ${
				disabled ? 'opacity-50 grayscale pointer-events-none' : ''
			}`}
			onClick={handleClick}
		>
			{/* 左侧主体内容区 */}
			<View className="relative z-10 flex flex-col gap-2.5 w-2/3">
				<View
					className={`size-10 rounded-full flex justify-center items-center ${activeTheme.iconBg}`}
				>
					<View className={`${icon} size-6`} />
				</View>

				<View className="flex flex-col gap-1">
					<Text className="text-lg font-bold text-text-title tracking-wide">{title}</Text>
					<Text className="text-xs text-text-body leading-relaxed">{desc}</Text>
				</View>
			</View>

			{/* 右侧轻量级引导箭头 */}
			<View className="absolute right-6 top-1/2 -translate-y-1/2 z-10">
				<View
					className={`size-8 rounded-full flex justify-center items-center active:scale-90 transition-transform ${activeTheme.arrowBg}`}
				>
					<View className="icon-[ph--caret-right-bold] size-4" />
				</View>
			</View>

			{/* 大背景装饰 Icon */}
			<View
				className={`absolute -right-6 -bottom-6 opacity-[0.05] pointer-events-none ${activeTheme.decorText}`}
			>
				<View className={`${icon} size-36`} />
			</View>
		</Cell>
	);
};
