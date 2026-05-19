### 目录结构

```
├── app.config.ts
├── app.css
├── app.tsx
├── assets
│   ├── fonts
│   │   └── Manrope.woff2
│   ├── icons
│   │   ├── activity.png
│   │   ├── activity_fill.png
│   │   ├── demand.png
│   │   ├── demand_fill.png
│   │   ├── home.png
│   │   ├── home_fill.png
│   │   ├── job.png
│   │   ├── job_fill.png
│   │   ├── user.png
│   │   └── user_fill.png
│   └── images
│       └── default-cover.svg
├── components
│   ├── biz
│   │   ├── ActivityStatusBadge
│   │   │   └── index.tsx
│   │   ├── DemandStatusBadge
│   │   │   └── index.tsx
│   │   └── UserIdentityBadge
│   │       └── index.tsx
│   └── ui
│       ├── Asset
│       │   └── index.tsx
│       ├── Avatar
│       │   └── index.tsx
│       ├── Badge
│       │   └── index.tsx
│       ├── Button
│       │   └── index.tsx
│       ├── Carousel
│       │   └── index.tsx
│       ├── Cell
│       │   └── index.tsx
│       ├── ColumnNav
│       │   └── index.tsx
│       ├── Divider
│       │   └── index.tsx
│       ├── Empty
│       │   └── index.tsx
│       ├── GridNav
│       │   └── index.tsx
│       ├── Icon
│       │   └── index.tsx
│       ├── Loading
│       │   └── index.tsx
│       ├── Page
│       │   └── index.tsx
│       ├── SectionTitle
│       │   └── index.tsx
│       └── index.ts
├── constants
│   ├── activity.ts
│   ├── demand.ts
│   └── user.ts
├── hooks
│   ├── useActivity.ts
│   ├── useDemand.ts
│   ├── useJob.ts
│   ├── useLogin.ts
│   └── useUser.ts
├── index.html
├── pages
│   ├── activity
│   │   ├── detail
│   │   │   ├── index.config.ts
│   │   │   └── index.tsx
│   │   ├── index.config.ts
│   │   └── index.tsx
│   ├── demand
│   │   ├── components
│   │   ├── detail
│   │   │   └── index.tsx
│   │   ├── index.config.ts
│   │   └── index.tsx
│   ├── home
│   │   ├── index.config.ts
│   │   └── index.tsx
│   ├── job
│   │   ├── detail
│   │   │   └── index.tsx
│   │   ├── enterprise
│   │   │   └── index.tsx
│   │   ├── index.config.ts
│   │   └── index.tsx
│   ├── login
│   │   ├── index.config.ts
│   │   └── index.tsx
│   └── user
│       ├── index.config.ts
│       └── index.tsx
├── services
│   ├── activity.ts
│   ├── auth.ts
│   ├── demand.ts
│   ├── job.ts
│   └── user.ts
├── store
│   └── auth.ts
├── types
│   ├── activity.ts
│   ├── common.ts
│   ├── demand.ts
│   ├── job.ts
│   └── user.ts
└── utils
    ├── auth.ts
    ├── common.ts
    └── http.ts
```

### 项目概况与技术栈

框架：Tarojs (React) - 微信小程序端。
样式：Tailwind CSS (v4 标准) + Iconify (Phosphor Icons ph--\*)。
状态管理：Zustand (持久化存储) + Tanstack Query (服务端状态与缓存保鲜)。
网络请求：二次封装的 http 工具 (基于 Taro.request)。

### 核心架构与分层哲学 (Architecture)

项目严格遵循“表现层与业务层分离”以及“就近原则”：
src/components/ui/ (纯 UI 基础组件)：绝对“纯洁”，不包含任何业务逻辑（如 Button, Card, Badge, Divider）。必须通过 index.ts 进行桶导出 (Barrel Export)。
src/pages/{module}/components/ (页面私有组件)：仅在当前模块内复用的拆分组件，尽量抽离成通用组件，放在 src/components/ui/ 目录内。

### 标准开发工作流 (SOP)

开发任何新页面/模块，必须严格遵守以下 4 步顺序：
Types (src/types/)：定义 TS 接口，统一复用 PageRes<T> 和 ListRes<T> 作为基础响应格式，字段添加 TSDoc 块级注释。
Services (src/services/)：基于 http 实例定义 API 请求函数。
Hooks (src/hooks/)：封装 Tanstack Query 的 useQuery 或 useInfiniteQuery，处理缓存、分页 (getNextPageParam) 和状态同步。
Pages (src/pages/)：组合 UI 组件与 Hooks 进行渲染，禁止在页面内写复杂的枚举判断逻辑。

### 特别注意点与代码规范 (CRITICAL RULES)

新加入的 AI 必须严格遵守以下军规：
🚫 禁用非标类名：严禁使用 text-[10px] 等非标写法。极小字体统一使用 text-xs scale-90 origin-left。

🚫 禁用随意间距：页面级排版禁止在 View 上散写 px-4 py-3，如果需要，必须使用 `container-x` 这个已经定义在 app.css 内的统一容器样式类控制。内容块必须包裹在 <Cell> 中，标题是通过 <SectionTitle> 来构建

✅ 图标规范：使用 Iconify，必须显式指定宽高，格式为 <View className="icon-[ph--...] w-5 h-5" />。

✅ 数据防御性编程：处理枚举和字典映射时（如 src/constants/user.ts 内的 USER_IDENTITY_MAP），必须在组件内做强转和兜底，避免 undefined 导致白屏报错。

✅ 路由配置规范：在 app.config.ts 中，路径绝对不能以 / 开头（如 'pages/home/index'）。

✅ Tanstack Query 集成：需要后台保鲜的数据（如积分），使用 staleTime 配合 Zustand updateUserInfo 方法实现静默同步。

### 已完成进度盘点 (Milestones)

目前小程序底部的核心导航模块已基本完成，主要页面的 UI 部分基本完成：

基建层：完成了完善的 UI 组件库（Button, Card, Page, Container, Divider 等）与类型定义体系。
首页 (/pages/home/index)：完成金刚区网格、数据看板，并成功复用 Activity Hook 实现精选推荐截取 (slice)。
服务大厅 (/pages/demand/)：完成双排 Sticky 级联筛选、接单列表无限滚动、需求详情（含费用明细计算与服务方列表展示）。
家门口求职 (/pages/job/)：完成岗位大厅列表、防诈骗岗位详情、企业主页名片及在招岗位嵌套展示。
个人中心 (/pages/user/)：完成基于 isLoggedIn 驱动的 UI 面板、积分自动同步、Zustand 状态机集成。

### 一些代码参考

```css
// src/app.css
@theme {
	/* 核心色彩 */
	--color-primary: #ea3323;

	/* 点缀色/辅助色*/
	--color-main-bg: #fafafa; /* 离纸感背景 */
	--color-text-title: #09090b;
	--color-text-body: #27272a;
	--color-text-muted: #71717a;

	/* 圆角 */
	--radius-card: 12rpx;

	/* 容器间距 */
	--container-p-x: 32rpx;

	/** 字体 */
	--font-sans: 'Manrope', ui-sans-serif, system-ui, sans-serif;
}

@utility container-x {
	padding-left: var(--container-p-x);
	padding-right: var(--container-p-x);
}
```

```js
export const Page = ({
	hasTabBar = false,
	scroll = true,
	children,
	className = '',
	...props
}: Props) => {
	// 第一层统一底色和最小高度
	const baseClass = `min-h-screen bg-main-bg flex flex-col relative ${className}`;

	// 底部留白，防止被系统小白条或 TabBar 遮挡
	const pbClass = hasTabBar ? 'pb-24' : 'pb-safe';

	if (scroll) {
		return (
			<View className={baseClass}>
				<ScrollView scrollY className={`h-screen flex-1 ${pbClass}`} {...props}>
					{children}
				</ScrollView>
			</View>
		);
	}

	return <View className={`${baseClass} ${pbClass}`}>{children}</View>;
};
```

```js
export const Cell = ({
	noPadding = false,
	clickable = false,
	className = '',
	children,
	...props
}: Props) => {
	// 统一的白底、圆角、阴影、间距
	const baseClasses = `
        bg-white rounded-card overflow-hidden
        ${noPadding ? '' : 'p-4'}
        ${clickable ? 'active:scale-[0.98] transition-transform' : ''}
        ${className}
    `
		.replace(/\s+/g, ' ')
		.trim();

	return (
		<View className={baseClasses} {...props}>
			{children}
		</View>
	);
};
```

```js
// src/store/auth.ts
export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			uid: null,
			token: null,
			uuid: null,
			userInfo: null,
			authStage: 'UNLOGIN',

			// 状态 A：直接登录成功
			setLoginSuccess: (token) =>
				set({
					token,
					authStage: 'LOGGED_IN',
					uuid: null,
				}),

			// 状态 B：半登录，需补全手机号
			setNeedBind: (uuid) =>
				set({
					uuid: uuid,
					authStage: 'NEED_BIND_PHONE',
					token: null,
					uid: null,
					userInfo: null,
				}),

			updateUserInfo: (userInfo) =>
				set({
					uid: userInfo.userId,
					userInfo: userInfo,
				}),

			setLogout: () => {
				set({
					token: null,
					uid: null,
					uuid: null,
					userInfo: null,
					authStage: 'UNLOGIN',
				});
				Taro.removeStorageSync('auth-storage');
			},
		}),
		{
			name: 'auth-storage',
			storage: createJSONStorage(() => ({
				getItem: Taro.getStorageSync,
				setItem: Taro.setStorageSync,
				removeItem: Taro.removeStorageSync,
			})),
		},
	),
);
```
