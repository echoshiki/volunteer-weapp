import { View, Text, Input, Textarea, Picker as TaroPicker } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { Page, Button, Badge, Cell, Heading, FormItem, Loading, Empty } from '@/components/ui';
import { TenantPicker } from '@/components/biz/TenantPicker';
import {
	useDemandCategoryList,
	useDemandTags,
	useEditDemand,
	useDemandDetail,
	useDemandForm,
} from '@/hooks/useDemand';
import { demandItemToFormData } from '@/utils/demand';
import { DemandCategory } from '@/types/demand';
import { PublishDemandRequest } from '@/services/demand';

export default function EditDemandPage() {
	const { params } = useRouter();
	const id = Number(params.id);

	const { data: demandDetail, isLoading: isDetailLoading } = useDemandDetail(id);
	const { data: categoryList = [], isLoading: isCategoryLoading } = useDemandCategoryList();

	// 在数据完全准备好之前，展示 Loading，防止闪烁和 Hook 初始化失败
	if (isDetailLoading || isCategoryLoading) return <Loading />;
	if (!demandDetail) return <Empty title="未找到该需求单信息" />;

	// 渲染真正的表单内容组件，此时数据 100% 存在
	return (
		<EditDemandFormContent
			initialData={demandItemToFormData(demandDetail)}
			demandId={demandDetail.demandId}
			categoryList={categoryList}
		/>
	);
}

interface EditDemandFormContentProps {
	initialData: ReturnType<typeof demandItemToFormData>;
	demandId: number;
	categoryList: DemandCategory[];
}

function EditDemandFormContent({
	initialData,
	demandId,
	categoryList,
}: EditDemandFormContentProps) {
	const { data: tagList = [] } = useDemandTags();
	const { mutate: editDemand, isLoading } = useEditDemand();

	const {
		formData,
		validate,
		handleInput,
		categoryIndex,
		setCategoryIndex,
		regionLabel,
		toggleTag,
		handleTenantChange,
	} = useDemandForm(initialData, categoryList);

	const handleSubmit = () => {
		const error = validate();
		if (error) return Taro.showToast({ title: error, icon: 'none' });

		editDemand({
			...(formData as PublishDemandRequest),
			demandId,
			minMoney: formData.charge ? 0 : Number(formData.minMoney),
			maxMoney: formData.charge ? 0 : Number(formData.maxMoney),
		} as any);
	};

	return (
		<Page hasTabBar>
			<View className="container-x py-4 space-y-4">
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

			{/* 底部吸底按钮 */}
			<View className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 pb-safe z-50">
				<Button
					variant="primary"
					className="w-full"
					onClick={handleSubmit}
					loading={isLoading}
				>
					保存修改
				</Button>
			</View>
		</Page>
	);
}
