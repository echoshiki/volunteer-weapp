import { useState } from 'react';
import Taro from '@tarojs/taro';
import { uploadImageAPI } from '@/services/upload';

/**
 * 上传图片 Hook
 */
export const useUpload = () => {
	const [isUploading, setIsUploading] = useState(false);

	/**
	 * @param count 允许选择的数量 (默认 1)
	 * @returns 返回上传成功后的远程 URL 数组
	 */
	const triggerUpload = async (filePaths: string[]): Promise<string[]> => {
		if (filePaths.length === 0) return [];
		setIsUploading(true);
		Taro.showLoading({ title: '上传中...', mask: true });
		try {
			const uploadedUrls: string[] = [];
			for (const path of filePaths) {
				const data = await uploadImageAPI(path);
				if (data.list?.length > 0) uploadedUrls.push(data.list[0].filePath);
			}
			return uploadedUrls;
		} catch (error) {
			console.error('上传图片中断或失败:', error);
			throw error;
		} finally {
			setIsUploading(false);
			Taro.hideLoading();
		}
	};

	return { triggerUpload, isUploading };
};
