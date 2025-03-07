import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Form, Input, Row, Col, Space } from 'antd';
import TableContainer from '@/components/table/TableContainer';
import { toast } from 'sonner';
import { createRole, getRoleList, updateRole, RoleListResponse, CreateRoleDto, UpdateRoleDto, QueryRoleDto } from '@/api/system/role';
import { getColumns } from './config';
import Main from '@/components/main';
import { Iconify } from '@/components/icon';
import { usePagination } from '@/hooks/usePagination';

const RolePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<RoleListResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [searchForm] = Form.useForm();

  // 使用分页钩子管理分页和搜索参数
  const { pagination, params, handlePaginationChange, handleSearch: triggerSearch, handleReset: triggerReset, setTotal } = usePagination({ form: searchForm });

  // 获取角色列表数据
  const getList = async () => {
    setLoading(true);
    try {
      const res = await getRoleList(params as QueryRoleDto);
      setLoading(false);
      if (res.code === 200) {
        setTableData(res.data.list);
        setTotal(res.data.total);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error('获取数据失败');
    }
  };

  // 搜索处理
  const handleSearch = () => {
    triggerSearch();
    getList();
  };

  // 重置处理
  const handleReset = () => {
    triggerReset();
    getList();
  };

  // 添加角色
  const handleAdd = async (values: CreateRoleDto) => {
    const res = await createRole(values);
    if (res.code === 200) {
      toast.success(res.message || '添加成功');
      setIsModalOpen(false);
      form.resetFields();
      getList();
    } else {
      toast.error(res.message || '添加失败');
    }
  };

  // 编辑角色
  const handleEdit = (record: RoleListResponse) => {
    editForm.setFieldsValue({
      id: record.id,
      name: record.name,
      description: record.description,
    });
    setIsEditModalOpen(true);
  };

  // 更新角色
  const handleUpdate = async (values: UpdateRoleDto) => {
    const res = await updateRole(values);
    if (res.code === 200) {
      toast.success(res.message || '修改成功');
      setIsEditModalOpen(false);
      editForm.resetFields();
      getList();
    } else {
      toast.error(res.message || '修改失败');
    }
  };

  // 使用传入handleEdit函数来获取完整的列配置
  const tableColumns = getColumns(handleEdit);

  // 初始加载
  useEffect(() => {
    getList();
  }, [pagination.current, pagination.pageSize]);

  return (
    <Main>
      <Card>
        <Form form={searchForm}>
          <Row gutter={[16, 16]} align="middle">
            <Col span={24} sm={12} md={8} lg={6}>
              <Form.Item label="角色名称" name="name" className="mb-0">
                <Input placeholder="请输入角色名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={24} sm={24} md={8} lg={18} className="flex justify-end items-center">
              <Space>
                <Button type="primary" onClick={handleSearch}>
                  查询
                </Button>
                <Button onClick={handleReset}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <TableContainer
        cardProps={{
          title: '角色列表',
          extra: (
            <Button type="primary" icon={<Iconify size={16} icon="mdi:plus" />} onClick={() => setIsModalOpen(true)}>
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
          rowKey: 'id',
        }}
        onPaginationChange={handlePaginationChange}
      />

      {/* 新增角色弹窗 */}
      <Modal
        title="新增角色"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item label="角色名称" name="name" rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="角色描述" name="description">
            <Input.TextArea rows={4} placeholder="请输入角色描述" />
          </Form.Item>
          <Form.Item className="text-right mb-0">
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑角色弹窗 */}
      <Modal
        title="编辑角色"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          editForm.resetFields();
        }}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="角色名称" name="name" rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="角色描述" name="description">
            <Input.TextArea rows={4} placeholder="请输入角色描述" />
          </Form.Item>
          <Form.Item className="text-right mb-0">
            <Space>
              <Button onClick={() => setIsEditModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Main>
  );
};

export default RolePage;
