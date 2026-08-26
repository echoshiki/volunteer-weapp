import { useState, useRef } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mapsTo } from '@/utils/common';
import { runWithAuth } from '@/utils/auth';

export interface QuickNavItem {
	/** 标题 */
	title: string;
	/** 描述副标（适合老年人看懂） */
	desc: string;
	/** 图标类名 */
	icon: string;
	/** 图标背景颜色与文字色 */
	colorClass: string;
	/** 是否需要登录后才能跳转 */
	authRequired?: boolean;
	/** 目标路由路径 */
	url?: string;
	/** 自定义点击事件 */
	onClick?: () => void;
}

export interface QuickNavProps {
	/** 初始距离屏幕顶部的像素值（不传则自动计算在屏幕下半部） */
	defaultTop?: number;
	/** 是否在带TabBar的页面中使用 (用于计算底部拖拽边界) */
	hasTabBar?: boolean;
	/** 自定义覆盖导航项列表 */
	items?: QuickNavItem[];
	/** 悬浮球的显示文字，默认 '快捷入口' */
	triggerText?: string;
	/** 悬浮按钮外部附加样式 */
	className?: string;
}

// 默认提供的常用大功能导航项
const DEFAULT_QUICK_ITEMS: QuickNavItem[] = [
	{
		title: '发布需求',
		desc: '找人帮扶 · 跑腿代办',
		icon: 'icon-[ph--plus-circle-fill]',
		colorClass: 'bg-orange-50 text-orange-500 border-orange-100',
		authRequired: true,
		url: '/pages/demand/publish/index',
	},
	{
		title: '我要接单',
		desc: '查看互助 · 接单报价',
		icon: 'icon-[ph--handshake-fill]',
		colorClass: 'bg-blue-50 text-blue-500 border-blue-100',
		url: '/pages/demand/index',
	},
	{
		title: '我要求职',
		desc: '找附近工作 · 社区岗位',
		icon: 'icon-[ph--briefcase-fill]',
		colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
		url: '/pages/job/index',
	},
	{
		title: '我的订单',
		desc: '查看服务单与履约进度',
		icon: 'icon-[ph--receipt-fill]',
		colorClass: 'bg-purple-50 text-purple-500 border-purple-100',
		authRequired: true,
		url: '/pages/order/employer/index',
	},
];

/**
 * 悬浮快捷导航组件 (Floating Quick Nav)
 * 支持上下自由拖动，可在任何页面即插即用，点击唤起常用功能大按钮导航弹窗
 */
export const QuickNav = ({
	defaultTop,
	hasTabBar = true,
	items = DEFAULT_QUICK_ITEMS,
	triggerText = '快捷入口',
	className = '',
}: QuickNavProps) => {
	const [isOpen, setIsOpen] = useState(false);

	// 屏幕高度与上下安全边界
	const systemInfo = useRef(Taro.getSystemInfoSync());
	const windowHeight = systemInfo.current.windowHeight || 667;
	const minTop = 75; // 顶部导航栏安全距离
	const maxTop = windowHeight - (hasTabBar ? 155 : 95); // 底部 TabBar / 安全区距离

	// 纵向坐标 top 状态
	const [top, setTop] = useState(() => {
		if (defaultTop !== undefined) return defaultTop;
		return Math.round(windowHeight * 0.8);
	});

	// 拖拽手势相关引用
	const touchStartY = useRef(0);
	const startTop = useRef(0);
	const isDragging = useRef(false);

	const handleTouchStart = (e: any) => {
		const touch = e.touches[0];
		if (!touch) return;
		touchStartY.current = touch.clientY;
		startTop.current = top;
		isDragging.current = false;
	};

	const handleTouchMove = (e: any) => {
		const touch = e.touches[0];
		if (!touch) return;
		const deltaY = touch.clientY - touchStartY.current;

		if (Math.abs(deltaY) > 4) {
			isDragging.current = true;
		}

		const nextTop = startTop.current + deltaY;
		// 限制在安全可见区域内
		const clampedTop = Math.max(minTop, Math.min(nextTop, maxTop));
		setTop(clampedTop);
	};

	const handleTouchEnd = () => {
		// 手势结束后若不是明显拖拽，则允许点击触发
		setTimeout(() => {
			isDragging.current = false;
		}, 100);
	};

	const handleTriggerClick = () => {
		if (isDragging.current) return;
		setIsOpen(true);
	};

	const handleItemClick = (item: QuickNavItem) => {
		setIsOpen(false);
		if (item.onClick) {
			item.onClick();
			return;
		}
		if (!item.url) return;

		if (item.authRequired) {
			runWithAuth(() => mapsTo(item.url!));
		} else {
			mapsTo(item.url);
		}
	};

	const renderTriggerText = () => {
		if (!triggerText || triggerText === '快捷入口' || triggerText === '快捷导航') {
			return (
				<>
					<Text>快捷</Text>
					<Text>入口</Text>
				</>
			);
		}
		if (triggerText.length === 4) {
			return (
				<>
					<Text>{triggerText.slice(0, 2)}</Text>
					<Text>{triggerText.slice(2, 4)}</Text>
				</>
			);
		}
		return <Text>{triggerText}</Text>;
	};

	return (
		<>
			{/* 紧贴右边缘可上下拖拽的悬浮挂耳触发器 */}
			<View
				className={`fixed right-0 z-40 flex flex-col items-center justify-center pl-3 pr-2 py-3 rounded-l-xl rounded-r-none bg-linear-to-l from-primary to-[#ff4e3e] opacity-95 text-white shadow-md shadow-primary/25 border-y border-l border-white/20 active:opacity-90 transition-opacity cursor-pointer ${className}`}
				style={{ top: `${top}px` }}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				onClick={handleTriggerClick}
			>
				<View className="icon-[ph--squares-four-fill] size-6 mb-0.5 shrink-0" />
				<View className="flex flex-col items-center justify-center text-xs font-bold leading-tight tracking-wider">
					{renderTriggerText()}
				</View>
			</View>

			{/* 快捷导航弹窗 (底部半屏弹层) */}
			<View
				className={`fixed inset-0 z-50 transition-opacity duration-300 ${
					isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
				}`}
			>
				{/* 遮罩层 */}
				<View
					className="absolute inset-0 bg-black/50 backdrop-blur-xs"
					onClick={() => setIsOpen(false)}
					catchMove
				/>

				{/* 弹窗内容容器 */}
				<View
					className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 pb-safe shadow-2xl transition-transform duration-300 ease-out transform flex flex-col ${
						isOpen ? 'translate-y-0' : 'translate-y-full'
					}`}
				>
					{/* 顶部标题栏 */}
					<View className="flex items-center justify-between pb-3 border-b border-gray-100">
						<View className="flex flex-col">
							<Text className="text-lg font-bold text-text-title">快捷服务导航</Text>
							<Text className="text-xs text-text-muted mt-0.5">大字便捷直达常用业务功能</Text>
						</View>
						<View
							className="size-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors cursor-pointer"
							onClick={() => setIsOpen(false)}
						>
							<View className="icon-[ph--x-bold] size-4 text-gray-500" />
						</View>
					</View>

					{/* 九宫格/双列大按钮功能区 */}
					<View className="grid grid-cols-1 gap-3.5 py-4 max-h-[60vh] overflow-y-auto">
						{items.map((item, index) => (
							<View
								key={index}
								onClick={() => handleItemClick(item)}
								className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 active:bg-gray-100 active:scale-[0.98] transition-all cursor-pointer"
							>
								{/* 图标容器 */}
								<View
									className={`size-12 rounded-xl flex items-center justify-center shrink-0 border ${item.colorClass}`}
								>
									<View className={`${item.icon} size-6`} />
								</View>

								{/* 文字说明 */}
								<View className="flex flex-col min-w-0 flex-1">
									<Text className="text-base font-bold text-text-title truncate">{item.title}</Text>
									<Text className="text-xs text-text-muted truncate mt-0.5">{item.desc}</Text>
								</View>
							</View>
						))}
					</View>

					{/* 底部关闭栏 */}
					<View
						className="w-full py-3 mt-1 rounded-xl bg-gray-100 text-center active:bg-gray-200 transition-colors cursor-pointer"
						onClick={() => setIsOpen(false)}
					>
						<Text className="text-sm font-medium text-text-body">关 闭</Text>
					</View>
				</View>
			</View>
		</>
	);
};
