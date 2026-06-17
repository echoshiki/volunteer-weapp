import { View, Text, Input } from '@tarojs/components';
import { Page, Cell, FormItem, RegionPicker, Button, Heading, Alert, ImageUploader } from '@/components/ui';
import { useVolunteerApply } from '@/hooks/useUser';
import { useState } from 'react';
import { useUpload } from '@/hooks/useUpload';

export default function ApplyVolunteerPage() {
	const { form, updateField, handleSave, isSubmitting } = useVolunteerApply();

	// 状态：回显表单里的地区
	const [regionLabel, setRegionLabel] = useState('');

	// Hook：身份证上传
	const { triggerUpload: uploadFront, isUploading: isUploadingFront } = useUpload();
	const { triggerUpload: uploadBack, isUploading: isUploadingBack } = useUpload();

	const [images, setImages] = useState<string[]>([]);

	return (
		<Page className="pt-4 pb-10 bg-main-bg">
			<View className="container-x flex flex-col gap-4">
				{/* 区域一：基础身份信息 */}
				<Cell>
					<FormItem label="真实姓名">
						<Input
							className="w-full text-right text-sm text-text-title h-full"
							placeholder="请输入身份证上的姓名"
							value={form.realName}
							onInput={(e) => updateField('realName', e.detail.value)}
						/>
					</FormItem>

					<FormItem label="身份证号">
						<Input
							type="idcard"
							maxlength={18}
							className="w-full text-right text-sm text-text-title h-full"
							placeholder="请输入18位身份证号"
							value={form.idCard}
							onInput={(e) => updateField('idCard', e.detail.value)}
						/>
					</FormItem>

					<FormItem label="手机号码" border={false}>
						<Input
							type="number"
							maxlength={11}
							className="w-full text-right text-sm text-text-title h-full"
							placeholder="请输入常用联系电话"
							value={form.phone}
							onInput={(e) => updateField('phone', e.detail.value)}
						/>
					</FormItem>
				</Cell>

				{/* 区域二：居住地址 */}
				<Cell>
					<FormItem label="常住地区">
						<RegionPicker
							value={[
								form.provinceCode?.toString(),
								form.cityCode?.toString(),
								form.districtCode?.toString(),
							]}
							onChange={(res) => {
								updateField('provinceCode', Number(res.province.code));
								updateField('cityCode', Number(res.city.code));
								updateField('districtCode', Number(res.area.code));
								setRegionLabel(`${res.province.name} ${res.city.name} ${res.area.name}`);
							}}
						>
							<View className="flex items-center gap-1">
								<Text className={`text-sm ${regionLabel ? 'text-text-title' : 'text-gray-300'}`}>
									{regionLabel || '请选择省市区'}
								</Text>
								<View className="icon-[ph--caret-right-bold] text-gray-300 w-4 h-4" />
							</View>
						</RegionPicker>
					</FormItem>

					<FormItem label="详细地址" border={false}>
						<Input
							className="w-full text-right text-sm text-text-title h-full"
							placeholder="如：XX街道XX社区XX栋"
							value={form.address}
							onInput={(e) => updateField('address', e.detail.value)}
						/>
					</FormItem>
				</Cell>

				{/* 区域三：证件上传凭证 */}
				<Cell>
					<Heading title="上传身份证照片" size="sm" />
					<View className="flex flex-col gap-2 py-2">
						<View className="flex justify-between gap-4">
							{/* 身份证正面 (人像面) */}
							<ImageUploader
								value={form.idCardFront ? [form.idCardFront] : []}
								onChange={(urls) => updateField('idCardFront', urls[0])}
								onUpload={(files) => uploadFront(files)}
								isUploading={isUploadingFront}
								icon="icon-[ph--cardholder-duotone]"
								label="上传人像面"
							/>

							{/* 身份证反面 (国徽面) */}
							<ImageUploader
								value={form.idCardBack ? [form.idCardBack] : []}
								onChange={(urls) => updateField('idCardBack', urls[0])}
								onUpload={(files) => uploadBack(files)}
								isUploading={isUploadingBack}
								icon="icon-[ph--shield-check-duotone]"
								label="上传国徽面"
							/>
						</View>
						<Alert variant="info">请确保照片边缘完整、字迹清晰、无明显反光与遮挡</Alert>
					</View>
				</Cell>

				{/* 区域四：全局命令按钮 */}
				<View className="mt-6 px-1">
					<Button
						size="xl"
						variant="primary"
						loading={isSubmitting}
						disabled={isSubmitting}
						onClick={handleSave}
					>
						提交志愿者申请
					</Button>
				</View>
			</View>
		</Page>
	);
}
