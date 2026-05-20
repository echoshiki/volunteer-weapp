import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { useAuthStore } from '@/store/auth';
import { useLogin } from '@/hooks/useLogin';
import { useUser } from '@/hooks/useUser';
import { Avatar, Asset, ColumnNav } from '@/components/ui';
import { mapsTo } from '@/utils/common';
import { UserIdentityBadge } from '@/components/biz/BizBadge';
import { doGlobalScan } from '@/utils/scan';

export default function UserPage() {
	const { userInfo } = useAuthStore();
	const { isLoggedIn, onLogout } = useLogin();

	// 挂载更新用户信息
	useUser();

	return (
		<View className="min-h-screen bg-main-bg">
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
										<View className="icon-[ph--device-mobile-thin] size-3" />
										<Text className="text-xs text-text-muted">
											{userInfo?.phonenumber || '暂无手机号'}
										</Text>
									</View>
									<View className="flex items-center gap-1 mt-0.5">
										<View className="icon-[ph--map-pin-thin] size-3" />
										<Text className="text-xs text-text-muted">
											{userInfo?.regionName || '未绑定社区'}
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
				<View className="bg-white rounded-lg px-4 py-6 shadow-sm flex items-center">
					<Asset label="我的积分" value={userInfo?.points || 0} />
					<View className="w-px h-8 bg-slate-100" />
					<Asset
						label="志愿时长"
						value={userInfo?.duration || 0}
						onClick={() => mapsTo('/pages/user/coupons/index')}
					/>
				</View>

				{/* 功能列表区域 */}
				<View className="space-y-4 pb-10">
					{/* 服务管理模块 */}
					<View className="bg-white rounded-card overflow-hidden">
						<ColumnNav
							icon="icon-[ph--clipboard-text-light]"
							label="我的服务订单"
							onClick={() => mapsTo('/pages/demand/my/index')}
						/>
						<ColumnNav
							icon="icon-[ph--star-light]"
							label="我的志愿活动"
							onClick={() => mapsTo('/pages/user/activity/index')}
						/>
						<ColumnNav
							icon="icon-[ph--user-focus-light]"
							label="我的求职意向"
							onClick={() => mapsTo('/pages/job/my/index')}
						/>
						<ColumnNav
							icon="icon-[ph--scan-light]"
							label="现场扫码打卡"
							onClick={doGlobalScan}
						/>
					</View>

					{/* 设置与账号模块 */}
					<View className="bg-white rounded-card overflow-hidden">
						<ColumnNav
							icon="icon-[ph--user-gear-light]"
							label="个人资料"
							onClick={() => mapsTo('/pages/user/profile/index')}
						/>
						<ColumnNav
							icon="icon-[ph--shield-warning-light]"
							label="实名认证"
							extra={userInfo?.reviewId ? '已认证' : '未认证'}
							onClick={() => mapsTo('/pages/user/auth/index')}
						/>
						<ColumnNav icon="icon-[ph--question]" label="帮助与反馈" />
					</View>

					{/* 退出按钮 */}
					{isLoggedIn && (
						<View
							className="bg-white rounded-card p-4 flex items-center justify-center active:bg-red-50 transition-colors"
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
				</View>
			</View>
		</View>
	);
}
