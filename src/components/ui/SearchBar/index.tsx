import { View, Text, Input } from '@tarojs/components';

interface Props {
	/** 是否只读模式（点击跳转） */
	readonly?: boolean;
	/** 输入框的值 */
	value?: string;
	/** 占位文字 */
	placeholder?: string;
	/** 只读模式下的点击回调 */
	onClick?: () => void;
	/** 输入回调 */
	onInput?: (e: any) => void;
	/** 确认搜索回调（点击键盘搜索） */
	onConfirm?: () => void;
	/** 点击右侧“搜索”文字按钮的回调 */
	onSearch?: () => void;
	/** 是否显示输入框边框 */
	showBtn?: boolean;
	/** 是否显示输入框边框 */
	showBorder?: boolean;
	/** 是否自动聚焦 */
	focus?: boolean;
}

/**
 * 基础搜索栏组件
 * - 支持只读模式（点击跳转）和编辑模式（输入搜索）
 * - 可选显示右侧“搜索”按钮
 * - 输入时显示清除按钮
 */
export const SearchBar = ({
	readonly = false,
	value = '',
	placeholder = '想找点什么？',
	onClick,
	onInput,
	onConfirm,
	onSearch,
	showBtn = false,
	showBorder = false,
	focus = false,
}: Props) => {
	return (
		<View className="flex w-full items-center gap-2">
			<View
				className={`flex-1 flex items-center h-10 px-4 rounded-lg bg-white transition-all ${showBorder ? 'border border-black/30' : ''} ${
					readonly ? 'active:opacity-70' : ''
				}`}
				onClick={() => readonly && onClick?.()}
			>
				<View className="icon-[ph--magnifying-glass-light] w-4 h-4 text-text-muted shrink-0" />

				{readonly ? (
					// 只读模式：展示为灰色占位文字
					<Text className="ml-2 text-sm text-text-muted/60 flex-1 truncate">
						{placeholder}
					</Text>
				) : (
					// 编辑模式：真实的 Input
					<View className="flex-1 flex items-center ml-2 ">
						<Input
							className="flex-1 h-full text-sm text-text-title"
							placeholder={placeholder}
							value={value}
							focus={focus}
							onInput={(e) => onInput?.(e.detail.value)}
							onConfirm={() => onConfirm?.()}
						/>
						{value && (
							<View
								className="icon-[lucide--circle-x] w-4 h-4 text-text-muted/40 ml-2"
								onClick={(e: any) => {
									e.stopPropagation();
									onInput?.('');
								}}
							/>
						)}
					</View>
				)}
			</View>

			{/* 右侧搜索按钮 */}
			{showBtn && !readonly && (
				<Text
					className="text-sm bg-primary px-6 h-10 rounded flex items-center justify-center text-white active:opacity-60 transition-opacity"
					onClick={() => onSearch?.()}
				>
					搜索
				</Text>
			)}
		</View>
	);
};
