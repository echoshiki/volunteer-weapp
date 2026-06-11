import { View, Text, Image } from '@tarojs/components';
import { Button, ImagePreview } from '@/components/ui';
import { AuditStatusBadge } from '@/components/biz';
import { mapsTo, saveImageToAlbum } from '@/utils/common';
import { ActivityRecordItem } from '@/types/activity';
import { doGlobalScan } from '@/utils/scan';
import { useState } from 'react';
import { useCertificate } from '@/hooks/useCertificate';
import Taro from '@tarojs/taro';

export interface ActivityRecordCardProps {
	record: ActivityRecordItem;
	/** 外部追加的容器样式 */
	className?: string;
}

/**
 * 用户活动报名记录卡片
 */
export const ActivityRecordCard = ({ record, className = '' }: ActivityRecordCardProps) => {
	const [preview, setPreview] = useState({ visible: false, url: '' });
	const { generateCertificate, isGenerating } = useCertificate();

	const handleActionGenerateCert = async (e: any) => {
		e.stopPropagation();
		Taro.showLoading({ title: '证书加印中...', mask: true });
		try {
			const res = await generateCertificate({ activityId: record.activityId });
			Taro.hideLoading();
			if (res?.url) setPreview({ visible: true, url: res.url });
		} catch (err) {
			Taro.hideLoading();
		}
	};

	return (
		<View onClick={() => mapsTo(`/pages/activity/detail/index?id=${record.activityId}`)} className={`${className}`}>
			<View className="flex gap-3">
				<Image
					src={record.banner}
					mode="aspectFill"
					className="size-20 rounded-lg object-cover bg-gray-100 shrink-0"
				/>
				<View className="flex-1 flex flex-col justify-between overflow-hidden">
					{/* 活动标题 */}
					<View className="flex justify-between items-center gap-2">
						<Text className="text-base font-bold text-text-title flex-1 truncate">
							{record.activityName}
						</Text>
						<AuditStatusBadge value={record.auditStatus} />
					</View>

					{/* 活动时间、地点 */}
					<View className="flex flex-col gap-1">
						<Text className="text-xs text-text-muted truncate">时间: {record.startTime}</Text>
						<Text className="text-xs text-text-muted truncate">地点: {record.address}</Text>
					</View>
				</View>
			</View>

			{/* 动态履约区 (仅在审核通过后展示强交互) */}
			<View className="mt-3 pt-3 border-t border-gray-50">
				{record.auditStatus === 'approved' && (
					<View className="flex items-center justify-between">
						{/* 打卡时间轴 */}
						<View className="flex flex-col gap-0.5">
							{record.checkInTime ? (
								<>
									<Text className="text-xs text-gray-500">入: {record.checkInTime}</Text>
									{record.checkOutTime ? (
										<Text className="text-xs text-gray-500">出: {record.checkOutTime}</Text>
									) : (
										<Text className="text-xs text-orange-500">等待活动结束签退...</Text>
									)}
								</>
							) : (
								<Text className="text-xs text-text-muted">到达现场后请及时打卡</Text>
							)}
						</View>

						{/* 动作或成果 */}
						<View>
							{record.duration !== null ? (
								<View className="flex items-center gap-3">
									<View className="flex items-baseline text-primary text-xs">
										<Text className="text-primary/80">时长</Text>
										<Text className="text-xl mx-1 font-bold font-sans tracking-tight">
											{record.duration}
										</Text>
										<Text className="text-primary/80">分钟</Text>
									</View>
									<Button
										size="sm"
										variant="info"
										icon="icon-[ph--certificate-bold]"
										loading={isGenerating}
										onClick={handleActionGenerateCert}
									>
										荣誉证书
									</Button>
								</View>
							) : (
								<Button
									size="sm"
									variant={record.checkInTime ? 'outline' : 'primary'}
									onClick={(e) => {
										e.stopPropagation();
										doGlobalScan();
									}}
								>
									{record.checkInTime ? '扫码签退' : '扫码签到'}
								</Button>
							)}
						</View>
					</View>
				)}

				{record.auditStatus === 'pending' && (
					<Text className="text-xs text-orange-400 block w-full truncate">资料已提交，等待主办方审核...</Text>
				)}

				{record.auditStatus === 'rejected' && (
					<Text className="text-xs text-red-500 block w-full truncate">
						{record.rejectReason || '不符合本次活动招募要求'}
					</Text>
				)}
			</View>

			<ImagePreview
				visible={preview.visible}
				src={preview.url}
				onClose={() => setPreview({ visible: false, url: '' })}
				// 通过 Slot 注入下载行为，按钮也必须加上 e.stopPropagation()
				actions={
					<Button
						variant="primary"
						size="xl"
						block
						icon="icon-[ph--download-simple-bold]"
						onClick={(e) => {
							e.stopPropagation();
							saveImageToAlbum(preview.url);
						}}
					>
						保存证书至手机相册
					</Button>
				}
			/>
		</View>
	);
};
