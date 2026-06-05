import { View, Input, Textarea, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Cell, Heading, FormItem, Button } from '@/components/ui';
import { useBidForm } from '@/hooks/useDemand';
import type { MyBidItem } from '@/types/demand';
import { BidDemandRequest } from '@/services/demand';

export interface BidFormProps {
	/** 初始数据：编辑场景下传入原报价单数据，发布时不传 */
	initialData?: MyBidItem;
	/** 是否属于公益免单需求（控制金额栏展隐） */
	isFree?: boolean;
	/** 提交按钮文字占位 */
	submitText?: string;
	/** 提交中状态反馈 */
	isSubmitting?: boolean;
	/** 确认提交回调，抛出加工完毕的合规 Payload */
	onSubmit: (data: BidDemandRequest) => void;
}

export const BidForm = ({
	initialData,
	isFree = false,
	submitText = '确认提交报价',
	isSubmitting = false,
	onSubmit,
}: BidFormProps) => {
	// 初始化核心表单控制
	const { formData, handleInput, validate } = useBidForm(initialData, isFree);

	const handleSubmit = () => {
		const error = validate();
		if (error) return Taro.showToast({ title: error, icon: 'none' });

		onSubmit({
			demandId: initialData ? initialData.demandId : 0,
			name: formData.name!.trim(),
			phone: formData.phone!.trim(),
			money: isFree ? 0 : Number(formData.money),
			description: formData.description!.trim(),
		} as BidDemandRequest);
	};

	return (
		<>
			<View className="container-x py-4 space-y-4">
				{/* 报价与方案模块 */}
				<Cell>
					<Heading title="填写报价方案" size="md" />

					<View className="flex flex-col gap-1 mt-2">
						{!isFree ? (
							<FormItem label="服务报价">
								<Input
									className="flex-1 text-orange-500 font-bold text-lg font-num"
									type="digit"
									placeholder="请输入您的报价，单位：元"
									placeholderClass="text-gray-300 font-normal text-sm"
									value={String(formData.money ?? '')}
									onInput={(e) => handleInput('money', e.detail.value)}
								/>
							</FormItem>
						) : (
							<View className="flex items-center justify-between border-b border-gray-100 pb-3">
								<Text className="text-sm text-text-title">服务性质</Text>
								<Text className="text-sm text-green-600 font-bold bg-green-50 px-2 py-1 rounded">
									公益免单 (无需报价)
								</Text>
							</View>
						)}

						<FormItem label="服务描述" layout="column">
							<Textarea
								className="w-full h-32 bg-gray-50 rounded-lg p-3 text-sm leading-relaxed"
								placeholder="请描述您的服务方案、预计上门时间或您的专业优势，这能大大提高雇主选择您的概率哦~"
								maxlength={500}
								value={formData.description}
								onInput={(e) => handleInput('description', e.detail.value)}
							/>
						</FormItem>
					</View>
				</Cell>

				{/* 联系信息模块 (自由修改) */}
				<Cell>
					<Heading title="联系方式" subtitle="方便雇主与您联系沟通服务细节" size="md" />
					<View className="flex flex-col gap-2">
						<FormItem label="联系人">
							<Input
								className="flex-1 text-sm text-right"
								placeholder="请输入联系人姓名"
								value={formData.name}
								onInput={(e) => handleInput('name', e.detail.value)}
							/>
						</FormItem>

						<FormItem label="联系电话">
							<Input
								className="flex-1 text-sm text-right"
								type="number"
								placeholder="请输入联系电话"
								maxlength={11}
								value={formData.phone}
								onInput={(e) => handleInput('phone', e.detail.value)}
							/>
						</FormItem>
					</View>
				</Cell>
			</View>

			{/* 吸底提交按钮 */}
			<View className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 pb-safe z-50">
				<Button
					variant="primary"
					className="w-full"
					onClick={handleSubmit}
					loading={isSubmitting}
				>
					{submitText}
				</Button>
			</View>
		</>
	);
};
