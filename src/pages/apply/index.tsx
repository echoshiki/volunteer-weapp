import { View, Text } from '@tarojs/components';
import { Page, Heading, Alert, EntryCard, Loading } from '@/components/ui';
import { useApplyHistory } from '@/hooks/useUser';
import { useMemo } from 'react';
import Taro from '@tarojs/taro';
import { mapsTo } from '@/utils/common';
import { getTenantId } from '@/utils/tenant';

/**
 * 用户认证申请入口页
 * 该大区如果存在审核中、已认证的记录，则无法再次申请
 * 申请驳、切换区域即可继续申请
 */
export default function UserApplyPage() {
	// 获取当前大区 ID
	const currentTenantId = Number(getTenantId());

	// 数据：认证申请记录集合
	const { list, isLoading } = useApplyHistory({});

	const getTenantCertificationStatus = () => {
		// 在历史记录查询属于当前大区的记录
		const currentTenantRecords = list.filter((item) => {
			if (item.reviewType === 2) return true;
			if (item.reviewType === 1) return Number(item.tenantId) === currentTenantId;
			return false;
		});

		// 判定当前大区是否有正在审核/已经完成的认证申请
		const isPending = currentTenantRecords.some((item) => item.status === 'pending');
		const isApproved = currentTenantRecords.some((item) => item.status === 'approved');

		return { isPending, isApproved };
	};

	const handleEntryClick = (targetUrl: string) => {
		const { isPending, isApproved } = getTenantCertificationStatus();

		// 是否存在正在审核中的认证申请
		if (isPending) {
			return Taro.showModal({
				title: '申请正在审核中',
				content: `您提交的认证申请正在加急审核中，请勿重复提交。`,
				confirmText: '查看进度',
				success: (res) => {
					if (res.confirm) mapsTo('/pages/apply/history/index');
				},
			});
		}

		// 是否存在已经完成的认证申请
		if (isApproved) {
			return Taro.showModal({
				title: '无需重复认证',
				content: `您已成功入驻当前区域的认证，请勿重复申请。`,
				showCancel: false,
				confirmText: '我知道了',
			});
		}

		mapsTo(targetUrl);
	};

	if (isLoading) return <Loading title="正在校准认证资质..." />;

	return (
		<Page className="container-x">
			<View className="py-6">
				<Heading
					title="选择认证类型"
					size="lg"
					link={{ name: '申请记录', url: '/pages/apply/history/index' }}
				/>
				<Alert>
					<Text>请选择您要申请的认证类型，认证成功后，您可以在“申请记录”中查看认证结果。</Text>
				</Alert>
			</View>

			<View className="flex flex-col gap-4">
				{/* 志愿者认证入口卡片 */}
				<EntryCard
					title="志愿者认证"
					desc="适合个人用户。申请通过后自动挂钩当前地区的志愿者协会，可参与丰富的社区志愿服务活动。"
					icon="icon-[ph--user-focus-duotone]"
					theme="blue"
					disabled={getTenantCertificationStatus().isApproved || getTenantCertificationStatus().isPending}
					onClick={() => handleEntryClick('/pages/apply/volunteer/index')}
				/>

				{/* 服务机构入驻入口卡片 */}
				<EntryCard
					title="服务机构入驻"
					desc="适合企业、社会组织及个体商户。入驻成功后由系统派发管理权限，可自主发布志愿项目与社区需求。"
					icon="icon-[ph--buildings-duotone]"
					theme="orange"
					disabled={getTenantCertificationStatus().isApproved || getTenantCertificationStatus().isPending}
					onClick={() => handleEntryClick('/pages/apply/institution/index')}
				/>
			</View>
		</Page>
	);
}
