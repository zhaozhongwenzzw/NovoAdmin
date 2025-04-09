import type React from "react";
import { useEffect, useState } from "react";

// ant
import { Button, Space, Modal, Form, Input, Select, Segmented, Tag, Checkbox, Row, Col } from "antd";
import type { TableColumnsType } from "antd";
// 组件
import TableContainer from "@/components/table/TableContainer";
import { toast } from "sonner";
import Main from "@/components/main";
import { Iconify } from "@/components/icon";
import AnimateSelect from "./animationSelect";
// api
import {
	getMenus,
	addMenu,
	updateMenu,
	type MenuAddRequest,
	type MenuUpdateRequest,
	deleteMenu,
	type MenuListResponse,
} from "@/api/system/menus";

// 组件
import type { AnimationType } from "@/components/animate/types";
import type { IconifyIcon } from "@iconify/react/dist/iconify.js";
import WithTooltipConfirm from "@/components/withTooltipConfirm";
import { getPermissionsByType, type PermissionList } from "@/api/permissions";

// 定义权限列表接口
interface PermissionOption {
	label: string;
	value: string;
}

const App: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [menuData, setMenuData] = useState<MenuListResponse[]>([]);
	// 扁平化菜单数据
	const [flatMenuData, setFlatMenuData] = useState<MenuListResponse[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [form] = Form.useForm();
	const type = Form.useWatch("type", form);

	const [isInAnimationOpen, setIsInAnimationOpen] = useState(false);
	const [isOutAnimationOpen, setIsOutAnimationOpen] = useState(false);

	// 添加权限列表状态
	const [permissionOptions, setPermissionOptions] = useState<PermissionOption[]>([]);

	// 扁平化树形结构
	const flattenMenuTree = (menus: MenuListResponse[]): MenuListResponse[] => {
		return menus.reduce<MenuListResponse[]>((acc, menu) => {
			acc.push(menu);
			if (menu.children?.length) {
				acc.push(...flattenMenuTree(menu.children));
			}
			return acc;
		}, []);
	};

	const fetchMenus = async () => {
		setLoading(true);
		try {
			const res = await getMenus();
			setLoading(false);
			if (res.code === 200) {
				setMenuData(res.data);
				setFlatMenuData(flattenMenuTree(res.data));
			} else {
				toast.error(res.message || "获取菜单失败");
			}
		} catch (error) {
			setLoading(false);
			toast.error("获取菜单失败");
			console.error("获取菜单出错:", error);
		}
	};

	// 获取菜单权限列表
	const fetchPermissions = async () => {
		try {
			const res = await getPermissionsByType("menu");
			if (res.code === 200) {
				setPermissionOptions(
					res.data.map((item: PermissionList) => ({
						label: item.name,
						value: item.identifier,
					})),
				);
			} else {
				console.error("获取权限列表失败", res.message);
			}
		} catch (error) {
			console.error("获取权限列表出错:", error);
		}
	};

	// 初始化时获取菜单和权限数据
	useEffect(() => {
		fetchMenus();
		fetchPermissions();
	}, []);

	// 定义表格列
	const columns: TableColumnsType<MenuListResponse> = [
		{
			title: "菜单名称",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "菜单图标",
			dataIndex: "icon",
			key: "icon",
			render: (icon: string | IconifyIcon) => <Space>{icon && <Iconify icon={icon} size={16} />}</Space>,
		},
		{
			title: "路径",
			dataIndex: "path",
			key: "path",
		},
		{
			title: "组件",
			dataIndex: "component",
			key: "component",
		},
		{
			title: "排序",
			dataIndex: "orderNum",
			key: "orderNum",
		},
		{
			title: "可见",
			dataIndex: ["meta", "hidden"],
			key: "hidden",
			width: 80,
			render: (hidden: any) => <Tag color={hidden ? "error" : "success"}>{hidden ? "隐藏" : "显示"}</Tag>,
		},

		{
			title: "操作",
			key: "operation",
			fixed: "right",
			width: 160,
			render: (_: any, record: MenuListResponse) => (
				<Space size={20}>
					<WithTooltipConfirm tooltipTitle="新增子菜单" showPopconfirm={false}>
						<Iconify
							size={21}
							className="cursor-pointer text-primary"
							icon="tabler:category-plus"
							onClick={() => handleAddSub(record)}
						/>
					</WithTooltipConfirm>
					<WithTooltipConfirm tooltipTitle="编辑菜单" showPopconfirm={false}>
						<Iconify
							size={21}
							className="cursor-pointer text-primary"
							icon="tabler:edit"
							onClick={() => handleEdit(record)}
						/>
					</WithTooltipConfirm>
					<WithTooltipConfirm tooltipTitle="删除菜单" onConfirm={() => handleDelete(record)}>
						<Iconify size={21} className="cursor-pointer text-error" icon="tabler:layout-grid-remove" />
					</WithTooltipConfirm>
				</Space>
			),
		},
	];

	const handleAddSub = (record: MenuListResponse) => {
		handleOpenModal();
		form.setFieldsValue({
			id: "",
			name: "",
			path: record.path,
			icon: "",
			parentId: record.id,
			orderNum: null,
			type: "menu",
			component: "",
			inAnimation: "",
			outAnimation: "",
			identifier: null,
			autoCreatePermission: true,
		});
	};

	const handleEdit = (record: MenuListResponse) => {
		form.setFieldsValue({
			id: record.id,
			name: record.name,
			path: record.path,
			icon: record.icon,
			parentId: record.parentId,
			orderNum: record.orderNum,
			type: record.type,
			component: record.component,
			inAnimation: record.inAnimation,
			outAnimation: record.outAnimation,
			identifier: record.identifier,
		});
		setIsEditModalOpen(true);
	};

	const handleDelete = (record: MenuListResponse) => {
		toast.promise(deleteMenu(record.id), {
			loading: "删除菜单中...",
			success: (data) => {
				if (data.code !== 200) {
					throw new Error(data.message);
				}
				fetchMenus();
				return "删除成功";
			},
			error: (error) => {
				console.error(error);
				return error.message;
			},
		});
	};

	const handleUpdate = async (values: MenuUpdateRequest) => {
		toast.promise(updateMenu(values), {
			loading: "更新菜单中...",
			success: (data) => {
				if (data.code !== 200) {
					throw new Error(data.message);
				}
				fetchMenus();
				setIsEditModalOpen(false);
				return "更新成功";
			},
			error: (error) => {
				console.error(error);
				return error.message;
			},
		});
	};

	const handleAdd = async (values: MenuAddRequest) => {
		toast.promise(addMenu(values), {
			loading: "添加菜单中...",
			success: (data) => {
				if (data.code !== 200) {
					throw new Error(data.message);
				}
				fetchMenus();
				setIsModalOpen(false);
				return "添加成功";
			},
			error: (error) => {
				console.error(error);
				return error.message;
			},
		});
	};

	const handleOpenModal = () => {
		setIsModalOpen(true);
		form.resetFields();
	};

	return (
		<Main>
			<TableContainer
				onRefresh={fetchMenus}
				cardProps={{
					title: "菜单管理",
					extra: (
						<Button type="primary" icon={<Iconify size={16} icon="mdi:plus" />} onClick={handleOpenModal}>
							新增
						</Button>
					),
				}}
				tableProps={{
					pagination: false,
					columns: columns,
					dataSource: menuData,
					loading: loading,
					rowKey: "id",
					rowSelection: {
						type: "checkbox",
						onChange: (selectedRowKeys: any, selectedRows: any) => {
							console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
						},
					},
					expandable: {
						defaultExpandAllRows: true,
						childrenColumnName: "children",
					},
				}}
			/>

			{/* 编辑菜单弹窗 */}
			<Modal
				title="编辑菜单"
				open={isEditModalOpen}
				onCancel={() => {
					setIsEditModalOpen(false);
					form.resetFields();
				}}
				footer={null}
				width="50%"
			>
				<Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={handleUpdate}>
					<Row gutter={[16, 0]}>
						<Col xs={24} xl={12}>
							<Form.Item name="id" hidden>
								<Input />
							</Form.Item>
							<Form.Item label="类型" name="type" rules={[{ required: true, message: "请选择类型" }]}>
								<Segmented
									options={[
										{ label: "目录", value: "directory" },
										{ label: "菜单", value: "menu" },
									]}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} xl={12}>
							<Form.Item label="排序" name="orderNum">
								<Input type="number" placeholder="请输入排序号" />
							</Form.Item>
						</Col>
						<Col xs={24} xl={12}>
							<Form.Item label="菜单名称" name="name" rules={[{ required: true, message: "请输入菜单名称" }]}>
								<Input placeholder="请输入菜单名称" />
							</Form.Item>
						</Col>
						<Col xs={24} xl={12}>
							<Form.Item label="路径" name="path" rules={[{ required: true, message: "请输入路径" }]}>
								<Input placeholder="请输入路径" />
							</Form.Item>
						</Col>
						<Col xs={24} xl={12}>
							<Form.Item label="图标" name="icon">
								<Input placeholder="请输入图标名称" />
							</Form.Item>
						</Col>
						<Col xs={24} xl={12}>
							<Form.Item label="父级菜单" name="parentId">
								<Select
									placeholder="请选择父级菜单"
									allowClear
									showSearch
									optionFilterProp="label"
									options={flatMenuData.map((item) => ({
										label: item.name,
										value: item.id,
									}))}
								/>
							</Form.Item>
						</Col>

						{type === "menu" ? (
							<Col xs={24} xl={12}>
								<Form.Item label="组件" name="component">
									<Input placeholder="请输入组件路径" />
								</Form.Item>
							</Col>
						) : null}

						{type === "menu" ? (
							<Col xs={24} xl={12}>
								<Form.Item label="关联权限" name="identifier">
									<Select
										placeholder="请选择关联权限"
										allowClear
										showSearch
										optionFilterProp="label"
										options={permissionOptions}
									/>
								</Form.Item>
							</Col>
						) : null}

						{type === "menu" ? (
							<Col xs={24} xl={12}>
								<Form.Item label="进场动画" name="inAnimation">
									<Select
										placeholder="请选择动画效果"
										open={isInAnimationOpen}
										onDropdownVisibleChange={(visible: boolean) => setIsInAnimationOpen(visible)}
										dropdownRender={() => (
											<AnimateSelect
												onSelect={(type: AnimationType) => {
													form.setFieldValue("inAnimation", type);
													setIsInAnimationOpen(false);
												}}
											/>
										)}
										popupMatchSelectWidth={false}
										options={[]}
									/>
								</Form.Item>
							</Col>
						) : null}

						{type === "menu" ? (
							<Col xs={24} xl={12}>
								<Form.Item label="离场动画" name="outAnimation">
									<Select
										placeholder="请选择动画效果"
										open={isOutAnimationOpen}
										onDropdownVisibleChange={(visible: boolean) => setIsOutAnimationOpen(visible)}
										dropdownRender={() => (
											<AnimateSelect
												onSelect={(type: AnimationType) => {
													form.setFieldValue("outAnimation", type);
													setIsOutAnimationOpen(false);
												}}
											/>
										)}
										popupMatchSelectWidth={false}
										options={[]}
									/>
								</Form.Item>
							</Col>
						) : null}

						<Col span={24}>
							<Form.Item className="text-right mb-0">
								<Space>
									<Button onClick={() => setIsEditModalOpen(false)}>取消</Button>
									<Button type="primary" htmlType="submit">
										确定
									</Button>
								</Space>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>

			<Modal
				title="新增菜单"
				open={isModalOpen}
				onCancel={() => {
					setIsModalOpen(false);
					form.resetFields();
				}}
				footer={null}
				width="50%"
			>
				<Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={handleAdd}>
					<Row gutter={[16, 0]}>
						<Col xs={24} xl={12}>
							<Form.Item label="类型" name="type" rules={[{ required: true, message: "请选择类型" }]}>
								<Segmented
									options={[
										{ label: "目录", value: "directory" },
										{ label: "菜单", value: "menu" },
									]}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} xl={12}>
							<Form.Item label="排序" name="orderNum">
								<Input type="number" placeholder="请输入排序号" />
							</Form.Item>
						</Col>
						<Col xs={24} xl={12}>
							<Form.Item label="菜单名称" name="name" rules={[{ required: true, message: "请输入菜单名称" }]}>
								<Input placeholder="请输入菜单名称" />
							</Form.Item>
						</Col>
						<Col xs={24} xl={12}>
							<Form.Item label="路径" name="path" rules={[{ required: true, message: "请输入路径" }]}>
								<Input placeholder="请输入路径" />
							</Form.Item>
						</Col>
						<Col xs={24} xl={12}>
							<Form.Item label="图标" name="icon">
								<Input placeholder="请输入图标名称" />
							</Form.Item>
						</Col>
						<Col xs={24} xl={12}>
							<Form.Item label="父级菜单" name="parentId">
								<Select
									placeholder="请选择父级菜单"
									allowClear
									showSearch
									optionFilterProp="label"
									options={flatMenuData.map((item) => ({
										label: item.name,
										value: item.id,
									}))}
								/>
							</Form.Item>
						</Col>

						{type === "menu" ? (
							<Col xs={24} xl={12}>
								<Form.Item label="组件" name="component">
									<Input placeholder="请输入组件路径" />
								</Form.Item>
							</Col>
						) : null}

						{type === "menu" ? (
							<Col xs={24} xl={12}>
								<Form.Item label="关联权限" name="identifier">
									<Select
										placeholder="请选择关联权限"
										allowClear
										showSearch
										optionFilterProp="label"
										options={permissionOptions}
									/>
								</Form.Item>
							</Col>
						) : null}
						{type === "menu" ? (
							<Col xs={24} xl={12}>
								<Form.Item label="进场动画" name="inAnimation">
									<Select
										placeholder="请选择动画效果"
										open={isInAnimationOpen}
										onDropdownVisibleChange={(visible: boolean) => setIsInAnimationOpen(visible)}
										dropdownRender={() => (
											<AnimateSelect
												onSelect={(type: AnimationType) => {
													form.setFieldValue("inAnimation", type);
													setIsInAnimationOpen(false);
												}}
											/>
										)}
										popupMatchSelectWidth={false}
										options={[]}
									/>
								</Form.Item>
							</Col>
						) : null}

						{type === "menu" ? (
							<Col xs={24} xl={12}>
								<Form.Item label="离场动画" name="outAnimation">
									<Select
										placeholder="请选择动画效果"
										open={isOutAnimationOpen}
										onDropdownVisibleChange={(visible: boolean) => setIsOutAnimationOpen(visible)}
										dropdownRender={() => (
											<AnimateSelect
												onSelect={(type: AnimationType) => {
													form.setFieldValue("outAnimation", type);
													setIsOutAnimationOpen(false);
												}}
											/>
										)}
										popupMatchSelectWidth={false}
										options={[]}
									/>
								</Form.Item>
							</Col>
						) : null}

						{type === "menu" ? (
							<Col xs={24} xl={12}>
								<Form.Item
									label="自动创建"
									name="autoCreatePermission"
									valuePropName="checked"
									tooltip="选中后将自动创建与菜单同名的权限,如果已经手动选择了权限,则不会自动创建"
								>
									<Checkbox>自动创建对应权限</Checkbox>
								</Form.Item>
							</Col>
						) : null}
						<Col span={24}>
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
