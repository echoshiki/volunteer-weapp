import { View, Picker, PickerDateProps } from '@tarojs/components';

export interface DatePickerProps {
	/** 当前选中的日期，格式：YYYY-MM-DD */
	value?: string;
	/** 有效日期的起始范围，格式需与 fields 匹配 (如 YYYY-MM-DD) */
	start?: string;
	/** 有效日期的结束范围，格式需与 fields 匹配 (如 YYYY-MM-DD) */
	end?: string;
	/** 选择器的粒度。可选：year, month, day。默认：day */
	fields?: 'year' | 'month' | 'day';
	/** 选择完成后的回调函数，抛出标准的日期字符串 */
	onChange: (dateStr: string) => void;
	/** 触发选择器的 UI 插槽 */
	children: React.ReactNode;
	/** 是否禁用 */
	disabled?: boolean;
}

/**
 * 日期选择组件
 * 调用小程序原生 DatePicker 组件
 * 调用：
 * <DatePicker onChange={(dateStr) => console.log(dateStr)}>
 *   选择日期
 * </DatePicker>
 */
export const DatePicker = ({
	value,
	start,
	end,
	fields = 'day',
	onChange,
	children,
	disabled = false,
}: DatePickerProps) => {
	// 拦截原生事件，做一层极简的防错校验后抛出
	const handleChange: PickerDateProps['onChange'] = (e) => {
		const dateStr = e.detail.value;
		if (dateStr) {
			onChange(dateStr);
		}
	};

	return (
		<Picker
			mode="date"
			value={value || ''}
			start={start}
			end={end}
			fields={fields}
			onChange={handleChange}
			disabled={disabled}
		>
			<View
				className={`w-full ${disabled ? 'opacity-50' : 'active:opacity-60 transition-opacity'}`}
			>
				{children}
			</View>
		</Picker>
	);
};
