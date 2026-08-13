import { useRouter, makePhoneCall } from '@tarojs/taro';
import { View, Text, ScrollView, RichText } from '@tarojs/components';
import { useJobDetail, useResumeActions, useResumeDetail } from '@/hooks/useJob';
import { mapsTo } from '@/utils/common';
import { Cell, Alert, Heading, Button, Empty, Loading, Page } from '@/components/ui';
import Taro from '@tarojs/taro';

export default function JobDetail() {
	const { params } = useRouter();
	const id = params.id as string;

	const { data: detail, isLoading } = useJobDetail(id);

	const { data: resumeDetail, error: resumeError, isLoading: isResumeLoading } = useResumeDetail();

	const { deliverJob, isActionPending } = useResumeActions();

	if (isLoading) return <Loading title="岗位加载中..." />;
	if (!detail) return <Empty title="岗位信息不存在" />;

	// 处理投递简历
	const handleDeliverClick = () => {
		// 是否能获取到简历详情且有合法的姓名
		const hasCreatedResume = !!resumeDetail && !resumeError;

		if (hasCreatedResume) {
			// 简历是否在审核中
			const isPending = resumeDetail.reviewStatus === 'pending';
			if (isPending) {
				Taro.showToast({
					title: '简历正在审核中，请勿重复投递',
					icon: 'error',
				});
			} else {
				Taro.showModal({
					title: '确认投递',
					content: `是否确认将您的专属简历投递至【${detail.enterprisesName}】的【${detail.title}】岗位？`,
					success: (res) => {
						if (res.confirm) {
							deliverJob.mutate({
								id: Number(id), // 传入当前岗位 id
							});
						}
					},
				});
			}
		} else {
			Taro.showModal({
				title: '提示',
				content: '您目前尚未在平台创建求职简历，请先完善您的个人基础求职名片。',
				confirmText: '去创建',
				success: (res) => {
					if (res.confirm) {
						mapsTo('/pages/user/resume/index?mode=create');
					}
				},
			});
		}
	};

	return (
		<Page>
			<ScrollView scrollY className="h-full">
				{/* 岗位核心信息 */}
				<Cell className="border-b border-gray-100">
					<View className="flex justify-between items-start mb-2">
						<Text className="text-xl font-bold text-text-title leading-tight flex-1">{detail.title}</Text>
						<Text className="text-xl font-bold text-primary">{detail.salaryBudget}k</Text>
					</View>

					<View className="flex items-center gap-3">
						<View className="flex items-center gap-1 text-xs text-text-muted bg-gray-50 px-2 py-1 rounded">
							<View className="icon-[ph--briefcase] size-4" />
							<Text>{detail.jobTitle}</Text>
						</View>
						<View className="flex items-center gap-1 text-xs text-text-muted bg-gray-50 px-2 py-1 rounded">
							<View className="icon-[ph--user] size-4" />
							<Text>招 {detail.hireCount} 人</Text>
						</View>
					</View>
				</Cell>

				{/* 企业入口卡片 */}
				<Cell
					className="mt-3 flex items-center justify-between active:bg-gray-50 transition-colors"
					onClick={() => mapsTo(`/pages/job/enterprise/index?id=${detail.enterprisesId}`)}
				>
					<View className="flex items-center gap-3">
						<View className="w-12 h-12 bg-gray-100 rounded-card flex items-center justify-center">
							<View className="icon-[ph--buildings] w-6 h-6 text-text-muted" />
						</View>
						<View>
							<Text className="text-base font-bold text-text-title block mb-0.5">
								{detail.enterprisesName}
							</Text>
							<Text className="text-xs text-text-muted">点击查看企业主页</Text>
						</View>
					</View>
					<View className="icon-[ph--caret-right] w-5 h-5 text-text-muted" />
				</Cell>

				{/* 温馨提示 */}
				<View className="container-x py-5">
					<Alert>
						温馨提示：家门口求职平台承诺不向求职者收取任何费用，请提高警惕，注意保护个人财产安全。
					</Alert>
				</View>

				{/* 岗位描述内容 */}
				<Cell className="mt-3">
					<Heading title="岗位描述" size="md" />
					<View className="mt-4 text-gray-700 leading-relaxed text-sm">
						<RichText nodes={detail.content} />
					</View>
				</Cell>
			</ScrollView>

			{/* 底部固定操作栏 */}
			<View className="fixed bottom-0 inset-x-0 bg-white p-4 border-t border-gray-100 flex gap-3 z-20">
				<Button
					variant="primary"
					icon="icon-[ph--paper-plane-tilt]"
					className="flex-[1.5]"
					loading={isActionPending || isResumeLoading}
					onClick={handleDeliverClick}
				>
					投递简历
				</Button>
			</View>
		</Page>
	);
}
