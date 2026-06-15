import { Avatar, Badge, Cell, DatePicker, FormItem, Page, RegionPicker, Button } from '@/components/ui';
import { SEX_OPTIONS } from '@/constants/user';
import { useUpdateUser } from '@/hooks/useUser';
import { View, Text, Input } from '@tarojs/components';
import { useState } from 'react';

export default function UserProfilePage() {
	const { form, userInfo, updateField, onChooseAvatar, handleSave, isSaving } = useUpdateUser();

	// 状态：回显表单里的地区
	const [regionLabel, setRegionLabel] = useState(() =>
		[userInfo?.provinceName, userInfo?.cityName, userInfo?.districtName].filter(Boolean).join(' '),
	);

	return (
		<Page className="pt-4 pb-10">
			<View className="container-x flex flex-col gap-4">
				{/* 头像区 */}
				<Cell>
					<View className="flex flex-col items-center py-6">
						<Button
							openType="chooseAvatar"
							onChooseAvatar={onChooseAvatar}
							variant="ghost"
							className="w-24 h-24"
						>
							<View className="relative">
								<Avatar src={form.avatar} size="xl" name={form.nickName} />
								<View className="absolute bottom-0 right-0 size-6 rounded-full p-1 bg-primary flex justify-center items-center">
									<View className="icon-[ph--camera] size-4 text-white" />
								</View>
							</View>
						</Button>
						<Text className="text-sm text-text-body mt-5">点击更换头像</Text>
					</View>
				</Cell>

				<Cell>
					{/* 昵称 */}
					<FormItem label="昵称">
						<Input
							type="nickname"
							className="text-right text-sm text-text-title h-full"
							placeholder="请输入昵称"
							value={form.nickName}
							onInput={(e) => updateField('nickName', e.detail.value)}
						/>
					</FormItem>

					{/* 性别 */}
					<FormItem label="性别">
						<View className="flex gap-3">
							{SEX_OPTIONS.map((opt) => (
								<Badge
									variant={opt.value === form.sex ? 'primary' : 'secondary'}
									onClick={() => updateField('sex', opt.value)}
									size="md"
								>
									{opt.label}
								</Badge>
							))}
						</View>
					</FormItem>

					{/* 生日 */}
					<FormItem label="生日">
						<DatePicker value={form.birthday} onChange={(value) => updateField('birthday', value)}>
							<Text className={`text-sm ${form.birthday ? 'text-text-title' : 'text-gray-300'}`}>
								{form.birthday || '请选择生日'}
							</Text>
						</DatePicker>
					</FormItem>

					{/* 地区 */}
					<FormItem label="所在地区">
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

					{/* 详细地址 */}
					<FormItem label="详细地址" border={false}>
						<Input
							className="text-right text-sm text-text-title h-full"
							placeholder="请输入详细地址"
							value={form.address}
							onInput={(e) => updateField('address', e.detail.value)}
						/>
					</FormItem>
				</Cell>

				{/* 保存 */}
				<Button size="xl" variant="primary" loading={isSaving} disabled={isSaving} onClick={handleSave}>
					保存资料
				</Button>
			</View>
		</Page>
	);
}
