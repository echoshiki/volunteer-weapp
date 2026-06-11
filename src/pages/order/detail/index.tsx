import { View, Image, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
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

	// 数据：订单详情数据、订单服务轨迹
	const { data: order, isLoading: isDetailLoading, refetch: refetchDetail } = useOrderDetail(orderId);

	const {
		data: trajectoryData,
		isLoading: isTrajectoryLoading,
		refetch: refetchTrajectory,
	} = useOrderTrajectoryList(orderId);

	const { needArrivePunch, needCompletePunch, submitTrajectory, isActionLoading } = useOrderActions(order);

	const { triggerUpload, isUploading } = useUpload();
	const { userInfo } = useAuthStore();

	if (isDetailLoading || isTrajectoryLoading) return <Loading />;
	if (!order) return <Empty title="未找到相关服务订单" />;

	// 视角双端判定：如果当前登录用户的 id 等于订单里抢单人的 userId，则是服务方视角
	const isEmployer = order.userId !== userInfo?.userId;

	// 动态提取对方的联系资料名片串
	const targetName = isEmployer ? order.name : order.employerName;
	const targetPhone = isEmployer ? order.phone : order.employerPhone;
	const targetAvatar = isEmployer ? order.avatar : '';

	// 服务轨迹列表
	const logList = trajectoryData?.list || [];

	// 服务方打卡
	const handleTrajectorySubmit = async (urls: string[], targetStatus: 'arrived' | 'completed') => {
		if (!urls.length) return;
		submitTrajectory.mutate(
			{
				orderId,
				demandId: order.demandId,
				status: targetStatus,
				trajectoryImg: urls[0],
			},
			{
				onSuccess: () => {
					refetchDetail();
					refetchTrajectory();
				},
			},
		);
	};

	return (
		<Page className="bg-main-bg pb-28">
			{/* 顶部高亮身份状态横幅 */}
			<View className="bg-linear-to-r from-primary to-red-400 p-6 text-white flex justify-between items-center">
				<View className="flex flex-col gap-2 flex-1 pr-4">
					<Text className="text-xl font-bold font-num">{getOrderDetailTip(order.status, isEmployer)}</Text>
					<View className="flex flex-col gap-1 text-xs text-red-100 ">
						<View className="flex items-center gap-3">
							<Text className="font-num">服务单号：{order.orderId}</Text>
							<Text onClick={() => mapsTo(`/pages/demand/detail/index?id=${order.demandId}`)}>
								[点击查看原需求单]
							</Text>
						</View>
						<Text>状态：{ORDER_STATUS_MAP[order.status].label}</Text>
					</View>
				</View>
			</View>

			<View className="container-x py-4 space-y-4">
				{/* 服务方现场拍照打卡 */}
				{!isEmployer && (needArrivePunch || needCompletePunch) && (
					<Cell className="p-4">
						<Heading
							title={needArrivePunch ? '第一步：到达现场打卡' : '第二步：完工成果拍照'}
							subtitle={
								needArrivePunch
									? '请拍摄服务对象现场照片，确认您已安全到达，开启服务。'
									: '请拍摄服务完成后的现场成果照，提交雇主验收。'
							}
							size="md"
							className="mb-3"
						/>
						<View className="mt-2 flex">
							<ImageUploader
								value={[]}
								maxCount={1}
								isUploading={isUploading || isActionLoading}
								onUpload={(files) => triggerUpload(files)}
								onChange={(urls) =>
									handleTrajectorySubmit(urls, needArrivePunch ? 'arrived' : 'completed')
								}
								icon={needArrivePunch ? 'icon-[ph--map-pin-line-duotone]' : 'icon-[ph--camera-duotone]'}
								label={needArrivePunch ? '点击拍照/上传到场存证' : '点击拍照/上传完工成果'}
								className="w-full"
							/>
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
											<Text className="text-xs text-text-muted font-num">{log.createTime}</Text>

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

			{/* 吸底多状态多端联动的动作按钮控制中枢 */}
			<View className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 pb-safe z-50 flex gap-3 justify-end items-center">
				{/* 雇主/服务方履约动作树 */}
				{isEmployer ? <EmployerActions order={order} /> : <ProviderActions order={order} />}

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
		</Page>
	);
}
