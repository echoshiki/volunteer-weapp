import { View, Text } from '@tarojs/components';
import { navigateWithAuth } from '@/utils/auth';
import { OrderNavItem as OrderNavItemType } from '@/types/order';

export interface OrderNavItemProps {
	/** 通用导航项结构体 */
	nav: OrderNavItemType;
	/** 动态业务角标数值 */
	count?: number;
	/** 区分当前入口是给雇主（需求方）用，还是服务方（志愿者/机构）用 */
	viewMode: 'employer' | 'provider';
}

export const OrderNavItem = ({ nav, count = 0, viewMode }: OrderNavItemProps) => {
	const handleNavigate = () => {
		if (nav.url) {
			navigateWithAuth(nav.url);
			return;
		}
		const basePath = viewMode === 'employer' ? '/pages/order/employer/index' : '/pages/order/provider/index';
		navigateWithAuth(`${basePath}?status=${nav.value}`);
	};

	return (
		<View
			className="flex flex-col items-center gap-1 active:opacity-70 transition-opacity"
			onClick={handleNavigate}
		>
			<View className="relative">
				{/* 图标渲染 */}
				<View className={`${nav.icon} size-6 text-text-body`} />

				{/* 数字角标 */}
				{count > 0 && (
					<View className="absolute -top-1.5 -right-1.5 bg-red-500 min-w-5 h-5 px-1 rounded-full flex items-center justify-center border border-white box-border">
						<Text className="text-[10px] text-white font-bold leading-none font-num">
							{count > 99 ? '99+' : count}
						</Text>
					</View>
				)}
			</View>

			<Text className="text-xs text-text-body">{nav.label}</Text>
		</View>
	);
};
