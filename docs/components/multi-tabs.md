# 多标签页组件 (Multi-Tabs)

提供类似浏览器标签页的多页面管理功能，支持动态增删、页面缓存和右键菜单操作。

## 功能特性
- 动态添加/关闭标签页
- 页面状态缓存
- 右键上下文菜单
- 标签页拖拽排序
- 自动记忆最后访问页

## 使用示例

```tsx
import { MultiTabs } from "@/components/multi-tabs";

function PageContainer() {
  return (
    <MultiTabs 
      cacheable
      defaultTabs={[
        { key: 'home', title: '首页', content: <HomePage /> },
        { key: 'users', title: '用户管理', content: <UserPage /> }
      ]}
    >
      <MultiTabs.Tab 
        key="settings" 
        title="系统设置" 
        content={<SettingsPage />}
        closable={false}
      />
    </MultiTabs>
  );
}
```

## Props 配置

| 属性            | 类型                      | 默认值   | 说明                                                                 |
|-----------------|---------------------------|----------|--------------------------------------------------------------------|
| cacheable       | boolean                   | true     | 是否启用页面缓存                                                      |
| defaultTabs     | TabItem[]                 | []       | 初始标签页配置                                                       |
| maxCount        | number                    | 10       | 最大允许打开的标签页数量                                              |
| position        | 'top' \| 'left'           | 'top'    | 标签页位置                                                           |
| showRefresh     | boolean                   | true     | 是否显示刷新按钮                                                     |
| tabBarExtra     | ReactNode                 | -        | 标签栏右侧扩展内容                                                   |

### TabItem 类型
```ts
interface TabItem {
  key: string;          // 唯一标识
  title: string;        // 标签标题
  content: ReactNode;   // 页面内容
  icon?: ReactNode;     // 标签图标
  closable?: boolean;   // 是否可关闭
}
```

## 方法 API

```ts
interface MultiTabsInstance {
  addTab: (tab: TabItem) => void;          // 添加新标签页
  closeTab: (key: string) => void;         // 关闭指定标签页
  refreshTab: (key: string) => void;       // 刷新指定标签页
  closeOtherTabs: (key: string) => void;   // 关闭其他标签页
  closeAllTabs: () => void;                // 关闭所有标签页
  updateTab: (key: string, newTab: Partial<TabItem>) => void; // 更新标签页配置
}
```

## 右键菜单功能
右键点击标签页可触发以下操作：
- 关闭当前页
- 关闭其他页
- 关闭右侧所有页
- 刷新页面
- 复制页面路径

## 注意事项
1. 需要配合路由系统使用，建议在布局组件中包裹路由出口
2. 缓存功能依赖 `key` 的唯一性，请确保每个标签页有唯一标识
3. 动态更新内容时请使用 `updateTab` 方法保持状态同步 