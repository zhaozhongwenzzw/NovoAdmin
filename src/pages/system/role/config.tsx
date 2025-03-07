import { RoleListResponse } from '@/api/system/role';
import { Button, Space } from 'antd';
import { Iconify } from '@/components/icon';

// 获取表格列配置
export const getColumns = (handleEdit: (record: RoleListResponse) => void) => [
  {
    title: '角色名称',
    dataIndex: 'name',
    key: 'name',
    width: 180,
  },
  {
    title: '角色描述',
    dataIndex: 'description',
    key: 'description',
    width: 230,
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 180,
  },
  {
    title: '操作',
    key: 'operation',
    width: 120,
    render: (_: any, record: RoleListResponse) => (
      <Space>
        <Button type="link" size="small" icon={<Iconify icon="mdi:pencil" className="text-primary" />} onClick={() => handleEdit(record)}>
          编辑
        </Button>
      </Space>
    ),
  },
];
