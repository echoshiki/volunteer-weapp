import { View, Text, Textarea } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import { Page, Cell, Heading, Button, Rate } from '@/components/ui';
import { useEvaluateOrder, useEvaluateForm } from '@/hooks/useOrder';
import Taro from '@tarojs/taro';

export default function OrderCommentPage() {
	const { params } = useRouter();
	const orderId = params.id || '';

	const { formData, changeRating, changeComment, validate } = useEvaluateForm(orderId);
	const { mutate: submitComment, isLoading } = useEvaluateOrder();

	const handleSubmit = () => {
		const error = validate();
		if (error) {
			Taro.showToast({ title: error, icon: 'none' });
			return;
		}
		submitComment(formData);
	};

	return (
		<Page className="bg-main-bg min-h-screen pb-10">
			<View className="container-x py-4 space-y-4">
				{/* 星级评分 */}
				<Cell className="p-5 flex flex-col items-center justify-center text-center py-8">
					<Heading
						title="本次服务满意吗？"
						subtitle={`请为订单 ${orderId} 做出真实打分`}
						size="md"
						className="mb-6 items-center"
					/>
					<View className="w-full">
						<Rate value={formData.rating} onChange={changeRating} />
					</View>
				</Cell>

				{/* 文本反馈 */}
				<Cell className="p-4 flex flex-col gap-3">
					<Heading title="说说您的评价与建议" size="md" className="mb-1" />

					<View className="bg-gray-50 rounded-xl p-3 border border-gray-100/60 relative">
						<Textarea
							value={formData.comment}
							onInput={(e) => changeComment(e.detail.value)}
							placeholder="请留下您对服务方/志愿者的态度、履约速度及专业度的评价，您的宝贵意见能够帮助平台更好地服务社区群体..."
							maxlength={200}
							className="w-full h-32 text-sm text-text-body leading-relaxed"
						/>

						{/* 动态数字字数限制指示器 */}
						<View className="absolute bottom-2 right-3 text-xs font-num text-text-muted">
							<Text
								className={
									formData.comment && formData.comment.length >= 200
										? 'text-red-500 font-bold'
										: ''
								}
							>
								{formData.comment?.length || 0}
							</Text>{' '}
							/ 200
						</View>
					</View>
				</Cell>

				<View className="pt-4 px-1">
					<Button
						variant="primary"
						size="md"
						block
						loading={isLoading}
						className="shadow-md shadow-blue-200 h-12 rounded-full font-bold"
						onClick={handleSubmit}
					>
						提交评价
					</Button>
				</View>
			</View>
		</Page>
	);
}
