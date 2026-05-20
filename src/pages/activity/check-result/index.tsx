import { View, Text } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import { useState } from 'react';
import { Page, Button, Feedback } from '@/components/ui';
import { getSafeLocation } from '@/utils/location';
import { useCheckActivity } from '@/hooks/useActivity';
import { CheckActivityRes } from '@/services/activity';

type CheckStatus = 'loading' | 'success' | 'error';

export default function ActivityCheckResultPage() {
	const [status, setStatus] = useState<CheckStatus>('loading');
	const [message, setMessage] = useState('正在安全核验中，请稍候...');

	// 打卡后返回的提示数据
	const [resultData, setResultData] = useState<CheckActivityRes | null>(null);

	// 打卡 Hook
	const { mutateAsync: doCheck } = useCheckActivity();

	// 获取志愿活动 ID
	useLoad((options) => {
		let currentActivityId = '';

		// 尝试从主动路由跳转的普通参数中提取
		if (options.activityId) {
			currentActivityId = options.activityId;
		}
		// 尝试从微信“扫一扫”被动拉起的小程序码 scene 中提取
		else if (options.scene) {
			const decodedScene = decodeURIComponent(options.scene);
			if (decodedScene.includes('id=')) {
				currentActivityId = decodedScene.replace('id=', '').trim();
			}
		}

		// 如果没有提取到合法的活动 ID，直接中断并报错
		if (!currentActivityId || isNaN(Number(currentActivityId))) {
			setStatus('error');
			setMessage('无效的打卡凭证，未找到关联的志愿活动');
			return;
		}

		// 参数核验无误，启动高精度履约流水线
		executeCheckPipeline(Number(currentActivityId));
	});

	// 执行：打包参数请求后端接口
	const executeCheckPipeline = async (activityId: number) => {
		try {
			let latitude: number | undefined;
			let longitude: number | undefined;

			try {
				// 获取用户当前经纬度
				const location = await getSafeLocation();
				latitude = location.latitude;
				longitude = location.longitude;
			} catch (geoError) {
				setStatus('error');
				setMessage('定位失败，请在手机系统设置中允许获取地理位置');
				return;
			}

			// 向后端接口发送活动 ID 和用户当前经纬度
			const data = await doCheck({
				activityId,
				latitude,
				longitude,
			});

			// 状态机流转
			setResultData(data);
			setStatus('success');
		} catch (apiError: any) {
			// 接口异常捕获（如：超出 500 米地理围栏、未报名、非活动打卡时间段等）
			setStatus('error');
			setMessage(apiError?.msg || apiError?.message || '打卡失败，请联系现场工作人员');
		}
	};

	// 执行：回退上一页
	const handleBack = () => Taro.navigateBack({ delta: 1 });

	return (
		<Page className="bg-white">
			<View className="flex-1 flex flex-col items-center justify-center container-x pb-20">
				{/* 状态一：处理中 */}
				{status === 'loading' && <Feedback variant="loading" subtitle={message} />}

				{/* 状态二：履约成功 */}
				{status === 'success' && resultData && (
					<Feedback
						variant="success"
						// 自定义签到/签退的专属图标
						icon={
							resultData.actionType === 'checkIn'
								? 'icon-[ph--sign-in]'
								: 'icon-[ph--flag-checkered-fill]'
						}
						title={resultData.actionType === 'checkIn' ? '签到成功' : '签退成功'}
						subtitle={resultData.message}
						extra={
							<Button variant="primary" className="w-full" onClick={handleBack}>
								返回我的活动
							</Button>
						}
					>
						{/* 优雅地将时长卡片注入到 children 中 */}
						{resultData.actionType === 'checkOut' && resultData.duration !== null && (
							<View className="bg-primary/10 rounded-xl p-4 w-full flex flex-col items-center border border-primary/20">
								<Text className="text-xs text-primary mb-1">本次志愿服务时长</Text>
								<View className="flex items-baseline gap-1 text-primary">
									<Text className="text-4xl font-black">
										{resultData.duration}
									</Text>
									<Text className="text-sm font-bold">分钟</Text>
								</View>
							</View>
						)}
					</Feedback>
				)}

				{/* 状态三：核验失败 */}
				{status === 'error' && (
					<Feedback
						variant="error"
						title="核验失败"
						subtitle={message}
						extra={
							<Button variant="outline" className="w-full" onClick={handleBack}>
								返回重试
							</Button>
						}
					/>
				)}
			</View>
		</Page>
	);
}
