import { View, Text, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';

/**
 * 基础空状态组件属性
 * @param type 空状态图标类型：order | search | cart | address | favorite
 * @param title 提示标题
 * @param subTitle 副标题/详细描述
 * @param buttonText 按钮文字
 * @param onButtonClick 按钮点击回调，如果不传则不显示按钮
 * @param iconClass 自定义图标类名 (优先级高于 type)
 */
interface Props {
	type?: 'order' | 'search' | 'cart' | 'address' | 'favorite' | 'good' | 'merchant' | 'default';
	title?: string;
	subTitle?: string;
	buttonText?: string;
	onButtonClick?: () => void;
	iconClass?: string;
}

// 预设不同类型的默认图片和文字
const DEFAULT_CONFIG = {
	order: { icon: 'icon-[lucide--clipboard-list]', text: '还没有相关订单' },
	search: { icon: 'icon-[lucide--search-x]', text: '没找到相关商品' },
	cart: { icon: 'icon-[lucide--shopping-cart]', text: '购物车空空如也' },
	address: { icon: 'icon-[lucide--map-pin-off]', text: '还没有收货地址' },
	favorite: { icon: 'icon-[lucide--heart-off]', text: '收藏夹还是空的' },
	good: { icon: 'icon-[lucide--package-open]', text: '没有找到相关商品' },
	merchant: { icon: 'icon-[lucide--store]', text: '没有找到相关店铺' },
	default: { icon: 'icon-[lucide--alert-circle]', text: '空空如也' },
};

export const BaseEmpty = ({
	type = 'order',
	title,
	subTitle,
	buttonText,
	onButtonClick,
	iconClass,
}: Props) => {
	const config = DEFAULT_CONFIG[type];

	return (
		<View className="min-h-84 p-10 flex flex-col gap-5 items-center animate-fade-in">
			{/* 图片部分 */}
			<View className="p-6 bg-gray-50 rounded-full">
				<View className={`w-12 h-12 bg-gold ${iconClass || config.icon}`} />
			</View>

			{/* 文字部分 */}
			<View className="flex flex-col justify-center items-center gap-1 mb-10">
				<Text className="text-lg font-bold text-title text-center">
					{title || config.text}
				</Text>

				{subTitle && (
					<Text className="text-xs text-subtitle text-center px-6 leading-relaxed">
						{subTitle}
					</Text>
				)}
			</View>

			{/* 动作按钮 */}
			{buttonText && onButtonClick && (
				<Button
					className="m-0 px-10 h-10 rounded-full bg-gold text-white text-sm flex items-center shadow-lg shadow-gold/20 active:scale-95 transition-all"
					onClick={onButtonClick}
				>
					{buttonText}
				</Button>
			)}
		</View>
	);
};
