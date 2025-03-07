# 表格容器组件 (Table Container)

提供企业级数据表格解决方案，支持复杂数据展示、筛选排序和分页加载。

## 功能特性

- 自适应列宽
- 多级表头支持
- 自定义单元格渲染
- 服务端分页/筛选/排序
- 行选择功能
- 导出 Excel/CSV
- 列配置持久化

## 使用示例

```tsx
import { TableContainer } from "@/components/table-container";

const UserTable = () => {
  const columns = [
    {
      title: '用户信息',
      children: [
        { 
          title: '姓名', 
          dataIndex: 'name',
          sorter: true,
          filterType: 'search'
        },
        {
          title: '年龄',
          dataIndex: 'age',
          render: (value) => <span className="text-blue-500">{value}岁</span>
        }
      ]
    },
    {
      title: '操作',
      fixed: 'right',
      actions: [
        {
          icon: 'edit',
          onClick: (record) => handleEdit(record.id)
        }
      ]
    }
  ];

  return (
    <TableContainer
      columns={columns}
      rowKey="id"
      url="/api/users"
      pagination={{
        pageSize: 20,
        showSizeChanger: true
      }}
      rowSelection={{
        type: 'checkbox',
        onSelect: (keys) => console.log('Selected:', keys)
      }}
    />
  );
}
```

## Props 配置

| 属性         | 类型                       | 默认值 | 说明               |
| ------------ | -------------------------- | ------ | ------------------ |
| columns      | ColumnType[]               | []     | 表格列配置         |
| url          | string                     | -      | 数据接口地址       |
| rowKey       | string                     | 'id'   | 行数据唯一标识字段 |
| scroll       | { x?: number, y?: number } | -      | 表格滚动配置       |
| pagination   | boolean\| object           | true   | 分页配置           |
| rowSelection | object                     | -      | 行选择配置         |
| exportable   | boolean                    | true   | 是否启用导出功能   |

### ColumnType 类型

```ts
interface ColumnType {
  title: string;
  dataIndex: string;
  width?: number;
  fixed?: 'left' | 'right';
  sorter?: boolean | Function;
  filterType?: 'search' | 'select' | 'date';
  render?: (value: any, record: any) => ReactNode;
  children?: ColumnType[]; // 用于多级表头
}
```

## 方法 API

```ts
interface TableInstance {
  reload: () => void;                     // 重新加载数据
  getSelectedRows: () => any[];           // 获取选中行数据
  exportData: (type: 'excel' | 'csv') => void; // 导出数据
  resetColumns: () => void;               // 重置列配置
}
```

## 服务端交互

当配置 `url` 属性时，组件会自动处理分页、筛选和排序参数：

请求参数格式：

```json
{
  "page": 1,
  "pageSize": 20,
  "filters": {
    "name": "john",
    "age": [20, 30]
  },
  "sorts": [
    { "field": "createdAt", "order": "desc" }
  ]
}
```

响应数据格式要求：

```json
{
  "success": true,
  "data": {
    "list": [],
    "total": 100
  }
}
```

## 最佳实践

1. 复杂表格建议拆分列配置到独立文件
2. 大数据量时开启虚拟滚动（设置 `scroll.y`）
3. 频繁更新的表格建议设置 `debounce` 属性
4. 敏感操作列建议固定到右侧（`fixed: 'right'`）
