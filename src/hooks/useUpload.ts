import { useState } from 'react';
import Taro from '@tarojs/taro';
import { uploadImageAPI } from '@/services/upload';

export const useUpload = () => {
	const [isUploading, setIsUploading] = useState(false);

	/**
	 * @param count 允许选择的数量 (默认 1)
	 * @returns 返回上传成功后的远程 URL 数组
	 */
	const triggerUpload = async (count: number = 1): Promise<string[]> => {
		try {
			// 唤起相册/相机
			const { tempFiles } = await Taro.chooseMedia({
				count,
				mediaType: ['image'],
				sourceType: ['album', 'camera'],
				sizeType: ['compressed'],
			});

			if (tempFiles.length === 0) return [];

			setIsUploading(true);
			Taro.showLoading({ title: '上传中...', mask: true });

			const uploadedUrls: string[] = [];

			// 遍历上传
			for (const file of tempFiles) {
				const data = await uploadImageAPI(file.tempFilePath);
				if (data.list && data.list.length > 0) {
					uploadedUrls.push(data.list[0].filePath);
				}
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
