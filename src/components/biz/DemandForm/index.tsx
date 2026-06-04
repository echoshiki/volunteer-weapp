import { View, Text, Input, Textarea, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Cell, Heading, FormItem, Button, Badge, Loading } from '@/components/ui';
import { TenantPicker } from '@/components/biz/TenantPicker';
import { useDemandCategoryList, useDemandTags, useDemandForm } from '@/hooks/useDemand';
import { DemandItem } from '@/types/demand';
import { PublishDemandRequest } from '@/services/demand';

export interface DemandFormProps {
	/** 编辑时传入，发布时不传 */
	initialData?: DemandItem;
	/** 提交按钮文字 */
	submitText?: string;
	/** 提交中状态 */
	isSubmitting?: boolean;
	/** 提交回调，返回组装好的表单数据 */
	onSubmit: (data: PublishDemandRequest) => void;
}

export const DemandForm = ({
	initialData,
	submitText = '确认发布',
	isSubmitting = false,
	onSubmit,
}: DemandFormProps) => {
	const { data: categoryList = [] } = useDemandCategoryList();
	const { data: tagList = [] } = useDemandTags();

	const { formData, validate, handleInput, regionLabel, toggleTag, handleTenantChange } =
		useDemandForm(initialData, categoryList);

	// 获取到当前表单选中的分类索引
	const categoryIndex = categoryList.findIndex((c) => c.categoryId === formData.categoryId);

	const handleSubmit = () => {
		const error = validate();
		if (error) return Taro.showToast({ title: error, icon: 'none' });
		onSubmit({
			...(formData as PublishDemandRequest),
			minMoney: Number(formData.minMoney),
			maxMoney: Number(formData.maxMoney),
		});
	};

	return (
		<>
			<View className="container-x py-4 space-y-4">
				{/* 基础信息 */}
				<Cell>
					<Heading title="基础信息" size="md" />
					<View className="flex flex-col gap-2">
						<FormItem label="需求标题">
							<Input
								className="w-full flex-1"
								placeholder="如：老年人助餐"
								value={formData.demandName}
								onInput={(e) => handleInput('demandName', e.detail.value)}
							/>
						</FormItem>

						<Picker
							mode="selector"
							range={categoryList}
							rangeKey="categoryName"
							onChange={(e) => {
								const idx = Number(e.detail.value);
								handleInput('categoryId', categoryList[idx].categoryId);
							}}
						>
							<FormItem label="服务类别" className="gap-2">
								<Text
									className={`text-sm ${categoryIndex >= 0 ? 'text-text-title' : 'text-text-muted'}`}
								>
									{categoryIndex >= 0
										? categoryList[categoryIndex].categoryName
										: '请选择服务对象分类'}
								</Text>
								<View className="icon-[ph--caret-right] text-text-muted" />
							</FormItem>
						</Picker>

						<FormItem label="需求标签" layout="column">
							<View className="flex flex-wrap gap-2">
								{tagList.map((tag) => (
									<Badge
										key={tag.tagId}
										variant={
											formData.tagIds?.includes(tag.tagId)
												? 'primary'
												: 'secondary'
										}
										onClick={() => toggleTag(tag.tagId)}
										size="sm"
									>
										{tag.tagName}
									</Badge>
								))}
							</View>
						</FormItem>

						<FormItem label="预算区间" className="gap-2">
							<Input
								className="flex-1 bg-gray-50 px-2 py-1 rounded text-sm text-center"
								type="digit"
								placeholder="最低 ¥"
								value={String(formData.minMoney || '')}
								onInput={(e) => handleInput('minMoney', Number(e.detail.value))}
							/>
							<Text className="text-gray-400">-</Text>
							<Input
								className="flex-1 bg-gray-50 px-2 py-1 rounded text-sm text-center"
								type="digit"
								placeholder="最高 ¥"
								value={String(formData.maxMoney || '')}
								onInput={(e) => handleInput('maxMoney', Number(e.detail.value))}
							/>
						</FormItem>
					</View>
				</Cell>

				{/* 联系与位置 */}
				<Cell>
					<Heading title="联系与位置" size="md" />

					<TenantPicker onChange={handleTenantChange}>
						<FormItem label="服务区域" className="gap-2">
							<Text
								className={`text-sm ${regionLabel ? 'text-text-title' : 'text-text-muted'}`}
							>
								{regionLabel || '请选择省市区及运营中心'}
							</Text>
							<View className="icon-[ph--caret-right] text-text-muted" />
						</FormItem>
					</TenantPicker>

					<FormItem label="详细地址">
						<Input
							className="w-full flex-1"
							placeholder="如：幸福小区3栋502室"
							value={formData.address}
							onInput={(e) => handleInput('address', e.detail.value)}
						/>
					</FormItem>
					<FormItem label="联系人">
						<Input
							placeholder="请输入姓名"
							value={formData.name}
							onInput={(e) => handleInput('name', e.detail.value)}
						/>
					</FormItem>
					<FormItem label="联系电话">
						<Input
							type="number"
							placeholder="请输入手机号"
							value={formData.phone}
							onInput={(e) => handleInput('phone', e.detail.value)}
						/>
					</FormItem>
					<FormItem label="应急电话">
						<Input
							type="number"
							placeholder="备用联系电话 (可选)"
							value={formData.emergencyCall}
							onInput={(e) => handleInput('emergencyCall', e.detail.value)}
						/>
					</FormItem>
				</Cell>

				{/* 补充信息 */}
				<Cell>
					<Heading title="补充信息" size="md" />
					<FormItem label="详情描述" layout="column">
						<Textarea
							className="w-full h-24 bg-gray-50 rounded-lg p-3 text-sm"
							placeholder="请详细描述您的需求..."
							maxlength={500}
							value={formData.content}
							onInput={(e) => handleInput('content', e.detail.value)}
						/>
					</FormItem>
				</Cell>
			</View>

			{/* 吸底按钮 */}
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
