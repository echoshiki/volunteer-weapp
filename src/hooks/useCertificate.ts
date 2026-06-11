import { generateCertificateAPI, GenerateCertRequest } from '@/services/certificate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Taro from '@tarojs/taro';

/**
 * 志愿者证书相关的高阶网关动作 Hook
 */
export const useCertificate = () => {
	const certMutation = useMutation({
		mutationFn: (data: GenerateCertRequest) => generateCertificateAPI(data),
		onError: (err) => {
			Taro.hideLoading();
			Taro.showToast({ title: '荣誉证书加印失败，请联系社区管理员', icon: 'none' });
			console.error('证书下发生错误:', err);
		},
	});

	return {
		generateCertificate: certMutation.mutateAsync,
		isGenerating: certMutation.isLoading,
	};
};
