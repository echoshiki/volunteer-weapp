import { View, Text } from '@tarojs/components';
import { mapsTo } from '@/utils/common';
import { Icon } from '../Icon';

type HeadingSize = 'sm' | 'md' | 'lg';

const sizeMap: Record<HeadingSize, { bar: string; icon: string; text: string; margin: string }> = {
	sm: { bar: 'w-1 h-4', icon: 'size-4', text: 'text-sm', margin: 'mb-3' },
	md: { bar: 'w-1 h-5', icon: 'size-5', text: 'text-base', margin: 'mb-3' },
	lg: { bar: 'w-1.5 h-6 rounded-md', icon: 'size-6', text: 'text-lg', margin: 'mb-6' },
};

export interface HeadingProps {
	/** 标题文字 */
	title: string;
	/** 描述文字 */
	subtitle?: string;
	/** 主题色，TailwindCSS 文本色值 */
	color?: string;
	/** 标题大小 */
	size?: HeadingSize;
	/** Iconify 图标类名（传入后将替代左侧的竖条） */
	icon?: string;
	/** 右侧“查看更多”链接配置 */
	link?: { name: string; url: string };
	/** 右侧扩展区（传入此项会覆盖 link）*/
	extra?: React.ReactNode;
	className?: string;
}

/**
 * 通用区块标题
 */
export const Heading = ({
	title,
	subtitle,
	color = 'text-primary',
	size = 'lg',
	icon,
	link,
	extra,
	className,
}: HeadingProps) => {
	const sizeConfig = sizeMap[size];

	return (
		<View className={`w-full flex justify-between items-center ${sizeConfig.margin} ${className}`}>
			{/* 左侧：装饰与标题 */}
			<View>
				<View className="flex items-center gap-2">
					<View className={`flex items-center justify-center ${color}`}>
						{icon ? (
							<Icon icon={icon} className={`${sizeConfig.icon} text-current`} />
						) : (
							<View className={`${sizeConfig.bar} bg-current rounded-full`} />
						)}
					</View>

					{/* 标题文本动态样式 */}
					<Text className={`text-text-title font-bold ${sizeConfig.text}`}>{title}</Text>
				</View>
				{subtitle && <Text className="text-xs text-text-muted mt-1">{subtitle}</Text>}
			</View>

			{/* 右侧：跳转链接 */}
			<View className="flex items-center shrink-0 ml-4">
				{extra
					? extra
					: link && (
							<View
								className="text-sm flex justify-end items-center gap-1"
								onClick={() => mapsTo(link.url)}
							>
								<Text className="text-text-muted text-xs">{link.name}</Text>
								<View className="icon-[ph--caret-right] size-4 text-zinc-500" />
							</View>
						)}
			</View>
		</View>
	);
};
