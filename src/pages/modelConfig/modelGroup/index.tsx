import type React from "react";
import { useEffect, useState } from "react";
import { Card, Button, Modal, Form, Input, Row, Col, Space } from "antd";
import TableContainer from "@/components/table/TableContainer";
import { toast } from "sonner";
import {
	getModelGroupList,
	type ModelGroups,
	addModelGroup,
	type AddModelGroupParams,
	updateModelGroup,
	type UpdateModelGroupParams,
	deleteModelGroup,
	type ModelGroupListRequest,
} from "@/api/model/modelGroup";
import { getColumns } from "./config";
import Main from "@/components/main";
import { Iconify } from "@/components/icon";
import { usePagination } from "@/hooks/usePagination";

const App: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [tableData, setTableData] = useState<ModelGroups[]>([]);
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
	} = usePagination<ModelGroupListRequest>({ form: searchForm });

	// 获取列表数据
	const getList = async (searchParams = params) => {
		setLoading(true);
		try {
			const res = await getModelGroupList(searchParams);
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

	const handleSubmit = async (values: AddModelGroupParams | UpdateModelGroupParams) => {
		if (isEdit) {
			const res = await updateModelGroup(values as UpdateModelGroupParams);
			if (res.code === 200) {
				toast.success(res.message || "修改成功");
				setIsModalOpen(false);
				form.resetFields();
				getList();
			} else {
				toast.error(res.message || "修改失败");
			}
		} else {
			const res = await addModelGroup(values as AddModelGroupParams);
			if (res.code === 200) {
				toast.success(res.message || "新增成功");
				setIsModalOpen(false);
				form.resetFields();
				getList();
			} else {
				toast.error(res.message || "新增失败");
			}
		}
	};

	const handleEdit = (record: ModelGroups) => {
		setIsEdit(true);
		form.setFieldsValue({
			id: record.id,
			name: record.name,
			apiKey: record.apiKey,
			baseUrl: record.baseUrl,
			options: record.options,
			description: record.description,
		});
		setIsModalOpen(true);
	};

	const handleAdd = () => {
		setIsEdit(false);
		form.resetFields();
		setIsModalOpen(true);
	};

	const handleDelete = (record: ModelGroups) => {
		toast.promise(deleteModelGroup({ id: record.id }), {
			loading: "删除模型分组中...",
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
							<Form.Item label="分组名称" name="name" className="mb-0">
								<Input placeholder="请输入分组名称" allowClear />
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
					title: "模型分组列表",
					extra: (
						<Button type="primary" icon={<Iconify size={16} icon="mingcute:add-line" />} onClick={handleAdd}>
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
				title={isEdit ? "编辑模型分组" : "新增模型分组"}
				open={isModalOpen}
				width={600}
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
					<Form.Item name="id" hidden>
						<Input />
					</Form.Item>
					<Form.Item label="分组名称" name="name" rules={[{ required: true, message: "请输入分组名称" }]}>
						<Input placeholder="请输入分组名称" autoComplete="off" />
					</Form.Item>
					<Form.Item label="apiKey" name="apiKey" rules={[{ required: false, message: "请输入apiKey" }]}>
						<Input placeholder="请输入apiKey" autoComplete="off" />
					</Form.Item>
					<Form.Item label="baseUrl" name="baseUrl" rules={[{ required: false, message: "请输入baseUrl" }]}>
						<Input placeholder="请输入baseUrl" autoComplete="off" />
					</Form.Item>
					<Form.Item label="openAi配置" name="options" rules={[{ required: true, message: "请输入openAi配置" }]}>
						<Input.TextArea rows={4} placeholder="请输入openAi配置" />
					</Form.Item>
					<Form.Item label="描述" name="description" rules={[{ required: true, message: "请输入描述" }]}>
						<Input.TextArea rows={4} placeholder="请输入描述信息" />
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
		</Main>
	);
};

export default App;
