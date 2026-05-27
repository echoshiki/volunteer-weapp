import { View, Text, Input } from '@tarojs/components';
import {
	Page,
	Cell,
	FormItem,
	RegionPicker,
	Button,
	Heading,
	Alert,
	UploadBox,
} from '@/components/ui';
import { useInstitutionApply } from '@/hooks/useUser';
import { useState } from 'react';

export default function ApplyInstitutionPage() {
	const { form, updateField, onUploadCert, handleSave, isSubmitting } = useInstitutionApply();

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

				{/* 区域二：法人与联系方式 */}
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
							value={form.phone}
							onInput={(e) => updateField('phone', e.detail.value)}
						/>
					</FormItem>
				</Cell>

				{/* 区域三：机构地址 */}
				<Cell>
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
								setRegionLabel(
									`${res.province.name} ${res.city.name} ${res.area.name}`,
								);
							}}
						>
							<View className="flex items-center gap-1">
								<Text
									className={`text-sm ${regionLabel ? 'text-text-title' : 'text-gray-300'}`}
								>
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

				{/* 区域四：资质凭证上传 */}
				<Cell className="flex flex-col gap-4 py-8">
					<Heading title="上传资质凭证" size="sm" />

					<View className="w-full mt-2 mb-1">
						{/* 机构资质（通常为单张宽幅证件） */}
						<UploadBox
							className="w-full"
							value={form.orgCodeCertUrl}
							onClick={onUploadCert}
							icon="icon-[ph--certificate-duotone]"
							label="上传营业执照 / 登记证书副本"
						/>
					</View>

					<Alert variant="info">请确保凭证边缘完整、公章清晰，格式支持 JPG、PNG</Alert>
				</Cell>

				{/* 区域五：底部控制区域 */}
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
