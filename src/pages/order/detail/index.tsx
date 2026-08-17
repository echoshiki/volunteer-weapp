import { useState } from 'react';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import { Page, Cell, Heading, Divider, Button, Loading, Empty, Description, ImageUploader } from '@/components/ui';
import { useOrderDetail, useOrderActions, useOrderTrajectoryList } from '@/hooks/useOrder';
import { EmployerActions, ProviderActions, UserIdentityBadge } from '@/components/biz';
import { getOrderDetailTip, ORDER_STATUS_MAP } from '@/constants/order';
import { useUpload } from '@/hooks/useUpload';
import { useAuthStore } from '@/store/auth';
import { mapsTo } from '@/utils/common';

export default function OrderDetailPage() {
	const { params } = useRouter();
	const orderId = params.id || '';
	const initialAction = params.action || '';
	const [refreshing, setRefreshing] = useState(false);
	// 打卡弹窗状态控制与图片临时缓存
	const [punchModalType, setPunchModalType] = useState<'arrived' | 'completed' | null>(null);
	const [punchImages, setPunchImages] = useState<string[]>([]);

	// 数据：订单详情数据、订单服务轨迹
	const { data: order, isLoading: isDetailLoading, refetch: refetchDetail } = useOrderDetail(orderId);

	const {
		data: trajectoryData,
		isLoading: isTrajectoryLoading,
		refetch: refetchTrajectory,
	} = useOrderTrajectoryList(orderId);

	// 页面切回前台时自动刷新
	useDidShow(() => {
		if (orderId) {
			refetchDetail();
			refetchTrajectory();
		}
	});

	// 下拉刷新
	const handleRefresh = async () => {
		setRefreshing(true);
		try {
			await Promise.all([refetchDetail(), refetchTrajectory()]);
		} finally {
			setRefreshing(false);
		}
	};

	const { submitTrajectory, isActionLoading } = useOrderActions(order);

	const { triggerUpload, isUploading } = useUpload();
	const { userInfo } = useAuthStore();

	if (isDetailLoading || isTrajectoryLoading) return <Loading />;
	if (!order) return <Empty title="未找到相关服务订单" />;

	// 视角双端判定：如果当前登录用户的 id 等于订单里抢单人的 userId，则是服务方视角
	const isEmployer = order.userId !== userInfo?.userId;

	// 动态提取对方的联系资料名片串
	const targetName = isEmployer ? order.name : order.employerName;
	const targetPhone = isEmployer ? order.phone : order.employerPhone;
	const targetAvatar = isEmployer ? order.avatar : order.employerAvatar;

	// 服务轨迹列表
	const logList = trajectoryData?.list || [];

	// 打开打卡弹窗
	const handleOpenPunch = (type: 'arrived' | 'completed') => {
		setPunchModalType(type);
		setPunchImages([]);
	};

	// 关闭打卡弹窗
	const handleClosePunch = () => {
		if (!isActionLoading) {
			setPunchModalType(null);
			setPunchImages([]);
		}
	};

	// 确认提交打卡 / 完工成果
	const handleConfirmPunch = () => {
		if (!punchModalType) return;
		if (!punchImages.length) {
			Taro.showToast({ title: '请先拍摄/上传照片', icon: 'none' });
			return;
		}

		submitTrajectory.mutate(
			{
				orderId,
				demandId: order.demandId,
				status: punchModalType,
				trajectoryImg: punchImages[0],
			},
			{
				onSuccess: () => {
					Taro.showToast({
						title: punchModalType === 'arrived' ? '到场打卡成功' : '完工申请已提交',
						icon: 'success',
					});
					setPunchModalType(null);
					setPunchImages([]);
					refetchDetail();
					refetchTrajectory();
				},
			},
		);
	};

	return (
		<Page className="bg-main-bg pb-28">
			<ScrollView
				scrollY
				className="h-screen"
				refresherEnabled
				refresherTriggered={refreshing}
				onRefresherRefresh={handleRefresh}
				enhanced
				showScrollbar={false}
			>
				{/* 顶部高亮身份状态横幅 */}
				<View className="bg-linear-to-r from-primary to-red-400 p-6 text-white flex justify-between items-center">
					<View className="flex flex-col gap-2 flex-1 pr-4">
						<Text className="text-xl font-bold font-num">
							{getOrderDetailTip(order.status, isEmployer)}
						</Text>
						<View className="flex flex-col gap-1 text-xs text-red-100 ">
							<Text className="font-num">服务单号：{order.orderId}</Text>
							<View className="flex items-center gap-3">
								<Text>状态：{ORDER_STATUS_MAP[order.status].label}</Text>
								<Text onClick={() => mapsTo(`/pages/demand/detail/index?id=${order.demandId}`)}>
									[点击查看原需求单]
								</Text>
							</View>
						</View>
					</View>
				</View>

				<View className="container-x py-4 space-y-4">
					{/* 服务方履约阶段温馨引导卡片 */}
					{!isEmployer && order.status === 'paid' && (
						<Cell className="p-4 bg-orange-50/80 border border-orange-200/60 rounded-xl">
							<View className="flex items-start gap-3">
								<View className="size-9 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
									<View className="icon-[ph--map-pin-line-fill] size-5" />
								</View>
								<View className="flex-1 flex flex-col gap-1">
									<Text className="text-sm font-bold text-orange-950">步骤 1：到达现场打卡</Text>
									<Text className="text-xs text-orange-800/80 leading-relaxed">
										您已接单成功！到达服务现场后，请点击底部「到达现场打卡」拍摄实景照片，正式开启本次服务。
									</Text>
								</View>
							</View>
						</Cell>
					)}

					{!isEmployer && order.status === 'serving' && (
						<Cell className="p-4 bg-blue-50/80 border border-blue-200/60 rounded-xl">
							<View className="flex items-start gap-3">
								<View className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
									<View className="icon-[ph--hourglass-medium-fill] size-5 animate-pulse" />
								</View>
								<View className="flex-1 flex flex-col gap-1">
									<Text className="text-sm font-bold text-blue-950">步骤 2：服务进行中</Text>
									<Text className="text-xs text-blue-800/80 leading-relaxed">
										您已安全打卡到场。请全心投入提供优质服务，全部服务完成后点击底部「完成服务并提交验收」上传完工成果。
									</Text>
								</View>
							</View>
						</Cell>
					)}

					{!isEmployer && order.status === 'confirming' && (
						<Cell className="p-4 bg-emerald-50/80 border border-emerald-200/60 rounded-xl">
							<View className="flex items-start gap-3">
								<View className="size-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
									<View className="icon-[ph--check-circle-fill] size-5" />
								</View>
								<View className="flex-1 flex flex-col gap-1">
									<Text className="text-sm font-bold text-emerald-950">步骤 3：等待雇主验收</Text>
									<Text className="text-xs text-emerald-800/80 leading-relaxed">
										完工成果照片已提交。雇主核实验收通过后，本次服务将圆满结算。
									</Text>
								</View>
							</View>
						</Cell>
					)}

					{/* 相关人员资料信息 */}
					<Cell className="p-4">
						<Heading title={isEmployer ? '服务方资料' : '雇主资料'} size="md" className="mb-3" />
						<View className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
							<View className="flex items-center gap-3">
								<Image src={targetAvatar} className="size-11 rounded-full bg-gray-200 shrink-0" />
								<View className="flex flex-col gap-0.5">
									<View className="flex items-center gap-1.5">
										<Text className="text-sm font-bold text-text-title">{targetName}</Text>
										{isEmployer && <UserIdentityBadge value={order.identity} />}
									</View>
									<Text className="text-xs text-text-muted font-num">{targetPhone}</Text>
								</View>
							</View>

							{/* 原生呼叫核心组件 */}
							<Button
								variant="outline"
								size="xs"
								icon="icon-[ph--phone-call]"
								className="px-3"
								onClick={() => Taro.makePhoneCall({ phoneNumber: targetPhone })}
							>
								联系对方
							</Button>
						</View>
					</Cell>

					{/* 服务履约详细诉求摘要 */}
					<Cell className="p-4 flex flex-col gap-2.5">
						<Heading title="服务内容明细" size="md" className="mb-1" />
						<Description label="服务名称" value={order.orderName} />
						<Description label="服务大类" value={order.categoryName} />
						<Description label="服务驻地" value={order.address} className="items-start" />
						<Description
							label="服务性质"
							value={order.charge ? '公益服务单' : '标准服务单'}
							className={order.charge ? 'text-green-600 font-medium' : ''}
						/>
					</Cell>

					{/* 服务履约轨迹时间线 */}
					<Cell className="p-4">
						<Heading
							title="服务履约轨迹"
							subtitle="由服务方到场打卡及系统时间联合存证"
							size="md"
							className="mb-4"
						/>
						{logList.length === 0 ? (
							<Text className="text-xs text-text-muted italic block py-2">暂无打卡轨迹存证</Text>
						) : (
							<View className="flex flex-col pl-2 mt-2">
								{logList.map((log, index) => {
									const isLast = index === logList.length - 1;
									return (
										<View key={log.id} className="flex gap-4 relative pb-5">
											{!isLast && (
												<View className="absolute left-0.75 top-4 bottom-0 w-0.5 bg-gray-100" />
											)}
											<View
												className={`size-2 rounded-full mt-1.5 z-10 shrink-0 ${index === 0 ? 'bg-primary ring-4 ring-blue-50' : 'bg-gray-300'}`}
											/>

											<View className="flex flex-col flex-1 gap-1 -mt-0.5">
												<Text
													className={`text-sm font-bold line-clamp-2 ${index === 0 ? 'text-text-title' : 'text-text-body'}`}
												>
													{log.title || ORDER_STATUS_MAP[log.status]?.label}
												</Text>
												<Text className="text-xs text-text-muted font-num">
													{log.createTime}
												</Text>

												{/* 轨迹照片放大预览体验 */}
												{log.trajectoryImg && (
													<View
														className="mt-1.5 relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-100"
														onClick={() =>
															Taro.previewImage({
																urls: [log.trajectoryImg!],
																current: log.trajectoryImg,
															})
														}
													>
														<Image
															src={log.trajectoryImg}
															mode="aspectFill"
															className="w-full h-full"
														/>
														<View className="absolute bottom-0 left-0 w-full bg-black/40 text-xs text-white text-center py-0.5">
															点击看图
														</View>
													</View>
												)}
											</View>
										</View>
									);
								})}
							</View>
						)}
					</Cell>

					{/* 交易存证流水与时间审计节点 */}
					<Cell className="p-4 flex flex-col gap-2.5 font-num text-xs">
						<Heading title="订单存证" size="md" className="mb-1" />
						<Description
							label="支付模式"
							value={order.payType === 'online' ? '线上资金担保交易' : '线下当面结算'}
						/>
						<Description
							label="应结金额"
							value={`¥ ${order.orderTotal}`}
							className="text-orange-500 font-bold text-sm"
						/>
						<Divider className="my-1.5" />
						<Description label="创建时间" value={order.createTime || '无'} />
						<Description label="支付时间" value={order.payTime || '未支付'} />
						<Description label="完工时间" value={order.completeTime || '未完工'} />
					</Cell>
				</View>
			</ScrollView>

			{/* 吸底多状态多端联动的动作按钮控制中枢 */}
			<View className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 pb-safe z-50 flex gap-3 justify-end items-center">
				{/* 雇主/服务方履约动作树 */}
				{isEmployer ? (
					<EmployerActions order={order} />
				) : (
					<ProviderActions order={order} onOpenPunch={handleOpenPunch} />
				)}

				{/* 统一种类终结态的纯文本视觉回执 */}
				{order.status === 'completed' && (
					<View className="text-sm text-center w-full text-green-600 font-medium flex items-center justify-center gap-1 py-2">
						<View className="icon-[ph--check-circle-fill] size-4" />
						此单服务已全部圆满结束
					</View>
				)}

				{order.status === 'cancelled' && (
					<View className="text-sm text-center w-full text-text-muted py-2">该订单已被取消关闭</View>
				)}
			</View>

			{/* 打卡 / 完工拍照二次确认半屏弹窗 */}
			{punchModalType && (
				<View className="fixed inset-0 z-50 flex flex-col justify-end" catchMove>
					{/* 遮罩层 */}
					<View className="absolute inset-0 bg-black/60 transition-opacity" onClick={handleClosePunch} />

					{/* 弹窗主体 */}
					<View className="relative w-full bg-white rounded-t-3xl p-5 pb-safe z-10 flex flex-col gap-4 shadow-2xl">
						{/* 弹窗头部 */}
						<View className="flex items-start justify-between border-b border-gray-100 pb-3">
							<View className="flex flex-col gap-0.5">
								<Text className="text-base font-bold text-text-title">
									{punchModalType === 'arrived' ? '到达现场打卡存证' : '服务完工成果拍照'}
								</Text>
								<Text className="text-xs text-text-muted">
									{punchModalType === 'arrived'
										? '请拍摄服务对象或现场环境照片，存证您已安全到达'
										: '请拍摄本次服务成果实景照片，提交雇主进行验收'}
								</Text>
							</View>
							<View
								className="icon-[ph--x-bold] size-5 text-gray-400 p-1 active:text-gray-600"
								onClick={handleClosePunch}
							/>
						</View>

						{/* 拍照上传区域 */}
						<View className="py-2">
							<ImageUploader
								value={punchImages}
								maxCount={1}
								isUploading={isUploading}
								onUpload={(files) => triggerUpload(files)}
								onChange={(urls) => setPunchImages(urls)}
								icon={
									punchModalType === 'arrived'
										? 'icon-[ph--map-pin-line-duotone]'
										: 'icon-[ph--camera-duotone]'
								}
								label={punchModalType === 'arrived' ? '点击拍照/上传到场照片' : '点击拍照/上传完工成果'}
								className="w-full h-44"
							/>
						</View>

						{/* 底部确认操作按钮 */}
						<View className="flex gap-3 pt-2 border-t border-gray-100">
							<Button
								variant="secondary"
								className="flex-1"
								disabled={isActionLoading || isUploading}
								onClick={handleClosePunch}
							>
								取消
							</Button>
							<Button
								variant={punchModalType === 'arrived' ? 'primary' : 'success'}
								className="flex-1"
								loading={isActionLoading}
								disabled={punchImages.length === 0 || isUploading}
								onClick={handleConfirmPunch}
							>
								{punchModalType === 'arrived' ? '确认到达打卡' : '确认提交验收'}
							</Button>
						</View>
					</View>
				</View>
			)}
		</Page>
	);
}
