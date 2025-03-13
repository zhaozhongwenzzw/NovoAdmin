import { Space } from "antd";
import { Iconify } from "@/components/icon";
import WithTooltipConfirm from "@/components/withTooltipConfirm";
import type { PermissionListResponse } from "@/api/system/permission";

interface ConfigType {
	handleEdit?: (record: PermissionListResponse) => void;
	handleDelete?: (record: PermissionListResponse) => void;
	handleMenu?: (record: PermissionListResponse) => void;
}
// 获取表格列配置
export const getColumns = (props: ConfigType) => [
	{
		title: "权限名称",
		dataIndex: "name",
		key: "name",
		width: 180,
	},
	{
		title: "权限标识",
		dataIndex: "identifier",
		key: "identifier",
		width: 180,
	},
	{
		title: "权限类型",
		dataIndex: "type",
		key: "type",
		width: 180,
	},
	{
		title: "权限描述",
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
		render: (_: any, record: PermissionListResponse) => (
			<Space size={20}>
				<WithTooltipConfirm tooltipTitle="编辑" showPopconfirm={false}>
					<Iconify
						size={20}
						className="cursor-pointer text-primary"
						icon="tabler:edit"
						onClick={() => props?.handleEdit?.(record)}
					/>
				</WithTooltipConfirm>
				<WithTooltipConfirm tooltipTitle="菜单权限" showPopconfirm={false}>
					<Iconify
						size={20}
						className="cursor-pointer text-primary"
						icon="hugeicons:menu-square"
						onClick={() => props?.handleMenu?.(record)}
					/>
				</WithTooltipConfirm>
				<WithTooltipConfirm
					tooltipTitle="删除"
					popconfirmTitle="确定删除该角色吗？"
					onConfirm={() => props?.handleDelete?.(record)}
				>
					<Iconify size={20} className="cursor-pointer text-error" icon="tabler:trash" />
				</WithTooltipConfirm>
			</Space>
		),
	},
];
