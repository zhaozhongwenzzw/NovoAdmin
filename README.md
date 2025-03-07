# React Admin 系统开发文档

## 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [核心组件](#核心组件)
- [状态管理](#状态管理)
- [路由系统](#路由系统)
- [动画系统](#动画系统)
- [布局系统](#布局系统)
- [工具函数](#工具函数)
- [开发指南](#开发指南)
- [功能专区](#功能专区)

## 项目概述

本项目是一个基于 React 18 的现代化管理系统前端框架，集成了丰富的功能组件和最佳实践。系统采用响应式设计，支持多种布局模式，内置动画效果，提供了完善的权限管理和多标签页功能。

### 主要特性

- 🚀 基于 React 18，使用最新的并发模式和自动批处理
- 📦 使用 TypeScript 进行类型检查，提高代码质量
- 🎨 集成 Tailwind CSS 和 Ant Design，实现美观的 UI
- 🔐 内置权限管理系统
- 📋 多标签页管理
- 💫 丰富的页面过渡动画
- 📊 可配置的数据表格
- 🔔 现代化的通知系统
- 📤 OSS可监控的文件上传

## 技术栈

- **核心框架**：React 18
- **开发语言**：TypeScript
- **UI 组件库**：Ant Design
- **CSS 工具**：Tailwind CSS
- **样式解决方案**：styled-components
- **状态管理**：Zustand
- **路由**：React Router 6
- **动画**：Framer Motion
- **图标**：@iconify/react
- **HTTP 请求**：axios
- **通知系统**：sonner

## 项目结构

```
src/
├── api/                # API 请求模块
│   ├── system/         # 系统相关 API
│   └── common/         # 通用 API（如上传）
├── components/         # 公共组件
│   ├── animate/        # 动画组件
│   ├── icon/           # 图标组件
│   ├── table/          # 表格组件
│   ├── toast/          # 提示组件
│   └── upload/         # 上传组件
├── configs/            # 配置文件
│   ├── theme/          # 主题配置
│   └── configProvider/ # 全局配置
├── layouts/            # 布局组件
│   ├── main/           # 主布局
│   └── nav/            # 导航布局
├── pages/              # 页面组件
│   └── system/         # 系统管理页面
├── router/             # 路由配置
│   └── hooks/          # 路由相关钩子
├── store/              # 状态管理
├── styles/             # 全局样式
├── types/              # 类型定义
│   └── enum/           # 枚举类型
└── utils/              # 工具函数
```

## 核心组件

### 动画组件 (Animate)

提供了一系列预设的动画效果，可以应用于页面转场和元素动画。

```tsx
// 使用示例
<Animate type={AnimationType.PERSPECTIVE}>
  <div>这里的内容将应用透视动画</div>
</Animate>
```

### 多标签页系统 (MultiTabs)

允许在一个页面中同时打开多个标签页，类似浏览器标签，提升工作效率。

```tsx
<TabsProvider>
  <MultiTabs />
</TabsProvider>
```

### 表格容器 (TableContainer)

增强的表格组件，支持自定义列、排序、筛选、分页、调整密度、设置对齐方式等功能。

```tsx
<TableContainer
  tableKey="unique-table-key"
  cardProps={{ title: "表格标题" }}
  tableProps={{
    columns: columns,
    dataSource: data,
    loading: loading,
  }}
  onRefresh={fetchData}
/>
```

### Toast 通知系统

基于 sonner 的增强型通知系统，添加了自定义动画图标。引入Promise通知，根据Promise状态实现不同的通知状态

```tsx
// 使用示例
toast.success('操作成功');
toast.error('操作失败');
```

### 上传组件

封装了文件上传功能，支持单文件、多文件和图片上传。

```tsx
// 单文件上传
<SingleUpload
  folderPath="/avatars"
  onSuccess={(response) => {
    console.log('上传成功:', response.url);
  }}
/>

// 图片上传
<ImageUpload
  folderPath="/images"
  onSuccess={(response) => {
    console.log('上传成功:', response.url);
  }}
/>
```

### 图标组件 (Iconify)

基于 @iconify/react 的图标组件，支持数千种图标。

```tsx
<Iconify icon="mdi:home" size={24} />
```

## 状态管理

使用 Zustand 进行状态管理，主要分为以下几个 store：

### 设置 Store (settingStore)

管理应用的全局设置，如主题模式、启用标签页等。

```tsx
const { themeMode, enableTabs } = useSettings();
```

### 用户 Store (userStore)

管理用户相关状态，如用户信息、权限等。

```tsx
const permissions = useUserPermissions();
```

## 路由系统

基于 React Router 6，结合权限系统实现动态路由。

### 权限路由

```tsx
// 使用权限路由钩子
const permissionRoutes = usePermissionRoutes();
```

### 路由动画

每个路由切换都可以单独配置进出入动画效果，通过 Framer Motion 实现。

如果碰到路由动画不生效的问题（特别是嵌套路由），可以参考

https://github.com/remix-run/react-router/discussions/10411

https://stackoverflow.com/questions/74351136/nested-child-route-transitions-in-react-router-dom-6-4-3-using-framer-motion/74352029#74352029

```tsx
<AnimatePresence mode="wait">
  <PageTransition>
    <Outlet />
  </PageTransition>
</AnimatePresence>
```

## 动画系统

### 页面转场动画

系统提供多种页面转场动画，可在菜单配置中指定。

可用的动画类型：

- PERSPECTIVE (透视效果)
- DEPTH (深度效果)
- 更多...（具体可查看variants）

### 动画选择器

提供了一个可视化的动画选择器组件，用于在管理界面中选择动画效果。

```tsx
<AnimateSelect
  onSelect={(type: AnimationType) => {
    form.setFieldValue('inAnimation', type);
  }}
/>
```

## 布局系统

### 主布局

支持多种布局模式:

- 水平布局 (Horizontal)
- mini布局(Mini)
- 垂直布局 (Vertical)
- 水平左右分栏布局(VerticalSplit)

### 多标签页布局

支持以标签页形式管理多个页面，提供右键菜单功能:

- 刷新当前标签
- 关闭当前标签
- 关闭其他标签
- 关闭所有标签

## 工具函数

### HTTP 请求封装

基于axios 的 HTTP 请求封装，提供统一的错误处理和响应转换。

### 主题工具

提供主题相关的工具函数，如颜色转换、主题变量等。主题切换主要是通过antd的样式token结合tailwind自定义css变量来完成的

```tsx
import { themeVars } from '@/configs/theme/hooks/theme.css';
import { rgbAlpha } from '@/utils/theme';
```

## 开发指南

### 添加新页面

1. 在 `src/pages` 目录下创建新的页面组件
2. 在菜单配置中添加该页面的路由信息
3. 如果需要，配置页面的转场动画

### 添加新组件

1. 在 `src/components` 目录下创建新组件
2. 使用 TypeScript 类型确保组件接口清晰
3. 遵循项目的样式和代码规范

### 最佳实践

- 使用函数组件和 Hooks，避免使用类组件
- 合理使用 React.memo、useMemo 和 useCallback 优化性能
- 使用 TypeScript 为所有组件和函数添加类型
- 添加适当的注释说明组件的用途和使用方法
- 使用模块化的方式组织代码，避免大文件
- 在处理副作用时使用 useEffect 的依赖数组避免不必要的渲染

### 常见问题

1. **样式问题**：使用 styled-components 时，记得使用 `$` 前缀处理传递给 DOM 的 props
2. **动画闪烁**：当同时设置进入和离开动画时，可能会导致页面闪烁，使用 `AnimatePresence` 的 `mode="wait"` 属性解决
3. **类型错误**：确保所有组件和函数都有正确的类型定义，特别是第三方库的集成

## 功能专区

在此区域，我们列出项目中的主要功能模块，并标注其完成状态。你可以根据需要更新每个功能的状态。

### 功能列表

- [X] **主题切换**：支持多种主题模式切换
- [X] **布局切换**：支持多种布局切换
- [X] **权限管理**：基于角色的权限控制系统
- [X] **路由系统**：基于权限的动态路由配置
- [X] **多标签页管理**：支持多标签页的打开、关闭和切换（未完成页面缓存功能）
- [X] **动画系统**：提供路由切换动画和元素动画效果
- [X] **表格组件**：支持拖动自定义列、排序、筛选和分页
- [X] **通知系统**：基于 sonner 的通知系统，支持多种通知类型
- [ ] **文件上传**：引入oss 支持单文件、多文件、分片和图片上传
- [ ] **报表生成**：支持生成和导出报表功能
- [ ] **实时聊天**：集成实时聊天功能
- [ ] **数据可视化**：提供数据图表和可视化工具

---

请根据项目的实际进展更新此列表，并标注每个功能的完成状态。

## 代码质量工具

### Biome

本项目使用 Biome 作为代码格式化和 linting 工具，它是一个高性能的 JavaScript/TypeScript 工具，可以替代 ESLint、Prettier 等工具。

#### 主要特点

- 🚀 **高性能**：比传统工具快 5-10 倍
- 📦 **一体化**：集成了 linting、formatting 和 import 排序功能
- 🔧 **开箱即用**：预设合理的规则配置
- 🛠️ **易于配置**：简单的 JSON 配置文件

#### VS Code 集成

安装 Biome VS Code 扩展后，可以获得实时检查和自动格式化功能：

1. 在 VS Code 扩展市场搜索并安装 "Biome"
2. 在设置中将 Biome 设置为默认格式化工具
