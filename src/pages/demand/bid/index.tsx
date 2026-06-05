import { useState } from 'react';
import { View, Input, Textarea, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { Page, Button, Cell, Heading, FormItem } from '@/components/ui';
import { useBidDemand } from '@/hooks/useDemand';

export default function DemandBidPage() {
	const { params } = useRouter();
	const demandId = Number(params.id);

	const isFree = params.charge === 'true';
	const { mutate: submitBid, isLoading } = useBidDemand();

	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		money: isFree ? 0 : '', // 如果是公益单，默认就是 0
		description: '',
	});

	const handleInput = (field: string, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = () => {
		const { name, phone, money, description } = formData;

		// 表单前置校验
		if (!name.trim()) return Taro.showToast({ title: '请填写联系人姓名', icon: 'none' });
		if (!phone.trim()) return Taro.showToast({ title: '请填写联系电话', icon: 'none' });
		if (!/^1[3-9]\d{9}$/.test(phone))
			return Taro.showToast({ title: '手机号格式有误', icon: 'none' });

		if (!isFree) {
			if (money === '' || Number(money) < 0) {
				return Taro.showToast({ title: '请填写合理的报价金额', icon: 'none' });
			}
		}

		if (!description.trim())
			return Taro.showToast({ title: '请填写服务描述与优势', icon: 'none' });

		submitBid({
			demandId,
			name,
			phone,
			money: Number(money),
			description,
		});
	};

	return (
		<Page className="pb-24">
			<View className="container-x py-4 space-y-4">
				{/* 报价与留言模块 */}
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
									value={String(formData.money)}
									onInput={(e) => handleInput('money', e.detail.value)}
								/>
							</FormItem>
						) : (
							<View className="flex items-center justify-between border-b border-gray-100 pb-3">
								<Text className="text-sm text-text-title">服务性质</Text>
								<Text className="text-sm text-green-600  px-2 py-1 rounded">
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
					loading={isLoading}
				>
					确认提交报价
				</Button>
			</View>
		</Page>
	);
}
