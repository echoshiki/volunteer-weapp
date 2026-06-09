import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Loading } from '../Loading';

export interface UploadedFile {
	filePath: string;
	fileName: string;
	fileType: string;
	fileSize: number;
}

export interface FileUploaderProps {
	/** 选中的文件单项（单文件模式）或数组 */
	value?: UploadedFile | null;
	/** 文件变更回调 */
	onChange?: (value: UploadedFile | null) => void;
	/** 外部统一的公共上传接口 Hook 函数，传入临时路径，返回公网 URL 数组 */
	onUpload: (files: string[]) => Promise<string[]>;
	/** 上传状态控制 */
	isUploading?: boolean;
	/** 选定格式限制 */
	extension?: string[];
	/** 虚线框内核心图标 */
	icon?: string;
	/** 提示主文本 */
	label?: string;
	/** 提示副文本 */
	subLabel?: string;
	/** 是否只读模式 */
	readonly?: boolean;
	className?: string;
}

/**
 * 文档文件上传组件
 * @description 专为 PDF/Word/Excel 等微信聊天文件上传量身定制，像素级对齐 ImageUploader 交互美学
 */
export const FileUploader = ({
	value = null,
	onChange,
	onUpload,
	isUploading = false,
	extension = ['pdf', 'doc', 'docx', 'png', 'jpg'],
	icon = 'icon-[ph--folder-open-duotone]',
	label = '选择聊天记录中的文件',
	subLabel = '支持 PDF、Word 等格式文档',
	readonly = false,
	className = '',
}: FileUploaderProps) => {
	const hasFile = !!value;

	// 动作：调起微信原生聊天文件选择器
	const handleUpload = async () => {
		if (isUploading || readonly) return;

		try {
			const res = await Taro.chooseMessageFile({
				count: 1,
				type: 'file',
				extension: extension,
			});

			if (!res.tempFiles.length) return;
			const file = res.tempFiles[0];

			// 触发外部公共上传能力
			const uploadedUrls = await onUpload([file.path]);

			if (uploadedUrls.length > 0) {
				onChange?.({
					filePath: uploadedUrls[0],
					fileName: file.name,
					fileType: file.name.split('.').pop() || 'pdf',
					fileSize: file.size,
				});
			}
		} catch (e) {
			console.error('FileUploader 选择或上传失败:', e);
		}
	};

	// 动作：一键擦除清除文件
	const handleDelete = (e: any) => {
		e.stopPropagation(); // 必须强力拦截防冒泡
		onChange?.(null);
	};

	return (
		<View
			className={`relative w-full aspect-video rounded-card overflow-hidden border-2 border-dashed flex flex-col items-center justify-center transition-colors
                ${hasFile ? 'border-transparent bg-gray-50' : 'border-gray-200 bg-gray-50'} 
                ${!hasFile && !readonly ? 'active:bg-gray-100 cursor-pointer' : ''} ${className}`}
			onClick={!hasFile ? handleUpload : undefined}
		>
			{isUploading && <Loading showTitle={false} />}

			{hasFile ? (
				<View className="absolute inset-0 p-6 flex flex-col items-center justify-between bg-linear-to-b from-blue-50/30 to-white">
					<View className="flex flex-col items-center justify-center">
						<View
							className={`size-12 shrink-0 ${
								value.fileType.toLowerCase().includes('pdf')
									? 'icon-[ph--file-pdf-duotone] text-red-500'
									: 'icon-[ph--file-doc-duotone] text-primary'
							}`}
						/>
						<Text className="text-sm font-bold text-text-title truncate block">
							{value.fileName}
						</Text>
						{value.fileSize && (
							<Text className="text-xs text-text-muted font-num mt-1 block">
								{(value.fileSize / 1024).toFixed(1)} KB
							</Text>
						)}
					</View>

					{/* 控制区：仅在非只读状态展示擦除按钮 */}
					{!readonly && (
						<View className="flex justify-end">
							<View
								className="text-xs font-bold text-red-500 px-4 py-1.5 bg-red-50 active:bg-red-100 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
								onClick={handleDelete}
							>
								<View className="icon-[ph--trash-bold] size-3.5" />
								移除并更换
							</View>
						</View>
					)}
				</View>
			) : (
				<View className="flex flex-col items-center justify-center gap-2 px-4 text-center">
					<View className={`${icon} size-9 text-gray-300`} />
					<Text className="text-sm font-bold text-text-title">{label}</Text>
					{subLabel && <Text className="text-xs text-text-muted">{subLabel}</Text>}
				</View>
			)}
		</View>
	);
};
