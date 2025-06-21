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
		title: "模型标签",
		width: 400,
		dataIndex: "tags",
		key: "tags",
		render: (tags) => tagList(tags)
	},
	{
		title: "状态",
		width: 100,
		dataIndex: "status",
		key: "status",
		render: (status: number) => (
			<Tag color={status ? "success" : "error"}>
				{status ? "启用" : "禁用"}
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

const tagListOption = {
	"Thinking": {
		color: 'volcano',
		label: '深度思考'
	},
	"Image": {
		color: 'magenta',
		label: '图像分析'
	},
	"File": {
		color: 'orange',
		label: '文件分析'
	},
	"Text": {
		color: 'blue',
		label: '文本对话'
	},
	"Free": {
		color: 'green',
		label: '免费'
	},
	"Paid": {
		color: 'green',
		label: '收费'
	},
	"default": {
		color: '',
		label: '文本对话'
	},
}
const tagList = (tags: string[]) => {
	if (tags && tags.length > 0) {
		return (
			<Space size={[0, 8]} wrap>
				{tags.map((tag) => {
					if (tag in tagListOption) {
						const key = tag as keyof typeof tagListOption;
						return (
							<Tag key={key} color={tagListOption[key].color}>
								{tagListOption[key].label}
							</Tag>
						);
					}
					return null;
				})}
			</Space>
		);
	}
	return null;
}