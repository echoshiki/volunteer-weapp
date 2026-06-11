import { useRouter } from '@tarojs/taro';
import { View, Text, ScrollView, RichText } from '@tarojs/components';
import { useDemandDetail } from '@/hooks/useDemand';
import { Badge, Cell, Description, Empty, Heading, Loading, Page, Button } from '@/components/ui';
import { cleanHTML, mapsTo } from '@/utils/common';
import { useAuthStore } from '@/store/auth';
import Taro from '@tarojs/taro';

export default function DemandDetailPage() {
	const { params } = useRouter();
	const demandId = Number(params.id);

	// 数据：需求详情
	const { data: detail, isLoading } = useDemandDetail(demandId);

	// 判断是否是自己发布的需求单
	const { userInfo } = useAuthStore();
	const isMyDemand = detail?.userId === userInfo?.userId;

	// 是否为可接单角色
	const isServerRole = userInfo?.identity === 'volunteer' || userInfo?.identity === 'institution';

	if (isLoading) return <Loading />;
	if (!detail) return <Empty title="未找到该需求" />;

	const handleCallPublisher = () => {
		if (isMyDemand) return;
		Taro.makePhoneCall({ phoneNumber: detail.phone });
	};

	const handleBidClick = () => {
		if (isMyDemand) return;
		if (detail.isBid) return;
		if (isServerRole) {
			mapsTo(`/pages/demand/bid/index?id=${demandId}&charge=${detail.charge}`);
		} else {
			Taro.showModal({
				title: '需要服务方认证',
				content: '很抱歉，当前社区互助需求仅限平台实名认证的“志愿者”或“志愿组织”承接。',
				confirmText: '去入驻',
				success: (res) => {
					if (res.confirm) mapsTo('/pages/apply/index');
				},
			});
		}
	};

	// 报价按钮配置
	const getBidButtonConfig = () => {
		if (isMyDemand) {
			return {
				text: '无法承接自己的需求',
				disabled: true,
				icon: 'icon-[ph--prohibit]',
			};
		}
		if (detail.isBid) {
			return {
				text: '已提交接单申请',
				disabled: true,
				icon: 'icon-[ph--check-circle]',
			};
		}
		return {
			text: '立即接单/报价',
			disabled: false,
			variant: 'primary' as const,
			icon: 'icon-[ph--hand-coins]',
		};
	};
	const buttonConfig = getBidButtonConfig();

	return (
		<Page hasTabBar>
			<ScrollView scrollY className="h-full">
				{/* 头部核心信息 */}
				<Cell className="border-b border-gray-100 py-6" rounded={false}>
					<View className="flex items-center gap-2 mb-3">
						<Badge variant="info">{detail.categoryName}</Badge>
						{detail.charge && <Badge variant="success">公益</Badge>}
					</View>
					<Text className="text-lg font-bold text-text-title leading-normal line-clamp-3">
						{detail.demandName}
					</Text>
					<View className="flex items-center gap-4 mt-4 text-xs text-text-muted">
						<View className="flex flex-wrap items-center gap-1">
							{detail.tags.map((tag) => (
								<View key={tag.tagId} className="flex items-center gap-1">
									<View className="icon-[ph--tag] size-4 text-primary" />
									<Text>{tag.tagName}</Text>
								</View>
							))}
						</View>
					</View>
				</Cell>

				{/* 服务需求描述 */}
				<Cell className="mt-3" rounded={false}>
					<Heading title="需求描述" size="md" />
					<RichText nodes={cleanHTML(detail.content)} />
				</Cell>

				{/* 服务明细卡片 */}
				<Cell className="mt-3" rounded={false}>
					<Heading title="服务信息" size="md" />
					<View className="flex flex-col gap-2.5 bg-main-bg p-4 rounded-card">
						<Description label="服务分类" value={detail.categoryName} />
						<Description label="是否公益" value={detail.charge ? '是' : '否'} />
						<Description label="联系人" value={detail.name} />
						<Description label="联系电话" value={detail.phone} />
						<Description
							label="服务区域"
							value={`${detail.provinceName} ${detail.cityName} ${detail.districtName} ${detail.tenantName}`}
						/>
						<Description label="服务地址" value={detail.address} />
						<Description
							label="预算范围"
							value={`${detail.minMoney || '不限'} - ${detail.maxMoney || '不限'}`}
						/>
					</View>
				</Cell>
			</ScrollView>

			{/* 底部操作栏 */}
			<Cell className="fixed bottom-0 inset-x-0 border-t border-gray-100 flex flex-col gap-3">
				<Text className="text-xs text-text-body">
					已有 <Text className="text-primary font-bold text-base">{detail.serviceUserCount}</Text>{' '}
					人发送了接单申请
				</Text>

				<View className="w-full flex flex-row gap-2">
					<Button
						icon="icon-[ph--phone-call]"
						size="md"
						variant="info"
						disabled={isMyDemand}
						onClick={handleCallPublisher}
					>
						咨询发布者
					</Button>
					<Button
						icon={buttonConfig.icon}
						className="flex-1"
						variant={buttonConfig.variant}
						disabled={buttonConfig.disabled}
						onClick={handleBidClick}
					>
						{buttonConfig.text}
					</Button>
				</View>
			</Cell>
		</Page>
	);
}
