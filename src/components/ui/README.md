# UI 组件库

基于 Taro + React + Tailwind CSS 的小程序原子级 UI 组件集合。设计目标：薄封装、可组合、可跨项目复制。

所有组件统一从 `@/components/ui` 导出：

```tsx
import { Page, Cell, Button, FormItem, Badge } from '@/components/ui';
```

---

## 目录

- [前置依赖](#前置依赖)
- 布局：[`Page`](#page)、[`Cell`](#cell)、[`Divider`](#divider)
- 展示：[`Heading`](#heading)、[`Badge`](#badge)、[`Avatar`](#avatar)、[`Description`](#description)、[`Asset`](#asset)、[`Alert`](#alert)、[`Loading`](#loading)、[`Empty`](#empty)、[`Feedback`](#feedback)
- 导航：[`Tabs`](#tabs)、[`GridNav`](#gridnav)、[`ColumnNav`](#columnnav)、[`EntryCard`](#entrycard)、[`Carousel`](#carousel)、[`SearchBar`](#searchbar)
- 表单：[`FormItem`](#formitem)、[`DatePicker`](#datepicker)、[`RegionPicker`](#regionpicker)、[`ImageUploader`](#imageuploader)、[`FileUploader`](#fileuploader)、[`Rate`](#rate)
- 交互：[`Button`](#button)、[`Drawer`](#drawer)、[`ImagePreview`](#imagepreview)

---

## 前置依赖

复制到其他项目时，请确认目标项目同样具备以下基础：

| 类别 | 依赖                                                      |
| ---- | --------------------------------------------------------- |
| 框架 | `@tarojs/components`、`@tarojs/taro`、`react@18+`         |
| 样式 | Tailwind CSS（小程序端推荐 `weapp-tailwindcss`）          |
| 图标 | Iconify 的 class-based 用法（如 `icon-[ph--house-bold]`） |

需要在 Tailwind 配置中提供以下设计令牌（可按业务调整数值）：

```js
// tailwind.config.js (节选)
theme: {
  extend: {
    colors: {
      primary: '#D4AF37',
      'main-bg': '#F7F8FA',
      'text-title': '#1F2329',
      'text-body':  '#4E5969',
      'text-muted': '#86909C',
    },
    borderRadius: { card: '12px' },
    spacing: { safe: 'env(safe-area-inset-bottom)' },
  },
},
```

部分组件（`Heading`、`Carousel`、`GridNav`、`EntryCard`）依赖 `@/utils/common` 中的 `mapsTo(path)` 导航工具，复制时需一并带上或替换为 `Taro.navigateTo`。

---

## 布局组件

### Page

页面级容器，处理 `bg-main-bg`、最小高度、底部安全区/TabBar 留白。

| Prop        | 类型      | 说明                                |
| ----------- | --------- | ----------------------------------- |
| `hasTabBar` | `boolean` | 是否给底部 TabBar 留出 `pb-24` 高度 |
| `className` | `string`  | 追加样式                            |

```tsx
<Page hasTabBar>
	<View className="container-x">页面内容</View>
</Page>
```

### Cell

白底卡片容器，统一圆角与内边距，所有 `<View>` 原生属性透传。

| Prop        | 类型              | 说明                            |
| ----------- | ----------------- | ------------------------------- |
| `rounded`   | `boolean = true`  | 是否圆角；列表项可关闭          |
| `noPadding` | `boolean = false` | 取消内部 `p-4`（用于整图卡片）  |
| `clickable` | `boolean = false` | 启用 `active:scale-[0.98]` 反馈 |

```tsx
<Cell clickable onClick={goDetail}>
	<Text>这是一张卡片</Text>
</Cell>
```

### Divider

分割线，可水平/垂直、可虚线、可在中间嵌入文字。

| Prop          | 类型                         | 说明                   |
| ------------- | ---------------------------- | ---------------------- |
| `orientation` | `'horizontal' \| 'vertical'` | 方向，默认 horizontal  |
| `dashed`      | `boolean`                    | 虚线                   |
| `children`    | `ReactNode`                  | 中间文案（仅水平方向） |

```tsx
<Divider>—— 我是分割线 ——</Divider>
<Divider dashed className="my-2" />
<View>左<Divider orientation="vertical" />右</View>
```

---

## 展示组件

### Heading

模块级标题，左侧装饰条/图标 + 标题 + 可选副标题 + 右侧 link 或自定义 extra。

| Prop       | 类型                          | 说明                               |
| ---------- | ----------------------------- | ---------------------------------- |
| `title`    | `string`                      | 必填                               |
| `subtitle` | `string`                      | 副标题                             |
| `size`     | `'sm' \| 'md' \| 'lg' = 'lg'` | 尺寸                               |
| `icon`     | `string`                      | Iconify 类名，传入则替换装饰竖条   |
| `link`     | `{ name; url }`               | 右侧"查看更多"链接                 |
| `extra`    | `ReactNode`                   | 优先级高于 `link` 的自定义右侧内容 |

```tsx
<Heading title="今日活动" subtitle="精选 3 场" link={{ name: '查看全部', url: '/pages/activity/index' }} />
```

### Badge

状态/分类徽章，6 种语义色 × 3 档尺寸，支持点击。

| Prop      | 类型                                                                       | 说明             |
| --------- | -------------------------------------------------------------------------- | ---------------- |
| `variant` | `'primary' \| 'success' \| 'secondary' \| 'warning' \| 'danger' \| 'info'` | 默认 `secondary` |
| `size`    | `'xs' \| 'sm' \| 'md' = 'sm'`                                              | 尺寸             |
| `pill`    | `boolean`                                                                  | 全圆角胶囊形状   |

```tsx
<Badge variant="success">已完成</Badge>
<Badge variant="primary" size="md" pill>VIP</Badge>
```

### Avatar

头像组件；无图或加载失败时根据 `name` 首字母 + 固定配色降级渲染。

| Prop   | 类型                                  | 说明         |
| ------ | ------------------------------------- | ------------ |
| `src`  | `string`                              | 图片地址     |
| `name` | `string = 'U'`                        | 首字母回退源 |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' = 'md'` | 尺寸         |

```tsx
<Avatar src={user.avatar} name={user.nickName} size="lg" />
```

### Description

左右结构的描述项，常用于详情参数表。

| Prop              | 类型                             | 说明                                   |
| ----------------- | -------------------------------- | -------------------------------------- |
| `label` / `value` | `string` / `ReactNode`           | 标签与值                               |
| `variant`         | `'between' \| 'start' = 'start'` | 排版：两端对齐 / 紧贴左侧              |
| `labelWidth`      | `string = 'w-20'`                | label 固定宽度（`variant=start` 生效） |

```tsx
<Description label="联系电话" value="13800000000" />
<Description label="服务区域" value="海陵区 城东街道" variant="between" />
```

### Asset

上下结构的数值展示，常用于个人中心头部"已发布 / 已完成"等数据。

```tsx
<View className="flex">
	<Asset label="已发布" value={12} />
	<Asset label="进行中" value={3} valueColor="text-emerald-500" />
</View>
```

### Alert

行内提示条，4 种语义色（`warning`/`info`/`success`/`error`），自带图标且可覆盖。

```tsx
<Alert variant="info">请确保凭证边缘完整、公章清晰，格式支持 JPG、PNG</Alert>
<Alert variant="error" icon="icon-[ph--x-octagon]">提交失败，请稍后重试</Alert>
```

### Loading

通用加载占位（中心 spinner + 文案）。

```tsx
return isLoading ? <Loading title="加载中..." /> : <List />;
```

### Empty

空状态占位，可选 CTA 按钮。

| Prop       | 默认值                             |
| ---------- | ---------------------------------- |
| `title`    | `'空空如也'`                       |
| `subTitle` | `'暂无数据，试试其他搜索关键词吧'` |
| `icon`     | `'icon-[ph--mailbox]'`             |

```tsx
<Empty title="还没有订单" subTitle="去看看有什么可以接的吧" buttonText="去逛逛" onButtonClick={goHome} />
```

### Feedback

落地反馈/结果页（成功、失败、加载等大版式），可插入中间内容与底部按钮。

```tsx
<Feedback
	variant="success"
	title="支付成功"
	subtitle="感谢您的支持"
	extra={
		<Button block onClick={back}>
			返回订单
		</Button>
	}
/>
```

---

## 导航组件

### Tabs

横向 Tab，支持吸顶与横向滚动两种模式。

| Prop         | 类型                                           | 说明                     |
| ------------ | ---------------------------------------------- | ------------------------ |
| `tabs`       | `{ label: string; value: string \| number }[]` | Tab 列表                 |
| `current`    | `string \| number`                             | 当前选中 value           |
| `onChange`   | `(value, index) => void`                       | 切换回调                 |
| `sticky`     | `boolean = true`                               | 是否吸顶                 |
| `scrollable` | `boolean = false`                              | 横向滚动（项较多时启用） |

```tsx
const [tab, setTab] = useState('all');
<Tabs
	tabs={[
		{ label: '全部', value: 'all' },
		{ label: '进行中', value: 'serving' },
	]}
	current={tab}
	onChange={setTab}
/>;
```

### GridNav

矩阵式图标导航，常见于首页九宫格。

```tsx
<View className="grid grid-cols-4 gap-4">
	<GridNav label="需求大厅" path="/pages/demand/index" icon="icon-[ph--hand-coins]" variant="primary" />
	<GridNav label="志愿活动" path="/pages/activity/index" icon="icon-[ph--confetti]" variant="success" />
</View>
```

### ColumnNav

条目类导航，常见于设置页 / 个人中心功能列表。

| Prop     | 说明                                                          |
| -------- | ------------------------------------------------------------- |
| `icon`   | Iconify 类名                                                  |
| `label`  | 文案                                                          |
| `type`   | `'contact' \| 'phone'`，传 `contact` 时使用小程序原生客服按钮 |
| `border` | 底部分隔线，默认开                                            |

```tsx
<ColumnNav icon="icon-[ph--gear]" label="设置" onClick={goSettings} />
<ColumnNav icon="icon-[ph--headset]" label="联系客服" type="contact" border={false} />
```

### EntryCard

带主题色背景与装饰的"玄关式"入口卡片，常用于推广位、认证入口等。

| Prop                      | 说明                                   |
| ------------------------- | -------------------------------------- |
| `title` / `desc` / `icon` | 标题、描述、Iconify 类名               |
| `url` 或 `onClick`        | 点击跳转或自定义行为（`onClick` 优先） |
| `theme`                   | `'blue' \| 'orange' \| 'green'`        |
| `disabled`                | 置灰禁用（如审核中）                   |

```tsx
<EntryCard
	theme="orange"
	icon="icon-[ph--user-focus-duotone]"
	title="志愿者认证"
	desc="完成实名认证后可承接需求"
	url="/pages/apply/volunteer/index"
/>
```

### Carousel

轮播图，自动播放 + 循环 + 指示点，单项支持点击跳转。

```tsx
<Carousel
	list={[
		{ id: 1, pic: 'https://.../banner1.jpg', url: '/pages/activity/index' },
		{ id: 2, pic: 'https://.../banner2.jpg' },
	]}
/>
```

### SearchBar

搜索栏，支持只读跳转模式与受控输入模式。

| Prop                              | 说明                                                   |
| --------------------------------- | ------------------------------------------------------ |
| `readonly`                        | 只读：整个区域可点击触发 `onClick`（用于首页跳搜索页） |
| `value` / `onInput` / `onConfirm` | 受控输入相关                                           |
| `showBtn`                         | 是否显示右侧"搜索"按钮                                 |
| `focus`                           | 自动聚焦                                               |

```tsx
// 只读跳转
<SearchBar readonly placeholder="搜索需求" onClick={() => mapsTo('/pages/search/index')} />;

// 编辑态
const [kw, setKw] = useState('');
<SearchBar value={kw} onInput={setKw} onConfirm={doSearch} showBtn onSearch={doSearch} focus />;
```

---

## 表单组件

### FormItem

表单一行（label + 内容 + 可选必填星标 + 可选 helper）。本身不渲染输入控件，作为"槽位"包裹任何子节点。

| Prop       | 说明                                        |
| ---------- | ------------------------------------------- |
| `label`    | 左侧标签文字                                |
| `required` | 显示红色星号                                |
| `helper`   | 底部辅助文案（string 或节点）               |
| `layout`   | `'row' \| 'column'`，纵向时输入区占满下一行 |
| `border`   | 底部分隔线，默认开                          |

```tsx
<Cell>
	<FormItem label="昵称" required>
		<Input
			className="text-right text-sm"
			value={form.nickName}
			onInput={(e) => setField('nickName', e.detail.value)}
		/>
	</FormItem>
	<FormItem label="个人简介" layout="column" border={false} helper="不超过 200 字">
		<Textarea value={form.bio} onInput={(e) => setField('bio', e.detail.value)} />
	</FormItem>
</Cell>
```

### DatePicker

封装小程序原生日期选择器，children 作为触发 UI 插槽。

| Prop            | 说明                                 |
| --------------- | ------------------------------------ |
| `value`         | 当前日期 `YYYY-MM-DD`                |
| `onChange`      | `(dateStr) => void`                  |
| `start` / `end` | 可选范围限制                         |
| `fields`        | `'year' \| 'month' \| 'day' = 'day'` |

```tsx
<DatePicker value={form.birthday} onChange={(v) => setField('birthday', v)}>
	<Text>{form.birthday || '请选择生日'}</Text>
</DatePicker>
```

### RegionPicker

封装小程序原生省市区三级联动，回调返回结构化的 `{ province, city, area }`。

```tsx
<RegionPicker
	value={[form.provinceCode?.toString(), form.cityCode?.toString(), form.districtCode?.toString()]}
	onChange={(r) => {
		setField('provinceCode', Number(r.province.code));
		setField('cityCode', Number(r.city.code));
		setField('districtCode', Number(r.area.code));
	}}
>
	<Text>{regionLabel || '请选择省市区'}</Text>
</RegionPicker>
```

### ImageUploader

图片上传，**只负责选图 + 触发上传 + 展示**，真正的上传请求由调用方通过 `onUpload` 注入。

| Prop          | 说明                                             |
| ------------- | ------------------------------------------------ |
| `value`       | 已上传图片 URL 数组                              |
| `onChange`    | `(urls: string[]) => void`                       |
| `onUpload`    | `(tempPaths) => Promise<string[]>`，返回最终 URL |
| `maxCount`    | 默认 1；为 1 时走"单图大格"，>1 时走"九宫格"     |
| `isUploading` | 外部控制 loading                                 |

```tsx
const { triggerUpload, isUploading } = useUpload();
<ImageUploader
	value={form.idCardFront ? [form.idCardFront] : []}
	onChange={(urls) => setField('idCardFront', urls[0])}
	onUpload={triggerUpload}
	isUploading={isUploading}
	label="上传身份证人像面"
/>;
```

### FileUploader

文档文件上传（PDF/Word/Excel 等），通过 `Taro.chooseMessageFile` 选取微信聊天文件。

```tsx
<FileUploader
	value={form.attachment}
	onChange={(file) => setField('attachment', file)}
	onUpload={triggerUpload}
	isUploading={isUploading}
	extension={['pdf', 'doc', 'docx']}
/>
```

### Rate

评分组件，支持只读与可交互、可选文案提示。

```tsx
const [score, setScore] = useState(5);
<Rate value={score} onChange={setScore} label="服务评分" />
<Rate value={4} readonly size={4} />
```

---

## 交互组件

### Button

多变体、多尺寸按钮，所有 Taro `<Button>` 原生属性（如 `openType`、`onChooseAvatar`、`onGetPhoneNumber`）原样透传。

| Prop      | 说明                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------- |
| `variant` | `'primary' \| 'success' \| 'secondary' \| 'warning' \| 'danger' \| 'info' \| 'outline' \| 'ghost'` |
| `size`    | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`；`xl` 自动占满整行                                          |
| `icon`    | Iconify 类名，自动按 size 缩放                                                                     |
| `block`   | 占满整行                                                                                           |
| `rounded` | 全圆角（默认）/ 卡片圆角                                                                           |
| `loading` | 显示旋转图标并禁用                                                                                 |

```tsx
<Button variant="primary" icon="icon-[ph--paper-plane]" onClick={submit}>提交</Button>
<Button variant="outline" size="sm">取消</Button>
<Button size="xl" loading={isSaving} disabled={isSaving} onClick={save}>保存资料</Button>

// 透传 openType 调起原生能力
<Button openType="chooseAvatar" onChooseAvatar={onChooseAvatar} variant="ghost">更换头像</Button>
```

### Drawer

右侧抽屉，带遮罩、滑动阻断与可选 footer 吸底操作区。

| Prop      | 说明                                  |
| --------- | ------------------------------------- |
| `isOpen`  | 显隐控制                              |
| `onClose` | 点击遮罩 / 关闭按钮回调               |
| `title`   | 可选 header 标题（不传则无 header）   |
| `footer`  | 可选 footer 节点（用于放"重置/确定"） |
| `width`   | Tailwind 宽度类，默认 `w-[85vw]`      |

```tsx
const [open, setOpen] = useState(false);
<Drawer
	isOpen={open}
	onClose={() => setOpen(false)}
	title="筛选"
	footer={
		<View className="flex gap-3">
			<Button variant="secondary" block onClick={reset}>
				重置
			</Button>
			<Button block onClick={confirm}>
				确定
			</Button>
		</View>
	}
>
	<View className="p-4">{/* 筛选项 */}</View>
</Drawer>;
```

### ImagePreview

全屏图片预览，支持长按菜单与底部自定义操作区。

```tsx
const [src, setSrc] = useState('');
<Image src={thumb} onClick={() => setSrc(originUrl)} />
<ImagePreview visible={!!src} src={src} onClose={() => setSrc('')} />
```

---

## 设计约定

- **样式来源**：组件内部直接写 Tailwind class，不引入额外 CSS 文件；样式覆盖请优先通过 `className` prop 追加，而不是改组件源码。
- **数据流**：组件保持**纯展示** + 受控；副作用（请求、Toast、跳转）通过 `onChange` / `onClick` / `onUpload` 等回调交给业务侧的 Hook。
- **命名空间**：原子组件放在 `components/ui/`，业务耦合组件（如 `OrderRecordCard`）放在 `components/biz/`，两者不互相依赖。
- **图标**：统一使用 [Iconify Phosphor](https://icones.js.org/collection/ph) 的 class-based 用法（`icon-[ph--xxx]`），无需额外 import。
