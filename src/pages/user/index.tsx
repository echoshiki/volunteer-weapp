import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { useAuthStore } from '@/store/auth';
import { useLogin } from '@/hooks/useLogin';
import { useUser } from '@/hooks/useUser';
import { Avatar, Asset, ColumnNav, Page, Cell } from '@/components/ui';
import { UserIdentityBadge, OrderNavItem } from '@/components/biz';
import { doGlobalScan } from '@/utils/scan';
import { mapsTo } from '@/utils/common';
import { ORDER_NAV_ITEMS } from '@/constants/order';

export default function UserPage() {
	const { userInfo } = useAuthStore();
	const { isLoggedIn, onLogout } = useLogin();

	// 挂载更新用户信息
	useUser();

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
									<Text className="text-lg font-bold text-text-title block">
										{userInfo.nickName}
									</Text>
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
								<Text className="text-sm text-white/50 block mt-1">
									登录发现更多精彩
								</Text>
							</View>
						)}
					</View>

					{/* 设置按钮 */}
					{isLoggedIn && (
						<View
							className="icon-[ph--gear] w-6 h-6 text-text-title"
							onClick={() => mapsTo('/pages/user/profile/index')}
						/>
					)}
				</View>
			</View>

			<View className="px-4 -mt-10 flex flex-col gap-4">
				<Cell className="flex items-center">
					<Asset label="我的积分" value={userInfo?.points || 0} />
					<View className="w-px h-8 bg-slate-100" />
					<Asset
						label="志愿时长"
						value={userInfo?.duration || 0}
						onClick={() => mapsTo('/pages/user/coupons/index')}
					/>
				</Cell>

				<Cell className="grid grid-cols-5">
					{ORDER_NAV_ITEMS.map((item) => (
						<OrderNavItem key={item.value} nav={item} viewMode="employer" />
					))}
				</Cell>

				{/* 功能列表区域 */}
				<Cell className="px-2 py-1">
					{/* 服务管理模块 */}
					<ColumnNav
						icon="icon-[ph--star-light]"
						label="我报名的活动"
						onClick={() => mapsTo('/pages/user/activity/index')}
					/>
					<ColumnNav
						icon="icon-[ph--clipboard-text-light]"
						label="我发布的需求"
						onClick={() => mapsTo('/pages/user/demand/index')}
					/>
					<ColumnNav
						icon="icon-[ph--clipboard-text-light]"
						label="我发布的报价"
						onClick={() => mapsTo('/pages/user/bid/index')}
					/>
					<ColumnNav
						icon="icon-[ph--clipboard-text-light]"
						label="我服务的订单"
						onClick={() => mapsTo('/pages/order/provider/index')}
					/>
					<ColumnNav
						icon="icon-[ph--user-focus-light]"
						label="我应聘的岗位"
						onClick={() => mapsTo('/pages/user/job/index')}
					/>
					<ColumnNav
						icon="icon-[ph--clipboard-text-light]"
						label="我创建的简历"
						onClick={() => mapsTo('/pages/user/resume/index?mode=view')}
					/>
					<ColumnNav
						icon="icon-[ph--scan-light]"
						label="现场扫码打卡"
						onClick={doGlobalScan}
					/>

					<ColumnNav
						icon="icon-[ph--user-gear-light]"
						label="个人资料"
						onClick={() => mapsTo('/pages/user/profile/index')}
					/>
					<ColumnNav
						icon="icon-[ph--shield-warning-light]"
						label="实名认证"
						extra={userInfo?.reviewId ? '已认证' : '未认证'}
						onClick={() => mapsTo('/pages/apply/index')}
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
