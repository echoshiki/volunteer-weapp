import { View, Picker, PickerMultiSelectorProps } from '@tarojs/components';
import { useState, useEffect, useRef, useCallback } from 'react';
import pcaData from '@/assets/data/pca-code.json';
import { getTenantListAPI } from '@/services/tenant';
import Taro from '@tarojs/taro';

/** 回调方法属性类型 */
export interface TenantChangeEventProps {
	/** 选择的区域 ID */
	tenantId: number;
	/** 选择的区域名称 */
	tenantName: string;
	/** 选择的省份 */
	provinceCode: number;
	/** 选择的城市 */
	cityCode: number;
	/** 选择的区县 */
	districtCode: number;
}

export interface TenantPickerProps {
	/** 选择回调 */
	onChange: (params: TenantChangeEventProps) => void;
	children: React.ReactNode;
	disabled?: boolean;
}

/**
 * Tenant 业务选择器
 * 扩展调用的微信原生选择器（Picker）来展示自定义级区域选择
 * @param onChange 选中时抛出：租户 Code, name
 * @param children 触发选择器的 UI 插槽
 * @param disabled 是否禁用
 */
export const TenantPicker = ({ onChange, children, disabled = false }: TenantPickerProps) => {
	// 状态：原生 Picker 初始数据
	const [range, setRange] = useState<string[][]>([[], [], [], []]);
	// 状态：初始数据索引
	const [indexes, setIndexes] = useState<number[]>([0, 0, 0, 0]);

	// 用 useRef 缓存当前的节点数据
	const dataRef = useRef({
		provs: pcaData,
		cities: pcaData[0]?.children || [],
		areas: pcaData[0]?.children[0]?.children || [],
		tenants: [] as { id: number; name: string }[],
	});

	// ==========================================
	// 核心引擎：根据前三级的状态，刷新列数据并请求自定义级
	// ==========================================
	const updateColumns = useCallback(async (pIdx: number, cIdx: number, aIdx: number) => {
		const provs = pcaData;
		const cities = provs[pIdx]?.children || [];
		const areas = cities[cIdx]?.children || [];

		// 拿到当前选中的区 Code
		const currentAreaCode = areas[aIdx]?.code;

		// 先把前三列更新上去，第 4 列显示“加载中”
		setRange([
			provs.map((p) => p.name),
			cities.map((c) => c.name),
			areas.map((a) => a.name),
			['加载中...'],
		]);

		try {
			// 发起自定义级数据请求
			if (currentAreaCode) {
				const { list } = await getTenantListAPI(currentAreaCode);
				dataRef.current = { provs, cities, areas, tenants: list || [] };

				const tenantNames =
					list && list.length > 0 ? list.map((t) => t.name) : ['暂无街道/协会'];

				// 自定义级数据回来后，更新到第 4 列
				setRange([
					provs.map((p) => p.name),
					cities.map((c) => c.name),
					areas.map((a) => a.name),
					tenantNames,
				]);
			}
		} catch (error) {
			dataRef.current = { provs, cities, areas, tenants: [] };
			setRange([
				provs.map((p) => p.name),
				cities.map((c) => c.name),
				areas.map((a) => a.name),
				['获取失败'],
			]);
		}
	}, []);

	// ==========================================
	// 初始化：组件挂载时，默认加载第一组数据
	// ==========================================
	useEffect(() => {
		updateColumns(0, 0, 0);
	}, [updateColumns]);

	// ==========================================
	// 滑动事件：某一列滑动时触发级联运算
	// ==========================================
	const handleColumnChange: PickerMultiSelectorProps['onColumnChange'] = (e) => {
		const { column, value } = e.detail;
		let [p, c, a, t] = indexes;

		// 根据滑动的列，重置后续列的索引
		if (column === 0) {
			p = value;
			c = 0;
			a = 0;
			t = 0;
			updateColumns(p, c, a);
		} else if (column === 1) {
			c = value;
			a = 0;
			t = 0;
			updateColumns(p, c, a);
		} else if (column === 2) {
			a = value;
			t = 0;
			updateColumns(p, c, a);
		} else if (column === 3) {
			t = value; // 仅滑动第 4 级，不需要发请求，只记索引
		}

		setIndexes([p, c, a, t]);
	};

	// ==========================================
	// 确认事件：用户点击右上方“确定”时触发
	// ==========================================
	const handleChange: PickerMultiSelectorProps['onChange'] = (e) => {
		const [pIdx, cIdx, aIdx, tIdx] = e.detail.value;
		const { provs, cities, areas, tenants } = dataRef.current;

		const selectedTenant = tenants[tIdx];

		if (selectedTenant) {
			const pCode = Number(provs[pIdx].code);
			const cCode = Number(cities[cIdx].code);
			const aCode = Number(areas[aIdx].code);
			onChange({
				tenantId: selectedTenant.id,
				tenantName: selectedTenant.name,
				provinceCode: pCode,
				cityCode: cCode,
				districtCode: aCode,
			});
		} else {
			// 做了兜底拦截，防止用户选了“暂无街道”还点确定
			Taro.showToast({ title: '当前地区暂无可用街道', icon: 'none' });
		}
	};

	return (
		<Picker
			mode="multiSelector"
			range={range}
			value={indexes}
			onChange={handleChange}
			onColumnChange={handleColumnChange}
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
