import { generateCertificateAPI, GenerateCertRequest } from '@/services/certificate';
import { showErrorToast } from '@/utils/common';
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
			showErrorToast(err, '荣誉证书加印失败，请联系社区管理员');
		},
	});

	return {
		generateCertificate: certMutation.mutateAsync,
		isGenerating: certMutation.isLoading,
	};
};
