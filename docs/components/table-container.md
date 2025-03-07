# 表格容器组件 (Table Container)

提供企业级数据表格解决方案，集成卡片容器和高级交互功能，完全兼容 Ant Design 表格属性。

## 功能特性
- 卡片容器包装
- 表格列设置（显示/隐藏/排序/固定）
- 表格密度调节（紧凑/中等/宽松）
- 内容对齐方式配置
- 自适应高度和优化的滚动条
- 设置持久化（localStorage）
- 服务端分页/筛选/排序

## 使用示例

```tsx
import { TableContainer } from "@/components/table";
import { Button } from "antd";
import { Iconify } from "@/components/icon";

function UserTable() {
  const tableColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    }
  ];

  // 设置loading状态和分页
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const handlePaginationChange = (pagination) => {
    console.log('分页变化', pagination);
    // 触发数据加载
  };

  return (
    <TableContainer
      cardProps={{
        title: "用户列表",
        extra: (
          <Button
            type="primary"
            icon={<Iconify size={16} icon="mingcute:user-add-2-line" />}
            onClick={() => {}}
          >
            新增
          </Button>
        ),
      }}
      tableProps={{
        columns: tableColumns,
        dataSource: tableData,
        loading: loading,
        pagination: {
          total: pagination.total,
          current: pagination.current,
          pageSize: pagination.pageSize,
        },
        rowKey: "id",
      }}
      onPaginationChange={handlePaginationChange}
    />
  );
}
```

## Props 配置

### 核心属性

| 属性               | 类型                | 默认值         | 说明                       |
|--------------------|---------------------|----------------|----------------------------|
| cardProps          | CardProps           | -              | 卡片容器属性               |
| tableProps         | TableProps          | -              | 表格属性（兼容Ant Design） |
| tableKey           | string              | 'default_table'| 表格唯一标识（用于持久化） |
| showSettings       | boolean             | true           | 是否显示表格设置按钮       |
| onRefresh          | () => void          | -              | 刷新表格的回调             |
| onPaginationChange | (pagination) => void| -              | 分页变化的回调             |
| children           | ReactNode           | -              | 子元素（底部内容）         |

### 卡片属性 (cardProps)

| 属性        | 类型                | 说明                  |
|-------------|---------------------|----------------------|
| title       | ReactNode           | 卡片标题              |
| extra       | ReactNode           | 右侧操作区域          |
| className   | string              | 自定义类名            |
| style       | CSSProperties       | 自定义样式            |

### 表格属性 (tableProps)

完全兼容 Ant Design 的 Table 组件属性，以下是常用属性：

| 属性         | 类型                   | 说明                         |
|--------------|------------------------|------------------------------|
| columns      | ColumnsType[]          | 表格列定义                   |
| dataSource   | object[]               | 数据源                       |
| loading      | boolean                | 加载状态                     |
| pagination   | TablePaginationConfig  | 分页配置或 false 禁用分页    |
| rowKey       | string \| function     | 行数据唯一标识               |
| rowSelection | object                 | 行选择配置                   |
| onChange     | function(pagination, filters, sorter, extra) | 表格变化事件 |

## 表格设置功能

表格组件内置以下设置功能：

### 刷新按钮
点击刷新按钮会触发 `onRefresh` 回调。

### 表格密度设置
支持三种显示密度：
- 紧凑 (small)
- 中等 (middle) - 默认
- 宽松 (large)

### 内容对齐方式
支持三种对齐方式：
- 左对齐 (left)
- 居中对齐 (center) - 默认
- 右对齐 (right)

### 列设置
- 显示/隐藏列
- 拖拽排序列
- 列固定设置
- 一键重置

## 服务端分页示例

```tsx
import { TableContainer } from "@/components/table";
import { usePagination } from "@/hooks";

function ServerTable() {
  // 使用分页钩子
  const { pagination, loading, tableData, setPagination } = usePagination({
    fetchData: (params) => {
      // 调用 API 获取数据
      return userApi.getUserList(params);
    }
  });

  const handlePaginationChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize
    });
  };

  return (
    <TableContainer
      tableProps={{
        columns: tableColumns,
        dataSource: tableData,
        loading: loading,
        pagination: pagination,
        rowKey: "id",
      }}
      onPaginationChange={handlePaginationChange}
    />
  );
}
```

## 最佳实践

### 1. 列配置分离

复杂表格建议将列配置抽离为单独文件:

```tsx
// config.tsx
export const getUserColumns = () => [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: 120,
  },
  // 更多列...
];

// index.tsx
import { getUserColumns } from './config';

function UserTable() {
  const columns = getUserColumns();
  // ...
}
```

### 2. 开启虚拟滚动

大数据量时，启用虚拟滚动提高性能:

```tsx
<TableContainer
  tableProps={{
    // ...
    scroll: { 
      y: 500,  // 固定高度开启虚拟滚动
      x: 1200, // 水平滚动宽度
    },
  }}
/>
```

### 3. 自定义展示数据为空时的样式

```tsx
import { Empty } from 'antd';

<TableContainer
  tableProps={{
    // ...
    locale: {
      emptyText: <Empty 
        description="暂无数据" 
        image={Empty.PRESENTED_IMAGE_SIMPLE} 
      />
    }
  }}
/>
```

### 4. 表格数据加载钩子

```tsx
// 列表页面统一使用 useTableData 钩子
const { 
  data,
  loading,
  pagination,
  handleTableChange,
  refresh
} = useTableData({
  requestApi: userApi.list,
  defaultParams: { status: 'active' }
});
```

## 注意事项

1. **唯一标识**
   - 为每个表格设置唯一的 `tableKey`，以避免配置冲突
   - 确保数据源中含有唯一标识字段，通过 `rowKey` 指定

2. **性能优化**
   - 大数据量表格设置 `scroll.y` 启用虚拟滚动
   - 使用 `useMemo` 缓存列定义和复杂渲染函数

3. **样式兼容**
   - 表格容器默认占满父容器高度
   - 在布局组件中设置固定高度或使用 flex 布局
