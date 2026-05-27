import { http } from '@/utils/http';
import { ListRes, UploadFileItem } from '@/types/common';

/**
 * 核心文件上传服务
 * @param filePath 本地临时文件路径
 */
export const uploadImageAPI = (filePath: string) => {
	return http.upload<ListRes<UploadFileItem>>('/file/upload', filePath, {
		name: 'file',
		showLoading: false,
	});
};
