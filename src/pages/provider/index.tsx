import { View, Image, Text } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import { Page, Cell, Heading, Loading, Empty, Description } from '@/components/ui';
import { UserIdentityBadge } from '@/components/biz';
import { useProviderProfile } from '@/hooks/useProvider';

export default function ProviderPage() {
	const { params } = useRouter();
	const userId = Number(params.id);

	// 触发重构后的全新数据管道
	const { data: profile, isLoading } = useProviderProfile(userId);

	if (isLoading) return <Loading />;
	if (!profile) return <Empty title="未找到该服务方合规公开资料" />;

	const isVolunteer = profile.identity === 'volunteer';
	const isInstitution = profile.identity === 'institution';

	// 动态决定头部卡片呈现的核心名称
	const displayName = isInstitution ? profile.institutionName || '未命名服务机构' : profile.realName || '爱心志愿者';

	return (
		<Page className="bg-main-bg min-h-screen pb-6">
			<View className="container-x py-4 space-y-4">
				{/* 头像与认证级别卡片 */}
				<Cell className="flex flex-col items-center pt-8 pb-6 relative overflow-hidden">
					{/* 顶部质感条 */}
					<View className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-500 to-indigo-600" />

					<Image
						src={profile.avatar || 'https://placeholder.com/150'}
						className="size-20 rounded-full border-4 border-white shadow-md bg-gray-50 mb-3"
					/>

					<View className="flex items-center gap-2 mb-1 px-4 text-center">
						<Text className="text-lg font-bold text-text-title line-clamp-1">{displayName}</Text>
					</View>

					<View className="flex items-center gap-2 mt-1">
						<UserIdentityBadge value={profile.identity} />
						<Text className="text-xs text-text-muted flex items-center gap-1">
							{profile.provinceName}·{profile.cityName}·{profile.districtName}
						</Text>
					</View>
				</Cell>

				{/* 核心战绩数据看板卡片 */}
				<Cell className="p-4">
					<Heading title="服务档案" size="md" className="mb-3" />
					<View className="grid grid-cols-2 gap-4 text-center">
						<View className="bg-gray-50 rounded-lg p-3 flex flex-col justify-center">
							<Text className="text-xs text-text-muted mb-1">累计服务单数</Text>
							<Text className="text-sm font-bold font-num text-orange-500">
								{profile.serviceCount || 0} <Text className="text-sm font-normal">单</Text>
							</Text>
						</View>

						{/* 根据类型进行分流展示 */}
						{isVolunteer ? (
							<View className="bg-gray-50 rounded-lg p-3 flex flex-col justify-center">
								<Text className="text-xs text-text-muted mb-1">志愿服务总时长</Text>
								<Text className="text-sm font-bold font-num text-primary">
									{profile.duration || 0} <Text className="font-normal">小时</Text>
								</Text>
							</View>
						) : (
							<View className="bg-gray-50 rounded-lg p-3 flex flex-col justify-center">
								<Text className="text-xs text-text-muted mb-1">官方认证年资</Text>
								<Text className="text-sm text-text-body line-clamp-1 px-1">
									{profile.reviewTime ? `${profile.reviewTime.split(' ')[0]} 入驻` : '已官方核验'}
								</Text>
							</View>
						)}
					</View>
				</Cell>

				{/* 官方去敏感信息认证详情卡片 */}
				<Cell className="p-4 flex flex-col gap-3">
					<Heading title="认证信息" size="md" className="mb-1" />

					{/* 志愿者(个人)核心信息呈现 */}
					{isVolunteer && (
						<>
							<Description label="志愿者姓名" value={profile.realName} variant="between" />
							<Description label="服务区域" value={profile.tenantName} variant="between" />
						</>
					)}

					{/* 机构(组织)核心信息呈现 */}
					{isInstitution && (
						<>
							<Description label="机构负责人" value={profile.realName} variant="between" />
							<Description label="直属服务机构" value={profile.institutionName} variant="between" />
							<Description label="常驻服务区域" value={profile.tenantName} variant="between" />
						</>
					)}

					<Description label="认证核验时间" value={profile.reviewTime || '暂无记录'} variant="between" />

					<Description
						label="服务点地址"
						value={profile.address || '暂无详细登记的办公驻地'}
						variant="between"
					/>
				</Cell>
			</View>
		</Page>
	);
}
