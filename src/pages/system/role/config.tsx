import type { RoleListResponse } from "@/api/system/role";
import { Space } from "antd";
import { Iconify } from "@/components/icon";
import WithTooltipConfirm from "@/components/withTooltipConfirm";

interface ConfigType {
	handleEdit: (record: RoleListResponse) => void;
	handleDelete: (record: RoleListResponse) => void;
	handleMenu: (record: RoleListResponse) => void;
}
// 获取表格列配置
export const getColumns = (props: ConfigType) => [
	{
		title: "角色名称",
		dataIndex: "name",
		key: "name",
		width: 180,
	},
	{
		title: "角色描述",
		dataIndex: "description",
		key: "description",
		width: 230,
		ellipsis: true,
	},
	{
		title: "创建时间",
		dataIndex: "createdAt",
		key: "createdAt",
		width: 180,
	},
	{
		title: "更新时间",
		dataIndex: "updatedAt",
		key: "updatedAt",
		width: 180,
	},
	{
		title: "操作",
		key: "operation",
		width: 120,
		render: (_: any, record: RoleListResponse) => (
			<Space size={20}>
				<WithTooltipConfirm tooltipTitle="编辑" showPopconfirm={false}>
					<Iconify
						size={20}
						className="cursor-pointer text-primary"
						icon="tabler:edit"
						onClick={() => props.handleEdit(record)}
					/>
				</WithTooltipConfirm>
				<WithTooltipConfirm tooltipTitle="菜单权限" showPopconfirm={false}>
					<Iconify
						size={20}
						className="cursor-pointer text-primary"
						icon="hugeicons:menu-square"
						onClick={() => props.handleMenu(record)}
					/>
				</WithTooltipConfirm>
				<WithTooltipConfirm
					tooltipTitle="删除"
					popconfirmTitle="确定删除该角色吗？"
					onConfirm={() => props.handleDelete(record)}
				>
					<Iconify size={20} className="cursor-pointer text-error" icon="tabler:trash" />
				</WithTooltipConfirm>
			</Space>
		),
	},
];
