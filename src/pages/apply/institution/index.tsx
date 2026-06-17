import { View, Text, Input } from '@tarojs/components';
import { Page, Cell, FormItem, RegionPicker, Button, Alert, ImageUploader, Heading } from '@/components/ui';
import { useInstitutionApply } from '@/hooks/useUser';
import { useState } from 'react';
import { useUpload } from '@/hooks/useUpload';

export default function ApplyInstitutionPage() {
	const { form, updateField, handleSave, isSubmitting } = useInstitutionApply();

	// Hook：证件上传
	const { triggerUpload: uploadFront, isUploading: isUploadingFront } = useUpload();
	const { triggerUpload: uploadBack, isUploading: isUploadingBack } = useUpload();
	const { triggerUpload: uploadOrg, isUploading: isUploadingOrg } = useUpload();

	// 状态：回显表单里的地区
	const [regionLabel, setRegionLabel] = useState('');

	return (
		<Page className="pt-4 pb-10 bg-main-bg">
			<View className="container-x flex flex-col gap-4">
				{/* 区域一：机构主体信息 */}
				<Cell>
					<FormItem label="机构名称">
						<Input
							className="w-full text-right text-sm text-text-title h-full"
							placeholder="请填写营业执照上的登记名称"
							value={form.institutionName}
							onInput={(e) => updateField('institutionName', e.detail.value)}
						/>
					</FormItem>

					<FormItem label="信用代码" border={false}>
						<Input
							maxlength={18}
							className="w-full text-right text-sm text-text-title h-full"
							placeholder="18位统一社会信用代码"
							value={form.orgCode}
							onInput={(e) => updateField('orgCode', e.detail.value)}
						/>
					</FormItem>
				</Cell>

				{/* 区域二：法人与机构联系方式 */}
				<Cell>
					<FormItem label="法人姓名">
						<Input
							className="w-full text-right text-sm text-text-title h-full"
							placeholder="请输入法定代表人姓名"
							value={form.legalPerson}
							onInput={(e) => updateField('legalPerson', e.detail.value)}
						/>
					</FormItem>

					<FormItem label="联系电话" border={false}>
						<Input
							type="number"
							maxlength={11}
							className="w-full text-right text-sm text-text-title h-full"
							placeholder="请输入机构常用联系电话"
							value={form.legalPersonPhone}
							onInput={(e) => updateField('legalPersonPhone', e.detail.value)}
						/>
					</FormItem>

					<FormItem label="机构所在地">
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
							placeholder="如：XX路XX号楼XX室"
							value={form.address}
							onInput={(e) => updateField('address', e.detail.value)}
						/>
					</FormItem>
				</Cell>

				{/* 区域三：机构凭证上传 */}
				<Cell>
					<Heading title="上传营业执照" size="sm" />
					<View className="flex flex-col gap-2 py-2">
						<ImageUploader
							value={form.orgCodeCertUrl ? [form.orgCodeCertUrl] : []}
							onChange={(urls) => updateField('orgCodeCertUrl', urls[0])}
							onUpload={(files) => uploadOrg(files)}
							isUploading={isUploadingOrg}
							icon="icon-[ph--certificate-duotone]"
							label="上传营业执照 / 登记证书副本"
						/>

						<Alert variant="info">请确保凭证边缘完整、公章清晰，格式支持 JPG、PNG</Alert>
					</View>
				</Cell>

				{/* 区域四：负责人信息 */}
				<Cell>
					<FormItem label="负责人姓名">
						<Input
							className="w-full text-right text-sm text-text-title h-full"
							placeholder="请输入负责人姓名"
							value={form.realName}
							onInput={(e) => updateField('realName', e.detail.value)}
						/>
					</FormItem>

					<FormItem label="负责人电话" border={false}>
						<Input
							type="number"
							maxlength={11}
							className="w-full text-right text-sm text-text-title h-full"
							placeholder="请输入负责人电话"
							value={form.phone}
							onInput={(e) => updateField('phone', e.detail.value)}
						/>
					</FormItem>

					<FormItem label="负责人身份证号">
						<Input
							type="idcard"
							maxlength={18}
							className="w-full text-right text-sm text-text-title h-full"
							placeholder="请输入18位身份证号"
							value={form.idCard}
							onInput={(e) => updateField('idCard', e.detail.value)}
						/>
					</FormItem>
				</Cell>

				{/* 区域五：负责人证件上传 */}
				<Cell>
					<Heading title="上传负责人的身份证" size="sm" />
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

				{/* 区域六：底部控制区域 */}
				<View className="mt-6 px-1">
					<Button
						size="xl"
						variant="primary"
						loading={isSubmitting}
						disabled={isSubmitting}
						onClick={handleSave}
					>
						提交机构入驻申请
					</Button>
				</View>
			</View>
		</Page>
	);
}
