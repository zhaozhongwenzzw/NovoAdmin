import type React from "react";
import { useEffect, useState } from "react";
import { Card, Button, Modal, Form, Input, Row, Col, Select, Space, type UploadFile } from "antd";
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
import { getRoleEnumList } from "@/api/common/enum";
import { getColumns } from "./config";
import { UserStatus } from "@/types/user";
import Main from "@/components/main";
import { Iconify } from "@/components/icon";
import { usePagination } from "@/hooks/usePagination";
import { useEnum } from "@/hooks/useEnum";
import type { BaseEnumResponse } from "@/api/common/enum";
import Upload from "@/components/upload";

const statusOptions = [
	{ label: "启用", value: UserStatus.Enabled },
	{ label: "禁用", value: UserStatus.Disabled },
];

const App: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [tableData, setTableData] = useState<UserListResponse[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();
	const [searchForm] = Form.useForm();
	const [isEdit, setIsEdit] = useState(false);

	// 使用分页钩子管理分页和搜索参数
	const {
		pagination,
		params,
		handlePaginationChange,
		handleSearch: triggerSearch,
		handleReset: triggerReset,
		setTotal,
	} = usePagination<UserListRequest>({ form: searchForm });

	//Enum
	const { data: roleEnumList } = useEnum<BaseEnumResponse>(getRoleEnumList, []);

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
		const newParams = triggerSearch();
		getList(newParams);
	};

	// 重置处理
	const handleReset = () => {
		const newParams = triggerReset();
		getList(newParams);
	};

	const handleSubmit = async (values: AddUserParams | UpdateUserParams) => {
		if (isEdit) {
			const res = await updateUser(values as UpdateUserParams);
			if (res.code === 200) {
				toast.success(res.message || "修改成功");
				setIsModalOpen(false);
				form.resetFields();
				getList();
			} else {
				toast.error(res.message || "修改失败");
			}
		} else {
			const res = await addUser(values as AddUserParams);
			if (res.code === 200) {
				toast.success(res.message);
				setIsModalOpen(false);
				form.resetFields();
				getList();
			} else {
				toast.error(res.message);
			}
		}
	};

	const handleEdit = (record: UserListResponse) => {
		setIsEdit(true);
		form.setFieldsValue({
			id: record.id,
			account: record.account,
			username: record.username,
			phone: record.phone,
			status: record.status,
			roleId: record.roleId,
		});
		setIsModalOpen(true);
	};

	const handleAdd = () => {
		setIsEdit(false);
		form.resetFields();
		setIsModalOpen(true);
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

	//上传
	const handleUpload = (info: { fileList: UploadFile[]; file: File }) => {
		const fileList = info.fileList;
		const avatar = fileList
			.filter((item: UploadFile) => item.url)
			?.map((item: UploadFile) => item.url)
			?.join("");
		form.setFieldsValue({ avatar });
	};

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
						<Button type="primary" icon={<Iconify size={16} icon="mingcute:user-add-2-line" />} onClick={handleAdd}>
							新增
						</Button>
					),
				}}
				onRefresh={getList}
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
				title={isEdit ? "编辑用户" : "新增用户"}
				open={isModalOpen}
				width={800}
				onCancel={() => {
					setIsModalOpen(false);
					form.resetFields();
				}}
				footer={null}
			>
				<Form
					form={form}
					layout="horizontal"
					onFinish={handleSubmit}
					labelCol={{ span: 6 }}
					wrapperCol={{ span: 18 }}
					autoComplete="off"
				>
					<Row gutter={[16, 0]}>
						<Col xs={24} md={12}>
							<Form.Item name="id" hidden>
								<Input />
							</Form.Item>
							<Form.Item label="账号" name="account" rules={[{ required: true, message: "请输入账号" }]}>
								<Input placeholder="请输入账号" disabled={isEdit} autoComplete="off" />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名" }]}>
								<Input placeholder="请输入用户名" autoComplete="off" />
							</Form.Item>
						</Col>

						<Col xs={24} md={12}>
							<Form.Item label="手机号" name="phone" rules={[{ required: true, message: "请输入手机号" }]}>
								<Input placeholder="请输入手机号" autoComplete="off" />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item label="邮箱" name="email" rules={[{ required: true, message: "请输入邮箱" }]}>
								<Input placeholder="请输入邮箱" autoComplete="off" />
							</Form.Item>
						</Col>

						{!isEdit && (
							<Col xs={24} md={12}>
								<Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码" }]}>
									<Input.Password placeholder="请输入密码" autoComplete="new-password" />
								</Form.Item>
							</Col>
						)}
						<Col xs={24} md={12}>
							<Form.Item label="角色" name="roleId" rules={[{ required: true, message: "请选择角色" }]}>
								<Select options={roleEnumList} mode="multiple" placeholder="请选择角色" />
							</Form.Item>
						</Col>

						<Col xs={24}>
							<Form.Item label="备注" name="remark" labelCol={{ xs: 6, md: 3 }} wrapperCol={{ xs: 18, md: 21 }}>
								<Input.TextArea rows={4} placeholder="请输入备注信息" />
							</Form.Item>
						</Col>

						<Col xs={24}>
							<Form.Item
								label="头像"
								labelCol={{ xs: 6, md: 3 }}
								wrapperCol={{ xs: 18, md: 21 }}
								name="avatar"
								rules={[{ required: true, message: "请上传头像" }]}
							>
								<Upload onChange={handleUpload} />
							</Form.Item>
						</Col>

						<Col xs={24}>
							<Form.Item className="text-right mb-0">
								<Space>
									<Button onClick={() => setIsModalOpen(false)}>取消</Button>
									<Button type="primary" htmlType="submit">
										确定
									</Button>
								</Space>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</Main>
	);
};

export default App;
