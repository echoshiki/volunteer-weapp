import { View, Picker, PickerRegionProps } from '@tarojs/components';

/** 顶级区域节点类型 */
export interface RegionNode {
	code: string;
	name: string;
}

/** 转换后的区域数据类型 */
export interface RegionChangeResult {
	province: RegionNode;
	city: RegionNode;
	area: RegionNode;
	rawCodes: string[];
	rawNames: string[];
}

export interface Props {
	/** 初始省市区，['130000', '130100', '130102'] 自动回显汉字 */
	value?: string[];
	/** 选择完成后的回调函数，抛出 code 数组和 name 数组 */
	onChange: (result: RegionChangeResult) => void;
	/** 触发选择器的 UI 插槽 */
	children: React.ReactNode;
	/** 是否禁用 */
	disabled?: boolean;
}

/**
 * 省市区级联组件
 * 调用小程序原生 RegionPicker 组件，实现省、市、区三级联动
 * 调用：
 * <RegionPicker onChange={(res) => console.log(res)}>
 *     选择地区
 * </RegionPicker>
 */
export const RegionPicker = ({
	value = ['321000', '321100', '321102'],
	onChange,
	children,
	disabled = false,
}: Props) => {
	// 拦截原生事件，转换为我们规范的数据结构抛出
	const handleChange: PickerRegionProps['onChange'] = (e) => {
		const names = e.detail.value;
		const codes = e.detail.code;
		if (codes && codes.length >= 3) {
			onChange({
				province: { code: codes[0], name: names[0] },
				city: { code: codes[1], name: names[1] },
				area: { code: codes[2], name: names[2] },
				rawCodes: codes,
				rawNames: names,
			});
		} else {
			console.warn('获取行政区划异常', e.detail);
		}
	};

	return (
		<Picker mode="region" value={value} onChange={handleChange} disabled={disabled}>
			<View
				className={`w-full ${disabled ? 'opacity-50' : 'active:opacity-60 transition-opacity'}`}
			>
				{children}
			</View>
		</Picker>
	);
};
