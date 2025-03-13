import type React from "react";
import { useEffect, useState } from "react";
import { Card, Button, Modal, Form, Input, Row, Col, Space, Select } from "antd";
import TableContainer from "@/components/table/TableContainer";
import { toast } from "sonner";
import { getPermissionList, addPermission, updatePermission } from "@/api/system/permission";
import type { PermissionRequest, PermissionListRequest, PermissionListResponse } from "@/api/system/permission";
import { getColumns } from "./config";
import Main from "@/components/main";
import { Iconify } from "@/components/icon";
import { usePagination } from "@/hooks/usePagination";

const RolePage: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [tableData, setTableData] = useState<PermissionListResponse[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false); // 新增状态变量来追踪是新增还是编辑
	const [form] = Form.useForm();
	const [searchForm] = Form.useForm();

	// 使用分页钩子管理分页和搜索参数
	const {
		pagination,
		params,
		handlePaginationChange,
		handleSearch: triggerSearch,
		handleReset: triggerReset,
		setTotal,
	} = usePagination<PermissionListRequest>({ form: searchForm });

	// 获取角色列表数据
	const getList = async (searchParams = params) => {
		setLoading(true);
		try {
			const res = await getPermissionList(searchParams);
			setLoading(false);
			if (res.code === 200) {
				setTableData(res.data.list);
				setTotal(res.data.total);
			} else {
				toast.error(res.message);
			}
		} catch (error) {
			setLoading(false);
			toast.error("获取数据失败");
		}
	};

	// 搜索处理
	const handleSearch = () => {
		const newParams = triggerSearch(); // 获取最新参数
		getList(newParams); // 使用最新参数查询
	};

	// 重置处理
	const handleReset = () => {
		const newParams = triggerReset(); // 获取重置后的参数
		getList(newParams); // 使用重置后的参数查询
	};

	// 打开新增模态框
	const openAddModal = () => {
		setIsEdit(false);
		form.resetFields();
		setIsModalOpen(true);
	};

	// 编辑角色
	const handleEdit = (record: PermissionListResponse) => {
		setIsEdit(true);
		form.setFieldsValue({
			id: record.id,
			name: record.name,
			identifier: record.identifier,
			type: record.type,
			description: record.description,
		});
		setIsModalOpen(true);
	};

	// 使用传入handleEdit函数来获取完整的列配置
	const tableColumns = getColumns({ handleEdit });

	//提交数据
	const submitForm = async (values: PermissionRequest) => {
		toast.promise(isEdit ? updatePermission(values) : addPermission(values), {
			loading: "提交中...",
			success: (res) => {
				if (res.code !== 200) {
					throw new Error(res.message);
				}
				setIsModalOpen(false);
				getList();
				return res.message;
			},
			error: (err) => {
				return err.message;
			},
		});
	};

	// 初始加载
	useEffect(() => {
		getList();
	}, [pagination.current, pagination.pageSize]);

	// 关闭模态框并重置表单
	const handleCancel = () => {
		setIsModalOpen(false);
		form.resetFields();
	};

	return (
		<Main>
			<Card>
				<Form form={searchForm}>
					<Row gutter={[16, 16]} align="middle">
						<Col span={24} sm={12} md={8} lg={6}>
							<Form.Item label="权限名称" name="name" className="mb-0">
								<Input placeholder="请输入权限名称" allowClear />
							</Form.Item>
						</Col>
						<Col span={24} sm={12} md={8} lg={6}>
							<Form.Item label="权限标识" name="identifier" className="mb-0">
								<Input placeholder="请输入权限标识" allowClear />
							</Form.Item>
						</Col>
						<Col span={24} sm={12} md={8} lg={6}>
							<Form.Item label="权限类型" name="type" className="mb-0">
								<Select placeholder="请选择权限类型" allowClear>
									<Select.Option value="menu">菜单</Select.Option>
									<Select.Option value="api">API</Select.Option>
									<Select.Option value="action">操作</Select.Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={24} sm={24} md={8} lg={6} className="flex justify-end items-center">
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
					title: "权限列表",
					extra: (
						<Button type="primary" icon={<Iconify size={16} icon="mdi:plus" />} onClick={openAddModal}>
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
				onRefresh={getList}
				onPaginationChange={handlePaginationChange}
			/>

			{/* 新增/编辑权限弹窗 */}
			<Modal title={isEdit ? "编辑权限" : "新增权限"} open={isModalOpen} onCancel={handleCancel} footer={null}>
				<Form form={form} layout="horizontal" labelCol={{ span: 4 }} onFinish={submitForm}>
					{/* 隐藏字段用于编辑时传递ID */}
					<Form.Item name="id" hidden>
						<Input />
					</Form.Item>

					<Form.Item label="权限名称" name="name" rules={[{ required: true, message: "请输入权限名称" }]}>
						<Input placeholder="请输入权限名称" />
					</Form.Item>

					<Form.Item label="权限标识" name="identifier" rules={[{ required: true, message: "请输入权限标识" }]}>
						<Input placeholder="请输入权限标识" disabled={isEdit} />
					</Form.Item>

					<Form.Item label="权限类型" name="type" rules={[{ required: true, message: "请选择权限类型" }]}>
						<Select placeholder="请选择权限类型">
							<Select.Option value="menu">菜单</Select.Option>
							<Select.Option value="api">API</Select.Option>
							<Select.Option value="action">操作</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item label="权限描述" name="description">
						<Input.TextArea rows={4} placeholder="请输入权限描述" />
					</Form.Item>

					<Form.Item className="text-right mb-0">
						<Space>
							<Button onClick={handleCancel}>取消</Button>
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
