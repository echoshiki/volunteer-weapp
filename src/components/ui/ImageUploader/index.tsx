import { View, Image, Text } from '@tarojs/components';
import { useUpload } from '@/hooks/useUpload';

export interface ImageUploaderProps {
	/** 当前绑定的值 (单图传 string，多图传 string[]) */
	value?: string | string[];
	/** 上传成功/删除后的回调 */
	onChange?: (value: string | string[]) => void;
	/** 最大图片数量，默认 1 */
	maxCount?: number;
	/** 上传框内部的提示文字 */
	placeholder?: string;
}

export const ImageUploader = ({
	value,
	onChange,
	maxCount = 1,
	placeholder = '点击上传',
}: ImageUploaderProps) => {
	const { triggerUpload, isUploading } = useUpload();

	// 格式化当前值为数组，方便统一渲染
	const imageList = Array.isArray(value) ? value : value ? [value] : [];

	// 判断是否还能继续上传
	const canUpload = imageList.length < maxCount;

	// 触发上传逻辑
	const handleUpload = async () => {
		if (isUploading) return;
		try {
			// 计算还能传几张
			const remainCount = maxCount - imageList.length;
			const newUrls = await triggerUpload(remainCount);

			if (newUrls.length > 0) {
				const updatedList = [...imageList, ...newUrls];
				// 如果 maxCount 为 1，直接抛出字符串；否则抛出数组
				onChange?.(maxCount === 1 ? updatedList[0] : updatedList);
			}
		} catch (e) {}
	};

	// 删除单张图片
	const handleDelete = (index: number) => {
		const updatedList = [...imageList];
		updatedList.splice(index, 1);
		onChange?.(maxCount === 1 ? '' : updatedList);
	};

	return (
		<View className="flex flex-wrap gap-3">
			{/* 已上传图片预览区 */}
			{imageList.map((url, index) => (
				<View
					key={`${url}-${index}`}
					className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50"
				>
					<Image src={url} className="w-full h-full object-cover" mode="aspectFill" />
					{/* 删除按钮 */}
					<View
						className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center active:scale-90 transition-transform z-10"
						onClick={(e) => {
							e.stopPropagation();
							handleDelete(index);
						}}
					>
						<View className="icon-[ph--x-bold] text-white w-3 h-3" />
					</View>
				</View>
			))}

			{/* 上传触发按钮区 (当未达到上限时显示) */}
			{canUpload && (
				<View
					onClick={handleUpload}
					className={`w-24 h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-colors
                        ${isUploading ? 'border-gray-200 bg-gray-50' : 'border-gray-300 bg-gray-50 active:bg-gray-100'}
                    `}
				>
					{isUploading ? (
						<View className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
					) : (
						<>
							<View className="icon-[ph--plus-bold] w-6 h-6 text-gray-400 mb-1" />
							<Text className="text-[10px] text-gray-400 font-medium tracking-widest">
								{placeholder}
							</Text>
						</>
					)}
				</View>
			)}
		</View>
	);
};
