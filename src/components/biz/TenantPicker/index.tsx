import { View, Picker, PickerMultiSelectorProps } from '@tarojs/components';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getProvinceListAPI, getCityListAPI, getDistrictListAPI, getTenantListAPI } from '@/services/tenant';
import Taro from '@tarojs/taro';
import { RegionItem, TenantItem } from '@/types/common';
import { getTenantId } from '@/utils/tenant';

/** 默认选择的热门地区 */
const DEFAULT_HOT_REGION = {
	provinceCode: 320000,
	cityCode: 321000,
	districtCode: 321002,
};

export interface TenantChangeEventProps {
	tenantId: number;
	tenantName: string;
	provinceCode: number;
	cityCode: number;
	districtCode: number;
}

export interface TenantPickerProps {
	onChange: (params: TenantChangeEventProps) => void;
	children: React.ReactNode;
	disabled?: boolean;
}

/** 读取上次选择的省市区缓存，新用户返回热门默认值 */
const getLastRegion = () => ({
	provinceCode: Taro.getStorageSync('active_province_code') || DEFAULT_HOT_REGION.provinceCode,
	cityCode: Taro.getStorageSync('active_city_code') || DEFAULT_HOT_REGION.cityCode,
	districtCode: Taro.getStorageSync('active_district_code') || DEFAULT_HOT_REGION.districtCode,
});

/** 根据省 code 拉取市列表，并级联拉区、tenant */
const fetchCitiesAreasAndTenants = async (provinceCode: number) => {
	if (!provinceCode) return { cities: [], areas: [], tenants: [] };
	const { list: cities } = await getCityListAPI(provinceCode);
	const cityList = cities || [];
	const { areas, tenants } = await fetchAreasAndTenants(Number(cityList[0]?.areaCode));
	return { cities: cityList, areas, tenants };
};

/** 根据市 code 拉取区列表，并级联拉 tenant */
const fetchAreasAndTenants = async (cityCode: number) => {
	if (!cityCode) return { areas: [], tenants: [] };
	const { list: areas } = await getDistrictListAPI(cityCode);
	const areaList = areas || [];
	const tenants = await fetchTenants(Number(areaList[0]?.areaCode));
	return { areas: areaList, tenants };
};

/** 根据区 code 拉取 tenant 列表，兜底空数组 */
const fetchTenants = async (areaCode: number) => {
	if (!areaCode) return [];
	const { list } = await getTenantListAPI(areaCode);
	return list || [];
};

export const TenantPicker = ({ onChange, children, disabled = false }: TenantPickerProps) => {
	const [range, setRange] = useState<string[][]>([[], [], [], []]);
	const [indexes, setIndexes] = useState<number[]>([0, 0, 0, 0]);

	// 用 useRef 动态缓存每次从后端拉回来的真实节点大盘
	const dataRef = useRef({
		provs: [] as RegionItem[],
		cities: [] as RegionItem[],
		areas: [] as RegionItem[],
		tenants: [] as TenantItem[],
	});

	/** 把 dataRef 当前数据同步成 range 字符串数组 */
	const syncRange = useCallback(() => {
		const { provs, cities, areas, tenants } = dataRef.current;
		setRange([
			provs.map((p) => p.name),
			cities.map((c) => c.name),
			areas.map((a) => a.name),
			tenants.length ? tenants.map((t) => t.name) : ['暂无街道/协会'],
		]);
	}, []);

	// 初始化：拉满整条链路，并回显上次选择
	useEffect(() => {
		const init = async () => {
			try {
				const { list: provs } = await getProvinceListAPI();
				dataRef.current.provs = provs || [];

				const { provinceCode, cityCode, districtCode } = getLastRegion();
				const tenantId = getTenantId();

				const findIdx = (list: RegionItem[], code: number) => {
					const idx = list.findIndex((i) => Number(i.areaCode) === code);
					return idx === -1 ? 0 : idx;
				};

				const pIdx = findIdx(dataRef.current.provs, provinceCode);
				const pCode = Number(dataRef.current.provs[pIdx]?.areaCode);

				const { list: cities } = await getCityListAPI(pCode);
				dataRef.current.cities = cities || [];
				const cIdx = findIdx(dataRef.current.cities, cityCode);
				const cCode = Number(dataRef.current.cities[cIdx]?.areaCode);

				const { list: areas } = await getDistrictListAPI(cCode);
				dataRef.current.areas = areas || [];
				const aIdx = findIdx(dataRef.current.areas, districtCode);
				const aCode = Number(dataRef.current.areas[aIdx]?.areaCode);

				dataRef.current.tenants = await fetchTenants(aCode);
				const tIdx = Math.max(
					0,
					dataRef.current.tenants.findIndex((t) => t.id.toString() === tenantId),
				);

				setIndexes([pIdx, cIdx, aIdx, tIdx]);
				syncRange();
			} catch (e) {
				console.error('TenantPicker 初始化失败:', e);
			}
		};
		init();
	}, [syncRange]);

	// 滑动事件分发器
	const handleColumnChange: PickerMultiSelectorProps['onColumnChange'] = async (e) => {
		const { column, value } = e.detail;
		let [p, c, a, t] = indexes;

		try {
			if (column === 0) {
				p = value;
				c = 0;
				a = 0;
				t = 0;
				setRange((prev) => [prev[0], ['加载中...'], ['加载中...'], ['加载中...']]);
				const pCode = Number(dataRef.current.provs[p]?.areaCode);
				const result = await fetchCitiesAreasAndTenants(pCode);
				dataRef.current.cities = result.cities;
				dataRef.current.areas = result.areas;
				dataRef.current.tenants = result.tenants;
			} else if (column === 1) {
				c = value;
				a = 0;
				t = 0;
				setRange((prev) => [prev[0], prev[1], ['加载中...'], ['加载中...']]);
				const cCode = Number(dataRef.current.cities[c]?.areaCode);
				const result = await fetchAreasAndTenants(cCode);
				dataRef.current.areas = result.areas;
				dataRef.current.tenants = result.tenants;
			} else if (column === 2) {
				a = value;
				t = 0;
				setRange((prev) => [prev[0], prev[1], prev[2], ['加载中...']]);
				const aCode = Number(dataRef.current.areas[a]?.areaCode);
				dataRef.current.tenants = await fetchTenants(aCode);
			} else {
				t = value;
			}

			setIndexes([p, c, a, t]);
			syncRange();
		} catch (e) {
			console.error('列联动失败:', e);
		}
	};

	const handleChange: PickerMultiSelectorProps['onChange'] = (e) => {
		const [pIdx, cIdx, aIdx, tIdx] = e.detail.value;
		const { provs, cities, areas, tenants } = dataRef.current;
		const selectedTenant = tenants[tIdx];

		if (!selectedTenant) {
			Taro.showToast({ title: '当前地区暂无可用街道协会', icon: 'none' });
			return;
		}

		Taro.setStorageSync('active_province_code', Number(provs[pIdx].areaCode));
		Taro.setStorageSync('active_city_code', Number(cities[cIdx].areaCode));
		Taro.setStorageSync('active_district_code', Number(areas[aIdx].areaCode));

		onChange({
			tenantId: selectedTenant.id,
			tenantName: selectedTenant.name,
			provinceCode: Number(provs[pIdx].areaCode),
			cityCode: Number(cities[cIdx].areaCode),
			districtCode: Number(areas[aIdx].areaCode),
		});
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
			<View className={`w-full ${disabled ? 'opacity-50' : 'active:opacity-60 transition-opacity'}`}>
				{children}
			</View>
		</Picker>
	);
};
