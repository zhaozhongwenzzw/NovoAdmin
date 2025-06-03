import type { Model } from "@/api/model/model";
import type { TableColumnsType } from "antd";
import { Space, Tag } from "antd";
import { Iconify } from "@/components/icon";
import Copy from "@/components/copy";
import WithTooltipConfirm from "@/components/withTooltipConfirm";

interface ConfigType {
	handleEdit: (record: Model) => void;
	handleDelete: (record: Model) => void;
}

export const getColumns = (props: ConfigType): TableColumnsType<Model> => [
	{
		title: "调用模型名称",
		width: 300,
		dataIndex: "callName",
		key: "callName",
		fixed: "left",
		render: (callName: string) => (
			<Copy text={callName}>
				<Tag color="success">
					{callName}
				</Tag>
			</Copy>
		),
	},
	{
		title: "实际模型名称",
		width: 300,
		dataIndex: "model",
		key: "model",
		render: (model: string) => (
			<Copy text={model}>
				<Tag color="blue">
					{model}
				</Tag>
			</Copy>

		),
	},
	{
		title: "open配置",
		width: 200,
		dataIndex: "options",
		key: "options",
	},
	{
		title: "openai baseURL",
		width: 200,
		dataIndex: "baseURL",
		key: "baseURL",
	},
	{
		title: "open apiKey",
		width: 200,
		dataIndex: "api_key",
		key: "api_key",
	},
	{
		title: "所属分组",
		width: 120,
		dataIndex: "groupName",
		key: "groupName",
	},
	{
		title: "状态",
		width: 100,
		dataIndex: "isActive",
		key: "isActive",
		render: (isActive: boolean) => (
			<Tag color={isActive ? "success" : "error"}>
				{isActive ? "启用" : "禁用"}
			</Tag>
		),
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
		render: (_: any, record: Model) => (
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
			</Space>
		),
	},
];
