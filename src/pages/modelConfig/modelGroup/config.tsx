import type { ModelGroups } from "@/api/model/modelGroup";
import type { TableColumnsType } from "antd";
import { Space, Tag } from "antd";
import { Iconify } from "@/components/icon";
import WithTooltipConfirm from "@/components/withTooltipConfirm";
import Copy from "@/components/copy";

interface ConfigType {
	handleEdit: (record: ModelGroups) => void;
	handleDelete: (record: ModelGroups) => void;
	handleSync: (record: ModelGroups) => void;
}

export const getColumns = (props: ConfigType): TableColumnsType<ModelGroups> => [
	{
		title: "分组名称",
		width: 150,
		dataIndex: "name",
		key: "name",
		fixed: "left",
	},
	{
		title: "baseUrl",
		width: 200,
		dataIndex: "baseUrl",
		key: "baseUrl",
		render: (baseUrl: string) => (
			<Copy text={baseUrl}>
				<Tag color="success">
					{baseUrl}
				</Tag>
			</Copy>
		),
	},
	{
		title: "apiKey",
		width: 200,
		dataIndex: "apiKey",
		key: "apiKey",
		render: (apiKey: string) => (
			<Copy text={apiKey}>
				<Tag color="blue">
					{apiKey}
				</Tag>
			</Copy>
		),
	},
	{
		title: "描述",
		width: 200,
		dataIndex: "description",
		key: "description",
	},
	{
		title: "创建时间",
		width: 180,
		dataIndex: "createdAt",
		key: "createdAt",
	},
	{
		title: "操作",
		key: "operation",
		fixed: "right",
		width: 120,
		render: (_: any, record: ModelGroups) => (
			<Space size={20}>
				<WithTooltipConfirm tooltipTitle="编辑" showPopconfirm={false}>
					<Iconify
						size={21}
						className="cursor-pointer text-primary"
						icon="lucide:edit"
						onClick={() => props.handleEdit(record)}
					/>
				</WithTooltipConfirm>
				<WithTooltipConfirm
					tooltipTitle="删除"
					popconfirmTitle="确定要删除吗？"
					onConfirm={() => props.handleDelete(record)}
				>
					<Iconify size={21} className="cursor-pointer text-error" icon="ant-design:delete-outlined" />
				</WithTooltipConfirm>
				<WithTooltipConfirm
					tooltipTitle="同步模型"
					popconfirmTitle="确定要同步吗？"
					onConfirm={() => props.handleSync(record)}
				>
					<Iconify size={21} className="cursor-pointer text-error" icon="ant-design:delete-outlined" />
				</WithTooltipConfirm>
			</Space>
		),
	},
];
