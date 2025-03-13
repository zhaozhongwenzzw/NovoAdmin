import type React from "react";
import { useEffect, useState } from "react";
import { Card, Button, Modal, Form, Input, Row, Col, Select, Space } from "antd";
import TableContainer from "@/components/table/TableContainer";
import { toast } from "sonner";
import {
	getUserList,
	type UserListResponse,
	addUser,
	type AddUserParams,
	updateUser,
	type UpdateUserParams,
	deleteUser,
	type UserListRequest,
} from "@/api/system/user";
import { getColumns } from "./config";
import { UserStatus } from "@/types/user";
import Main from "@/components/main";
import { Iconify } from "@/components/icon";
import { usePagination } from "@/hooks/usePagination";

const statusOptions = [
	{ label: "启用", value: UserStatus.Enabled },
	{ label: "禁用", value: UserStatus.Disabled },
];

const App: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [tableData, setTableData] = useState<UserListResponse[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [form] = Form.useForm();
	const [editForm] = Form.useForm();
	const [searchForm] = Form.useForm();

	// 使用分页钩子管理分页和搜索参数
	const {
		pagination,
		params,
		handlePaginationChange,
		handleSearch: triggerSearch,
		handleReset: triggerReset,
		setTotal,
	} = usePagination<UserListRequest>({ form: searchForm });

	// 获取列表数据
	const getList = async (searchParams = params) => {
		setLoading(true);
		try {
			const res = await getUserList(searchParams);
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

	const handleAdd = async (values: AddUserParams) => {
		const res = await addUser(values);
		if (res.code === 200) {
			toast.success(res.message);
			setIsModalOpen(false);
			form.resetFields();
			getList();
		} else {
			toast.error(res.message);
		}
	};

	const handleEdit = (record: UserListResponse) => {
		editForm.setFieldsValue({
			id: record.id,
			account: record.account,
			username: record.username,
			phone: record.phone,
			status: record.status,
		});
		setIsEditModalOpen(true);
	};

	const handleUpdate = async (values: UpdateUserParams) => {
		const res = await updateUser(values);
		if (res.code === 200) {
			toast.success(res.message || "修改成功");
			setIsEditModalOpen(false);
			editForm.resetFields();
			getList();
		} else {
			toast.error(res.message || "修改失败");
		}
	};

	const handleDelete = (record: UserListResponse) => {
		toast.promise(deleteUser({ id: record.id }), {
			loading: "删除用户中...",
			success: (data) => {
				if (data.code !== 200) {
					throw new Error(data.message);
				}
				getList();
				return "删除成功";
			},
			error: (error) => {
				console.error(error);
				return error.message;
			},
		});
	};

	// 使用传入handleEdit函数来获取完整的列配置
	const tableColumns = getColumns({
		handleEdit,
		handleDelete,
	});

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
							<Form.Item label="用户信息" name="searchTerm" className="mb-0">
								<Input placeholder="请输入账号/用户名/邮箱/手机号" allowClear />
							</Form.Item>
						</Col>
						<Col span={24} sm={12} md={8} lg={6}>
							<Form.Item label="状态" name="status" className="mb-0">
								<Select options={statusOptions} placeholder="请选择状态" allowClear />
							</Form.Item>
						</Col>
						<Col span={24} sm={24} md={8} lg={12} className="flex justify-end items-center">
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
					title: "用户列表",
					extra: (
						<Button
							type="primary"
							icon={<Iconify size={16} icon="mingcute:user-add-2-line" />}
							onClick={() => setIsModalOpen(true)}
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

			<Modal
				title="新增用户"
				open={isModalOpen}
				onCancel={() => {
					setIsModalOpen(false);
					form.resetFields();
				}}
				footer={null}
			>
				<Form form={form} layout="horizontal" onFinish={handleAdd} labelCol={{ span: 4 }}>
					<Form.Item label="账号" name="account" rules={[{ required: true, message: "请输入账号" }]}>
						<Input />
					</Form.Item>
					<Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名" }]}>
						<Input />
					</Form.Item>
					<Form.Item label="手机号" name="phone" rules={[{ required: true, message: "请输入手机号" }]}>
						<Input />
					</Form.Item>
					<Form.Item className="text-right mb-0">
						<Button type="primary" htmlType="submit">
							确定
						</Button>
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title="编辑用户"
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
					<Form.Item label="账号" name="account">
						<Input disabled />
					</Form.Item>
					<Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名" }]}>
						<Input />
					</Form.Item>
					<Form.Item label="手机号" name="phone" rules={[{ required: true, message: "请输入手机号" }]}>
						<Input />
					</Form.Item>
					<Form.Item label="状态" name="status" rules={[{ required: true, message: "请选择状态" }]}>
						<Select options={statusOptions} />
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

export default App;
