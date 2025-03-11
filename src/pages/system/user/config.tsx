import { type UserListResponse, UserStatus } from "@/api/system/user";
import type { TableColumnsType } from "antd";
import { Tag, Space } from "antd";
import { Iconify } from "@/components/icon";
//组件
import WithTooltipConfirm from "@/components/withTooltipConfirm";
interface ConfigType {
	handleEdit: (record: UserListResponse) => void;
	handleDelete: (record: UserListResponse) => void;
}

export const getColumns = (props: ConfigType): TableColumnsType<UserListResponse> => [
	{
		title: "用户名",
		width: 120,
		dataIndex: "username",
		key: "username",
		fixed: "left",
	},
	{
		title: "账号",
		width: 120,
		dataIndex: "account",
		key: "account",
		fixed: "left",
	},
	{
		title: "邮箱",
		width: 150,
		dataIndex: "email",
		key: "email",
	},
	{
		title: "手机号",
		width: 120,
		dataIndex: "phone",
		key: "phone",
	},
	{
		title: "状态",
		width: 100,
		dataIndex: "statusStr",
		key: "statusStr",
		render: (statusStr: number, record: UserListResponse) => (
			<Tag color={record.status === UserStatus.NORMAL ? "success" : "error"}>{statusStr}</Tag>
		),
	},
	{
		title: "登录次数",
		width: 100,
		dataIndex: "loginCount",
		key: "loginCount",
	},
	{
		title: "最后登录时间",
		width: 180,
		dataIndex: "lastLoginTime",
		key: "lastLoginTime",
	},
	{
		title: "创建时间",
		width: 180,
		dataIndex: "createdAt",
		key: "createdAt",
	},
	{
		title: "备注",
		width: 200,
		dataIndex: "remark",
		key: "remark",
	},
	{
		title: "操作",
		key: "operation",
		fixed: "right",
		width: 120,
		render: (_: any, record: UserListResponse) => (
			<Space size={15}>
				<WithTooltipConfirm tooltipTitle="编辑" showPopconfirm={false}>
					<Iconify
						size={21}
						className="cursor-pointer text-primary"
						icon="la:user-edit"
						onClick={() => props.handleEdit(record)}
					/>
				</WithTooltipConfirm>
				<WithTooltipConfirm
					tooltipTitle="删除"
					popconfirmTitle="确定要删除吗？"
					onConfirm={() => props.handleDelete(record)}
				>
					<Iconify size={21} className="cursor-pointer text-error" icon="ant-design:user-delete-outlined" />
				</WithTooltipConfirm>
			</Space>
		),
	},
];
