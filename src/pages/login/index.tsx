import { View, Text, Button } from '@tarojs/components';
import { useLogin } from '@/hooks/useLogin';

const LoginPage = () => {
	const { authStage, onManualLogin, onBindPhone } = useLogin();

	return (
		<View className="min-h-screen bg-white px-8 pt-20 flex flex-col items-center">
			<View className="mb-12 text-center">
				<View className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-6 shadow-lg shadow-blue-200 flex items-center justify-center">
					<Text className="text-white text-4xl font-bold">V</Text>
				</View>
				<Text className="text-2xl font-bold text-gray-900 block">欢迎加入</Text>
				<Text className="text-gray-400 mt-2 block italic">让每一份爱心都有回响</Text>
			</View>

			<View className="w-full space-y-4">
				{/* 第一阶段：静默预检未通过，先拿 UUID */}
				{authStage === 'UNLOGIN' && (
					<Button
						className="w-full bg-blue-600 text-white rounded-full py-2 font-medium active:opacity-80"
						onClick={onManualLogin}
					>
						微信一键登录
					</Button>
				)}

				{/* 第二阶段：已拿 UUID，等手机号解密注册 */}
				{authStage === 'NEED_BIND_PHONE' && (
					<View className="animate-fade-in">
						<View className="bg-blue-50 p-4 rounded-xl mb-6">
							<Text className="text-sm text-blue-700 leading-relaxed">
								为了保障服务安全与真实性，请授权绑定您的手机号完成最后一步注册。
							</Text>
						</View>
						<Button
							className="w-full bg-green-500 text-white rounded-full py-2 font-medium active:opacity-80"
							openType="getPhoneNumber"
							onGetPhoneNumber={onBindPhone}
						>
							授权手机号并绑定
						</Button>
					</View>
				)}
			</View>

			<View className="mt-auto pb-10">
				<Text className="text-xs text-gray-400">
					登录即代表同意 <Text className="text-blue-500">《用户协议》</Text> 与{' '}
					<Text className="text-blue-500">《隐私政策》</Text>
				</Text>
			</View>
		</View>
	);
};

export default LoginPage;
