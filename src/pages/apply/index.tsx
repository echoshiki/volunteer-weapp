import { View, Text } from '@tarojs/components';
import { Page, Heading, Alert, EntryCard } from '@/components/ui';

/**
 * 用户认证申请入口页
 */
export default function UserApplyPage() {
	return (
		<Page className="container-x">
			<View className="py-6">
				<Heading
					title="选择认证类型"
					size="lg"
					link={{ name: '申请记录', url: '/pages/apply/history/index' }}
				/>
				<Alert>
					<Text>
						请选择您要申请的认证类型，认证成功后，您可以在“申请记录”中查看认证结果。
					</Text>
				</Alert>
			</View>

			<View className="flex flex-col gap-4">
				{/* 志愿者认证入口卡片 */}
				<EntryCard
					title="志愿者认证"
					desc="适合个人用户。申请通过后自动挂钩当前地区的志愿者协会，可参与丰富的社区志愿服务活动。"
					icon="icon-[ph--user-focus-duotone]"
					url="/pages/apply/volunteer/index"
					theme="blue"
				/>

				{/* 服务机构入驻入口卡片 */}
				<EntryCard
					title="服务机构入驻"
					desc="适合企业、社会组织及个体商户。入驻成功后由系统派发管理权限，可自主发布志愿项目与社区需求。"
					icon="icon-[ph--buildings-duotone]"
					url="/pages/apply/institution/index"
					theme="orange"
				/>
			</View>
		</Page>
	);
}
