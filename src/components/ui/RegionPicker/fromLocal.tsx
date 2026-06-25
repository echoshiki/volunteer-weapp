import { View, Picker, PickerMultiSelectorProps } from '@tarojs/components';
import { useEffect, useMemo, useState } from 'react';
import pcaData from '@/assets/data/pca-code.json';

export interface RegionNode {
	code: string;
	name: string;
}

export interface RegionPickerResult {
	province: RegionNode;
	city: RegionNode;
	district: RegionNode;
}

export interface RegionPickerProps {
	/** 初始选中值，传 code/name 数组 ['110000', '110100', '110101'] */
	value?: [string, string, string];
	onChange: (result: RegionPickerResult) => void;
	children: React.ReactNode;
	disabled?: boolean;
}

interface PcaNode {
	code: string;
	name: string;
	children?: PcaNode[];
}

const PCA_DATA = pcaData as PcaNode[];

export const RegionPicker = ({ value, onChange, children, disabled = false }: RegionPickerProps) => {
	const [indexes, setIndexes] = useState<[number, number, number]>([0, 0, 0]);

	// 根据当前索引派生三列数据
	const cols = useMemo(() => {
		const provinces = PCA_DATA;
		const cities = PCA_DATA[indexes[0]]?.children || [];
		const districts = cities[indexes[1]]?.children || [];
		return [provinces.map((p) => p.name), cities.map((c) => c.name), districts.map((d) => d.name)];
	}, [indexes]);

	const handleColumnChange: PickerMultiSelectorProps['onColumnChange'] = (e) => {
		const { column, value: val } = e.detail;
		setIndexes((prev) => {
			const next: [number, number, number] = [...prev] as [number, number, number];
			next[column] = val;
			// 重置后续列
			if (column === 0) {
				next[1] = 0;
				next[2] = 0;
			}
			if (column === 1) {
				next[2] = 0;
			}
			return next;
		});
	};

	const handleChange: PickerMultiSelectorProps['onChange'] = (e) => {
		const [pIdx, cIdx, dIdx] = e.detail.value as [number, number, number];
		const province = PCA_DATA[pIdx];
		const city = PCA_DATA[pIdx]?.children?.[cIdx];
		const district = PCA_DATA[pIdx]?.children?.[cIdx]?.children?.[dIdx];

		if (!province || !city || !district) return;

		onChange({
			province: { code: province.code, name: province.name },
			city: { code: city.code, name: city.name },
			district: { code: district.code, name: district.name },
		});
	};

	useEffect(() => {
		if (!value) return;
		const findIdx = (list: PcaNode[], val: string) => {
			let idx = list.findIndex((item) => item.code === val);
			if (idx === -1) idx = list.findIndex((item) => item.name === val);
			return idx === -1 ? 0 : idx;
		};
		const pIdx = findIdx(PCA_DATA, value[0]);
		const cities = PCA_DATA[pIdx]?.children || [];
		const cIdx = findIdx(cities, value[1]);
		const districts = cities[cIdx]?.children || [];
		const dIdx = findIdx(districts, value[2]);
		setIndexes([pIdx, cIdx, dIdx]);
	}, [value?.[0], value?.[1], value?.[2]]);

	return (
		<Picker
			mode="multiSelector"
			range={cols}
			value={indexes}
			onColumnChange={handleColumnChange}
			onChange={handleChange}
			disabled={disabled}
		>
			<View className={`w-full ${disabled ? 'opacity-50' : ''}`}>{children}</View>
		</Picker>
	);
};
