import type React from "react";
import { useEffect, useState } from "react";
import { Card, Button, Modal, Form, Input, Row, Col, Space, Select } from "antd";
import TableContainer from "@/components/table/TableContainer";
import { toast } from "sonner";
import {
	getModelList,
	type Model,
	createModel,
	type CreateModelParams,
	updateModel,
	type UpdateModelParams,
	deleteModel,
	type ModelListRequest,
	syncApiModel
} from "@/api/model/model";
import { getAllModelGroups, type ModelGroups } from "@/api/model/modelGroup";
import { getColumns } from "./config";
import Main from "@/components/main";
import { Iconify } from "@/components/icon";
import { usePagination } from "@/hooks/usePagination";

const statusOptions = [
	{ label: "启用", value: true },
	{ label: "禁用", value: false },
];

const App: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [tableData, setTableData] = useState<Model[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();
	const [searchForm] = Form.useForm();
	const [isEdit, setIsEdit] = useState(false);
	const [groupOptions, setGroupOptions] = useState<{ label: string; value: string }[]>([]);

	// 使用分页钩子管理分页和搜索参数
	const {
		pagination,
		params,
		handlePaginationChange,
		handleSearch: triggerSearch,
		handleReset: triggerReset,
		setTotal,
	} = usePagination<ModelListRequest>({ form: searchForm });

	// 获取分组列表
	const getGroupOptions = async () => {
		try {
			const res = await getAllModelGroups();
			if (res.code === 200) {
				const options = res.data.map((item: ModelGroups) => ({
					label: item.name,
					value: item.id,
				}));
				setGroupOptions(options);
			}
		} catch (error) {
			console.error("获取分组列表失败:", error);
		}
	};

	// 获取列表数据
	const getList = async (searchParams = params) => {
		setLoading(true);
		try {
			const res = await getModelList(searchParams);
			setLoading(false);
			if (res.code === 200) {
				// 为每个模型添加分组名称
				const modelsWithGroupName = res.data.list.map((model: Model) => {
					const group = groupOptions.find(g => g.value === model.groupId);
					return {
						...model,
						groupName: group?.label || '未知分组'
					};
				});
				setTableData(modelsWithGroupName);
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

	const handleSubmit = async (values: CreateModelParams | UpdateModelParams) => {
		if (isEdit) {
			const res = await updateModel(values as UpdateModelParams);
			if (res.code === 200) {
				toast.success(res.message || "修改成功");
				setIsModalOpen(false);
				form.resetFields();
				getList();
			} else {
				toast.error(res.message || "修改失败");
			}
		} else {
			const res = await createModel(values as CreateModelParams);
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

	const handleEdit = (record: Model) => {
		setIsEdit(true);
		form.setFieldsValue({
			id: record.id,
			name: record.name,
			description: record.description,
			modelKey: record.modelKey,
			groupId: record.groupId,
			isActive: record.isActive,
		});
		setIsModalOpen(true);
	};

	const handleAdd = () => {
		setIsEdit(false);
		form.resetFields();
		form.setFieldsValue({ isActive: true }); // 默认启用
		setIsModalOpen(true);
	};

	const syncModel = async () => {
		const res = await syncApiModel();
		if (res.code === 200) {
			toast.success(res.message || "同步成功");
			getList();
		} else {
			toast.error(res.message || "同步失败");
		}
	}

	const handleDelete = (record: Model) => {
		toast.promise(deleteModel({ id: record.id }), {
			loading: "删除模型中...",
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
		getGroupOptions();
	}, []);

	useEffect(() => {
		if (groupOptions.length > 0) {
			getList();
		}
	}, [pagination.current, pagination.pageSize, groupOptions]);

	return (
		<Main>
			<Card>
				<Form form={searchForm}>
					<Row gutter={[16, 16]} align="middle">
						<Col span={24} sm={12} md={8} lg={6}>
							<Form.Item label="模型名称" name="name" className="mb-0">
								<Input placeholder="请输入模型名称" allowClear />
							</Form.Item>
						</Col>
						<Col span={24} sm={12} md={8} lg={6}>
							<Form.Item label="所属分组" name="groupId" className="mb-0">
								<Select options={groupOptions} placeholder="请选择分组" allowClear />
							</Form.Item>
						</Col>
						<Col span={24} sm={12} md={8} lg={6}>
							<Form.Item label="状态" name="isActive" className="mb-0">
								<Select options={statusOptions} placeholder="请选择状态" allowClear />
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
					title: <div className="flex">
						<span>模型列表</span>
						<div className="text-primary flex items-center ml-5 text-[16px] cursor-pointer" onClick={syncModel}>
							<Iconify size={16} icon="carbon:async" />
							<span>同步第三方模型</span>
						</div>
					</div>,
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
				title={isEdit ? "编辑模型" : "新增模型"}
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
							<Form.Item label="调用模型名称" name="callName" rules={[{ required: true, message: "请输入模型名称" }]}>
								<Input placeholder="请输入模型名称" autoComplete="off" />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item label="模型名称" name="model" rules={[{ required: true, message: "请输入模型名称" }]}>
								<Input placeholder="请输入模型名称" autoComplete="off" />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item label="所属分组" name="groupId" rules={[{ required: true, message: "请选择所属分组" }]}>
								<Select options={groupOptions} placeholder="请选择所属分组" />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item label="apiKey" name="apiKey" rules={[{ required: true, message: "请输入apiKey" }]}>
								<Input placeholder="请输入apiKey" autoComplete="off" />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item label="baseURL" name="baseURL" rules={[{ required: true, message: "请输入baseUrl" }]}>
								<Input placeholder="请输入baseUrl" autoComplete="off" />
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item label="配置项" name="options" rules={[{ required: true, message: "请输入配置项" }]} labelCol={{ xs: 6, md: 3 }} wrapperCol={{ xs: 18, md: 21 }}>
								<Input.TextArea rows={4} placeholder="请输入配置项" />
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