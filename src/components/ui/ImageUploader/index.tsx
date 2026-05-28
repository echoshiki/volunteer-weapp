import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Loading } from '../Loading';

export interface ImageUploaderProps {
	/** 图片地址 */
	value?: string[];
	/** 图片上传成功回调 */
	onChange?: (value: string[]) => void;
	/** 处理上传接口函数 */
	onUpload: (files: string[]) => Promise<string[]>;
	/** 最大上传数量 */
	maxCount?: number;
	/** 上传状态 */
	isUploading?: boolean;
	/** 显示在说明文字上方的图标 */
	icon?: string;
	/** 说明文字 */
	label?: string;
	className?: string;
}

/**
 * 图片上传组件
 * @description 支持多图/单图模式
 */
export const ImageUploader = ({
	value = [],
	onChange,
	maxCount = 1,
	onUpload,
	isUploading = false,
	icon = 'icon-[ph--image-duotone]',
	label = '上传图片',
	className = '',
}: ImageUploaderProps) => {
	const canUpload = value.length < maxCount;
	const isSingle = maxCount === 1;
	const hasImage = value.length > 0;

	// 执行：选择图片文件并调用执行 onUpload & onChange
	const handleUpload = async () => {
		if (isUploading) return;
		const { tempFiles } = await Taro.chooseMedia({
			count: maxCount - value.length,
			mediaType: ['image'],
			sourceType: ['album', 'camera'],
			sizeType: ['compressed'],
		});
		if (!tempFiles.length) return;
		try {
			const newUrls = await onUpload(tempFiles.map((f) => f.tempFilePath));
			if (newUrls.length) onChange?.([...value, ...newUrls]);
		} catch (e) {}
	};

	// 执行：删除图片
	const handleDelete = (index: number) => onChange?.(value.filter((_, i) => i !== index));

	// JSX：删除按钮
	const DeleteBtn = ({ index }: { index: number }) => (
		<View
			className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
			onClick={(e) => {
				e.stopPropagation();
				handleDelete(index);
			}}
		>
			<View className="icon-[ph--x-bold] text-white w-3 h-3" />
		</View>
	);

	return isSingle ? (
		// 单图模式
		<View
			className={`relative flex-1 aspect-video rounded-card overflow-hidden border-2 border-dashed
          			${hasImage ? 'border-transparent' : 'border-gray-200 bg-gray-50'} ${className}`}
			onClick={!hasImage ? handleUpload : undefined}
		>
			{isUploading ? (
				<View className="absolute inset-0 flex items-center justify-center bg-gray-50">
					<Loading showTitle={false} />
				</View>
			) : hasImage ? (
				<>
					<Image src={value[0]} className="w-full h-full" mode="aspectFill" />
					<View className="absolute inset-0 bg-black/20 flex items-center justify-center">
						<DeleteBtn index={0} />
					</View>
				</>
			) : (
				<View className="absolute inset-0 flex flex-col items-center justify-center gap-2">
					<View className={`${icon} size-8 text-gray-300`} />
					<Text className="text-xs text-gray-400">{label}</Text>
				</View>
			)}
		</View>
	) : (
		// 多图模式
		<View className={`flex flex-wrap gap-3 ${className}`}>
			{value.map((url, index) => (
				<View
					key={`${url}-${index}`}
					className="relative size-24 rounded-card overflow-hidden border border-gray-100"
				>
					<Image src={url} className="size-full" mode="aspectFill" />
					<DeleteBtn index={index} />
				</View>
			))}
			{canUpload && (
				// 上传触发器
				<View
					className="size-24 border-2 border-dashed border-gray-200 bg-gray-50 rounded-card flex flex-col items-center justify-center gap-1"
					onClick={handleUpload}
				>
					{isUploading ? (
						<Loading />
					) : (
						<>
							<View className={`${icon} size-7 text-gray-300`} />
							<Text className="text-xs text-gray-400">{label}</Text>
						</>
					)}
				</View>
			)}
		</View>
	);
};
