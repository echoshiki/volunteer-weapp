import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { useAuthStore } from '@/store/auth';
import { useLogin } from '@/hooks/useLogin';
import { useUser } from '@/hooks/useUser';
import { Avatar, ColumnNav, Page, Cell } from '@/components/ui';
import { UserIdentityBadge, OrderNavItem } from '@/components/biz';
import { doGlobalScan } from '@/utils/scan';
import { mapsTo } from '@/utils/common';
import { ORDER_NAV_ITEMS } from '@/constants/order';
import { Icon } from '@/components/ui/Icon';
import { navigateWithAuth } from '@/utils/auth';

const VOLUNTEER_MENUS = [
	{
		label: '我的报名',
		icon: 'icon-[ph--star-light]',
		theme: 'red' as const,
		url: '/pages/user/activity/index',
	},
	{
		label: '我的报价',
		icon: 'icon-[ph--hand-coins-light]',
		theme: 'orange' as const,
		url: '/pages/user/bid/index',
	},
	{
		label: '服务订单',
		icon: 'icon-[ph--clipboard-text-light]',
		theme: 'blue' as const,
		url: '/pages/order/provider/index',
	},
	{
		label: '现场打卡',
		icon: 'icon-[ph--scan-light]',
		theme: 'green' as const,
		handler: () => doGlobalScan(),
	},
];

const INSITUTION_MENUS = [
	{
		label: '我的报价',
		icon: 'icon-[ph--hand-coins-light]',
		theme: 'orange' as const,
		url: '/pages/user/bid/index',
	},
	{
		label: '服务订单',
		icon: 'icon-[ph--clipboard-text-light]',
		theme: 'blue' as const,
		url: '/pages/order/provider/index',
	},
];

export default function UserPage() {
	const { userInfo } = useAuthStore();
	const { isLoggedIn, onLogout } = useLogin();
	const indentity = userInfo?.identity;

	// 挂载更新用户信息
	const { refetch } = useUser();
	useDidShow(() => {
		if (isLoggedIn) refetch().catch((err) => console.error('用户中心同步最新身份失败:', err));
	});

	return (
		<Page hasTabBar>
			<View className="bg-zinc-200 h-42 pt-8 px-6">
				<View className="flex items-center gap-4">
					{/* 用户头像 */}
					<View className="border-8 border-white rounded-full">
						<Avatar
							src={isLoggedIn ? userInfo?.avatar : ''}
							name={isLoggedIn ? userInfo?.nickName : '游客'}
							size="lg"
						/>
					</View>

					{/* 用户信息 */}
					<View className="flex-1">
						{isLoggedIn && userInfo ? (
							<View className="flex flex-col">
								<View className="flex items-center gap-2">
									<Text className="text-lg font-bold text-text-title block">{userInfo.nickName}</Text>
									<UserIdentityBadge value={userInfo.identity} />
								</View>
								<View className="flex items-center gap-1 text-xs text-text-muted mt-1">
									<View className="flex items-center gap-1 mt-0.5">
										<View className="icon-[ph--device-mobile-thin] size-3.5" />
										<Text className="text-xs text-text-muted">
											{userInfo?.phonenumber || '暂无手机号'}
										</Text>
									</View>
								</View>
							</View>
						) : (
							<View onClick={() => !isLoggedIn && mapsTo('/pages/login/index')}>
								<Text className="text-xl font-bold text-white">点击登录</Text>
								<Text className="text-sm text-white/50 block mt-1">登录发现更多精彩</Text>
							</View>
						)}
					</View>

					{/* 设置按钮 */}
					{isLoggedIn && (
						<View
							className="icon-[ph--gear] w-6 h-6 text-text-title"
							onClick={() => navigateWithAuth('/pages/user/profile/index')}
						/>
					)}
				</View>
			</View>

			<View className="px-4 -mt-10 flex flex-col gap-4">
				<Cell className="grid grid-cols-5">
					{ORDER_NAV_ITEMS.map((item) => (
						<OrderNavItem key={item.value} nav={item} viewMode="employer" />
					))}
				</Cell>

				{(indentity === 'volunteer' || indentity === 'institution') && (
					<Cell className="grid grid-cols-4 gap-4">
						{indentity === 'volunteer' &&
							VOLUNTEER_MENUS.map((menu) => (
								<View
									key={menu.label}
									className="flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform"
									onClick={() => (menu.handler ? menu.handler() : mapsTo(menu.url!))}
								>
									<Icon icon={menu.icon} shape="square" size="md" theme={menu.theme} />
									<Text className="text-xs text-text-title">{menu.label}</Text>
								</View>
							))}

						{indentity === 'institution' &&
							INSITUTION_MENUS.map((menu) => (
								<View
									key={menu.label}
									className="flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform"
									onClick={() => mapsTo(menu.url)}
								>
									<Icon icon={menu.icon} shape="square" size="md" theme={menu.theme} />
									<Text className="text-xs text-text-title">{menu.label}</Text>
								</View>
							))}
					</Cell>
				)}

				{/* 功能列表区域 */}
				<Cell className="px-2 py-1">
					{/* 服务管理模块 */}
					<ColumnNav
						icon="icon-[ph--clipboard-text-light]"
						label="我的需求"
						onClick={() => navigateWithAuth('/pages/user/demand/index')}
					/>
					<ColumnNav
						icon="icon-[ph--user-focus-light]"
						label="我的求职"
						onClick={() => navigateWithAuth('/pages/user/job/index')}
					/>
					<ColumnNav
						icon="icon-[ph--clipboard-text-light]"
						label="我的简历"
						onClick={() => navigateWithAuth('/pages/user/resume/index?mode=view')}
					/>
					<ColumnNav
						icon="icon-[ph--user-gear-light]"
						label="个人资料"
						onClick={() => navigateWithAuth('/pages/user/profile/index')}
					/>
					<ColumnNav
						icon="icon-[ph--shield-warning-light]"
						label="实名认证"
						extra={userInfo?.reviewId ? '已认证' : '未认证'}
						onClick={() => navigateWithAuth('/pages/apply/index')}
					/>
					<ColumnNav icon="icon-[ph--question]" label="帮助与反馈" />

					{/* 退出按钮 */}
					{isLoggedIn && (
						<View
							className="p-4 flex items-center justify-center active:bg-red-50 transition-colors"
							onClick={() => {
								Taro.showModal({
									title: '提示',
									content: '确定要退出当前账户吗？',
									success: (res) => res.confirm && onLogout(),
								});
							}}
						>
							<View className="icon-[ph--sign-out-light] w-5 h-5 text-primary mr-2" />
							<Text className="text-sm text-primary font-bold">退出登录</Text>
						</View>
					)}
				</Cell>
			</View>
		</Page>
	);
}
