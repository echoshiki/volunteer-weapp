import { useState } from 'react';
import { View, Text, Input, Textarea, Picker as TaroPicker, Switch } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Page, Button, Badge, Cell, Heading, FormItem } from '@/components/ui';
import { TenantPicker } from '@/components/biz/TenantPicker';
import { useDemandCategoryList, useDemandTags, usePublishDemand } from '@/hooks/useDemand';
import type { PublishDemandRequest } from '@/services/demand';

export default function PublishDemandPage() {
	// ── 远程数据 ──────────────────────────────────
	const { data: categoryList = [] } = useDemandCategoryList();
	const { data: tagList = [] } = useDemandTags();
	const { mutate: publishDemand, isLoading } = usePublishDemand();

	// ── 表单状态 ──────────────────────────────────
	const [categoryIndex, setCategoryIndex] = useState<number>();
	const [regionLabel, setRegionLabel] = useState<string>('');
	const [formData, setFormData] = useState<Partial<PublishDemandRequest>>({
		demandName: '',
		content: '',
		address: '',
		name: '',
		phone: '',
		emergencyCall: '',
		tagIds: [],
		minMoney: 0,
		maxMoney: 0,
	});

	// ── 表单操作 ──────────────────────────────────
	const handleInput = (field: keyof PublishDemandRequest, value: any) =>
		setFormData((prev) => ({ ...prev, [field]: value }));

	const toggleTag = (id: number) =>
		setFormData((prev) => {
			const tags = prev.tagIds || [];
			return {
				...prev,
				tagIds: tags.includes(id) ? tags.filter((t) => t !== id) : [...tags, id],
			};
		});

	const handleTenantChange = (
		tenantId: number,
		tenantName: string,
		pCode: number,
		cCode: number,
		dCode: number,
	) => {
		setFormData((prev) => ({
			...prev,
			tenantId,
			provinceCode: pCode,
			cityCode: cCode,
			districtCode: dCode,
		}));
		setRegionLabel(tenantName);
	};

	// ── 校验与提交 ──────────────────────────────────
	const validate = (): string | null => {
		const rules: [boolean, string][] = [
			[!formData.demandName, '请输入需求名称'],
			[!formData.categoryId, '请选择服务对象'],
			[!formData.tagIds?.length, '请至少选择一个标签'],
			[(formData.tagIds?.length ?? 0) > 5, '标签最多选择5个'],
			[!formData.tenantId, '请选择服务区域'],
			[!formData.address, '请输入详细地址'],
			[!formData.name || !formData.phone, '请填写联系人及电话'],
			[!formData.content, '请输入需求描述'],
			[
				!formData.minMoney || !formData.maxMoney || formData.minMoney > formData.maxMoney,
				'请填写正确的预算区间',
			],
		];
		return rules.find(([invalid]) => invalid)?.[1] ?? null;
	};

	const handleSubmit = () => {
		const error = validate();
		if (error) return Taro.showToast({ title: error, icon: 'none' });

		publishDemand({
			...(formData as PublishDemandRequest),
			minMoney: formData.charge ? 0 : Number(formData.minMoney),
			maxMoney: formData.charge ? 0 : Number(formData.maxMoney),
		});
	};

	return (
		<Page hasTabBar>
			<View className="container-x py-4 space-y-4">
				{/* 基础信息模块 */}
				<Cell>
					<Heading title="基础信息" size="md" />

					<View className="flex flex-col gap-2">
						<FormItem label="需求标题">
							<Input
								placeholder="如：老年人助餐"
								value={formData.demandName}
								onInput={(e) => handleInput('demandName', e.detail.value)}
							/>
						</FormItem>

						<TaroPicker
							mode="selector"
							range={categoryList}
							rangeKey="categoryName"
							onChange={(e) => {
								const idx = Number(e.detail.value);
								setCategoryIndex(idx);
								handleInput('categoryId', categoryList[idx].categoryId);
							}}
						>
							<FormItem label="服务类别" className="gap-2">
								<Text
									className={`text-sm ${categoryIndex !== undefined ? 'text-text-title' : 'text-text-muted'}`}
								>
									{categoryIndex !== undefined
										? categoryList[categoryIndex].categoryName
										: '请选择服务对象分类'}
								</Text>
								<View className="icon-[ph--caret-right] text-text-muted" />
							</FormItem>
						</TaroPicker>

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

				{/* 联系与地址模块 */}
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

				{/* 需求详情描述 */}
				<Cell>
					<Heading title="补充信息" size="md" />
					<FormItem label="详情描述" layout="column">
						<Textarea
							className="w-full h-24 bg-gray-50 rounded-lg p-3 text-sm"
							placeholder="请详细描述您的需求，以便服务人员更好地为您评估（如：下水道堵塞严重，需要带大型疏通机...）"
							maxlength={500}
							value={formData.content}
							onInput={(e) => handleInput('content', e.detail.value)}
						/>
					</FormItem>
				</Cell>
			</View>

			{/* 底部吸底提交按钮 */}
			<View className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 pb-safe z-50">
				<Button
					variant="primary"
					className="w-full"
					onClick={handleSubmit}
					loading={isLoading}
				>
					确认发布
				</Button>
			</View>
		</Page>
	);
}
