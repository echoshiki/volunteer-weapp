import { Page } from '@/components/ui';
import { usePublishDemand } from '@/hooks/useDemand';
import { DemandForm } from '@/components/biz';
import Taro from '@tarojs/taro';

export default function PublishDemandPage() {
	const { mutate: publishDemand, isLoading } = usePublishDemand();

	const handleFormSubmit = (formData: any) => {
		publishDemand(formData, {
			onSuccess: () => {
				Taro.showModal({
					title: '提交成功',
					content:
						'您的需求已成功提交系统。为了保障平台互助环境的安全，管理员将在24小时内完成内容合规审核，审核通过后将正式对服务方开放接单，请耐心等待。',
					confirmText: '我知道了',
					showCancel: false,
					success: (modalRes) => {
						if (modalRes.confirm) {
							const pages = Taro.getCurrentPages();
							if (pages.length > 1) {
								Taro.navigateBack({ delta: 1 });
							} else {
								Taro.reLaunch({ url: '/pages/demand/index' });
							}
						}
					},
				});
			},
			onError: (err: any) => console.error('需求发布失败:', err),
		});
	};

	return (
		<Page hasTabBar>
			<DemandForm submitText="提交需求审核" isSubmitting={isLoading} onSubmit={handleFormSubmit} />
		</Page>
	);
}
