import {
	Avatar,
	Badge,
	Cell,
	DatePicker,
	FormItem,
	Page,
	RegionPicker,
	Button,
	Heading,
	Description,
	Loading,
} from '@/components/ui';
import { UserIdentityBadge } from '@/components/biz';
import { SEX_OPTIONS } from '@/constants/user';
import { useUpdateUser } from '@/hooks/useUser';
import { View, Text, Input, Textarea } from '@tarojs/components';
import { useState } from 'react';

export default function UserProfilePage() {
	const {
		form,
		userInfo,
		isProvider,
		providerProfile,
		isProviderLoading,
		resume,
		updateResume,
		updateField,
		onChooseAvatar,
		handleSave,
		isSaving,
	} = useUpdateUser();

	// 状态：回显表单里的地区
	const [regionLabel, setRegionLabel] = useState(() => {
		if (!userInfo?.provinceName) return '';
		return `${userInfo.provinceName} ${userInfo.cityName ?? ''} ${userInfo.districtName ?? ''}`.trim();
	});

	const isVolunteer = userInfo?.identity === 'volunteer';
	const isInstitution = userInfo?.identity === 'institution';

	return (
		<Page className="pt-4 pb-10">
			<View className="container-x flex flex-col gap-4">
				{/* 头像区 */}
				<Cell>
					<View className="flex flex-col items-center py-2">
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

				{/* 基本资料 */}
				<Cell>
					<Heading title="基本信息" size="md" />
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
									key={opt.value}
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

				{/* 服务方认证资料（已认证志愿者/机构可见） */}
				{isProvider && (
					<>
						{isProviderLoading ? (
							<Cell className="py-8">
								<Loading title="正在加载认证资料..." />
							</Cell>
						) : providerProfile ? (
							<>
								{/* 服务战绩与认证概要 */}
								<Cell className="p-4 flex flex-col gap-3">
									<View className="flex items-center justify-between">
										<Heading title="认证资料" size="md" className="w-56" />
									</View>

									{/* 战绩指标 */}
									<View className="grid grid-cols-2 gap-3 text-center my-1">
										<View className="bg-gray-50 rounded-lg p-3 flex flex-col justify-center">
											<Text className="text-xs text-text-muted mb-1">累计服务单数</Text>
											<Text className="text-2xl font-bold font-num text-orange-500">
												{providerProfile.serviceCount || 0}{' '}
												<Text className="text-xs font-normal">单</Text>
											</Text>
										</View>

										{isVolunteer ? (
											<View className="bg-gray-50 rounded-lg p-3 flex flex-col justify-center">
												<Text className="text-xs text-text-muted mb-1">志愿服务总时长</Text>
												<Text className="text-2xl font-bold font-num text-primary">
													{providerProfile.duration || 0}{' '}
													<Text className="text-xs font-normal">小时</Text>
												</Text>
											</View>
										) : (
											<View className="bg-gray-50 rounded-lg p-3 flex flex-col justify-center">
												<Text className="text-xs text-text-muted mb-1">入驻时间</Text>
												<Text className="text-xs text-text-body line-clamp-1">
													{providerProfile.reviewTime
														? `${providerProfile.reviewTime.split(' ')[0]}`
														: '已官方核验'}
												</Text>
											</View>
										)}
									</View>

									{/* 详细认证字段（只读查看） */}
									{isVolunteer && (
										<>
											<Description
												label="志愿者姓名"
												value={providerProfile.realName}
												variant="between"
											/>
											<Description
												label="服务区域"
												value={providerProfile.tenantName}
												variant="between"
											/>
										</>
									)}

									{isInstitution && (
										<>
											<Description
												label="机构负责人"
												value={providerProfile.realName}
												variant="between"
											/>
											<Description
												label="直属服务机构"
												value={providerProfile.institutionName}
												variant="between"
											/>
											<Description
												label="常驻服务区域"
												value={providerProfile.tenantName}
												variant="between"
											/>
										</>
									)}

									<Description
										label="认证核验时间"
										value={providerProfile.reviewTime || '暂无记录'}
										variant="between"
									/>

									<Description
										label="服务点地址"
										value={providerProfile.address || '暂无详细登记的办公驻地'}
										variant="between"
									/>
								</Cell>

								{/* 服务履历（可编辑） */}
								<Cell className="p-4 flex flex-col gap-2">
									<Heading title="服务优势" size="md" subtitle="可填写您的特长专长与服务经验" />
									<View className="mt-2 bg-gray-50 rounded-lg p-3">
										<Textarea
											className="w-full h-32 box-border text-sm text-text-title leading-relaxed overflow-hidden"
											placeholder="请填写您的服务履历、技能特长或过往志愿经验..."
											maxlength={500}
											value={resume}
											onInput={(e) => updateResume(e.detail.value)}
										/>
										<View className="text-right text-xs text-text-muted mt-1">
											{(resume || '').length}/500
										</View>
									</View>
								</Cell>
							</>
						) : null}
					</>
				)}

				{/* 保存 */}
				<Button size="xl" variant="primary" loading={isSaving} disabled={isSaving} onClick={handleSave}>
					保存资料
				</Button>
			</View>
		</Page>
	);
}
