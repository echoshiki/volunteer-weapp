import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAuthStore } from '@/store/auth';
import { useLogin } from '@/hooks/useLogin';

const UserPage = () => {
	const { userInfo } = useAuthStore();
	const { isLoggedIn, onLogout } = useLogin();

	const goLogin = () => Taro.navigateTo({ url: '/pages/login/index' });

	return (
		<View className="min-h-screen bg-gray-50">
			{/* 头部卡片 */}
			<View
				className="bg-white p-6 flex items-center shadow-sm"
				onClick={!isLoggedIn ? goLogin : undefined}
			>
				<Image
					className="w-16 h-16 rounded-full bg-gray-200"
					src={
						userInfo?.avatar ||
						'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
					}
				/>
				<View className="ml-4 flex-1">
					{isLoggedIn ? (
						<View>
							<View className="flex items-center">
								<Text className="text-xl font-bold text-gray-800">
									{userInfo?.nickName}
								</Text>
								<Text className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded">
									{userInfo?.identity === 'volunteer' ? '志愿者' : '普通用户'}
								</Text>
							</View>
							<Text className="text-sm text-gray-500 mt-1">
								ID: {userInfo?.userId}
							</Text>
						</View>
					) : (
						<Text className="text-lg font-medium text-blue-600">点击登录账户</Text>
					)}
				</View>
				{!isLoggedIn && <View className="text-gray-400 text-xl font-bold">{'>'}</View>}
			</View>

			{/* 统计栏 */}
			{isLoggedIn && (
				<View className="flex bg-white mt-2 py-4 border-t border-b">
					<View className="flex-1 flex flex-col items-center border-r">
						<Text className="text-lg font-bold text-orange-500">
							{userInfo?.points || 0}
						</Text>
						<Text className="text-xs text-gray-500">积分</Text>
					</View>
					<View className="flex-1 flex flex-col items-center">
						<Text className="text-lg font-bold text-green-500">
							{userInfo?.duration || 0}
						</Text>
						<Text className="text-xs text-gray-500">时长 (h)</Text>
					</View>
				</View>
			)}

			{/* 操作列表 */}
			<View className="mt-4 px-4">
				{isLoggedIn && (
					<Button
						className="w-full bg-white text-red-500 border-none rounded-lg py-1"
						onClick={onLogout}
					>
						退出登录
					</Button>
				)}
			</View>
		</View>
	);
};

export default UserPage;
