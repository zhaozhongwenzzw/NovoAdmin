import { Card, Space, Tree, Checkbox, type TreeProps } from "antd";
import { Iconify } from "@/components/icon";
import { cn } from "@/utils/cn";
import type { RoleListResponse, RoleMenuResponse } from "@/api/system/role";
import { useState, useEffect } from "react";
import { getMenus, type MenuListResponse } from "@/api/system/menus";
import { toast } from "sonner";
import type { DataNode } from "antd/es/tree";

interface RoleTreeProps {
	menuModalOpen: boolean;
	setMenuModalOpen: (open: boolean) => void;
	menuData: RoleListResponse | undefined;
	roleData: RoleMenuResponse[];
	onSubmit: (checkedKeys: React.Key[]) => void;
}
interface TreeDataNode {
	id: string;
	key?: React.Key;
	name: string;
	path: string;
	icon?: string;
	children?: TreeDataNode[];
	disabled?: boolean;
	identifier?: string;
}
interface DisableNode extends MenuListResponse {
	disabled?: boolean;
}
export default function RoleTree({ menuModalOpen, setMenuModalOpen, menuData, roleData, onSubmit }: RoleTreeProps) {
	// 优化disableNode函数，使用map递归处理，并确保返回修改后的树
	const disableNode = (nodes: DisableNode[]): MenuListResponse[] => {
		return nodes.map((node) => {
			// 创建节点的副本，避免直接修改原对象
			const newNode = { ...node };

			// 设置禁用状态 - 如果没有identifier则禁用
			newNode.disabled = !newNode.identifier;

			// 递归处理子节点
			if (newNode.children && newNode.children.length > 0) {
				newNode.children = disableNode(newNode.children);
			}

			return newNode;
		});
	};

	// 获取菜单树,如果没有权限标识，则不能去分配权限
	const getMenuTreeData = async () => {
		const res = await getMenus();
		if (res.code === 200) {
			// 使用disableNode函数处理数据并设置到状态
			const processedData = disableNode(res.data);
			setTreeData(processedData);
			// 提取所有键
			const keys = extractAllKeys(processedData);
			setAllKeys(keys);
		} else {
			toast.error(res.message);
		}
	};

	const [treeData, setTreeData] = useState<TreeDataNode[]>([]);

	// 获取所有树节点的键
	const [allKeys, setAllKeys] = useState<React.Key[]>([]);

	// 提取所有键的函数
	const extractAllKeys = (data: TreeDataNode[]): React.Key[] => {
		const keys: React.Key[] = [];
		const traverse = (nodes: TreeDataNode[]) => {
			for (const node of nodes) {
				if (node.identifier) {
					keys.push(node.id);
				}
				if (node.children) {
					traverse(node.children);
				}
			}
		};
		traverse(data);
		return keys;
	};

	// 初始化时查询菜单树
	useEffect(() => {
		getMenuTreeData();
	}, []);

	// 获取角色已绑定的菜单权限
	useEffect(() => {
		setCheckedKeys(roleData?.map((item) => item.menuId));
	}, [roleData]);

	const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
	const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
	const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
	const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

	// 全选状态
	const [checkAll, setCheckAll] = useState(false);
	// 全部展开状态
	const [expandAll, setExpandAll] = useState(false);

	// 监听选中状态变化
	useEffect(() => {
		setCheckAll(checkedKeys.length === allKeys.length);
	}, [checkedKeys, allKeys]);

	// 监听展开状态变化
	useEffect(() => {
		setExpandAll(expandedKeys.length === allKeys.length);
	}, [expandedKeys, allKeys]);

	const onExpand: TreeProps["onExpand"] = (expandedKeysValue) => {
		setExpandedKeys(expandedKeysValue);
		setAutoExpandParent(false);
	};

	const onCheck: TreeProps["onCheck"] = (checkedKeysValue) => {
		setCheckedKeys(checkedKeysValue as React.Key[]);
	};

	const onSelect: TreeProps["onSelect"] = (selectedKeysValue) => {
		setSelectedKeys(selectedKeysValue);
	};

	// 全选/全不选处理
	const handleCheckAllChange = (e: any) => {
		setCheckedKeys(e.target.checked ? allKeys : []);
	};

	// 全部展开/收起处理
	const handleExpandAllChange = (e: any) => {
		setExpandedKeys(e.target.checked ? allKeys : []);
		setAutoExpandParent(true);
	};

	// 提交角色菜单权限
	const submitRoleMenu = () => {
		if (Array.isArray(checkedKeys)) {
			onSubmit(checkedKeys);
		} else {
			onSubmit((checkedKeys as any).checked);
		}
	};

	return (
		<div className={cn("shrink-0 transition-all duration-300 overflow-hidden", menuModalOpen ? "w-[25%]" : "w-0")}>
			<Card
				title={`菜单权限(${menuData?.name})`}
				className="h-[98%] w-full"
				extra={
					<Space className="cursor-pointer">
						<Iconify
							icon="material-symbols:close"
							className="text-xl text-primary "
							onClick={() => setMenuModalOpen(false)}
						/>
						<Iconify
							icon="material-symbols:check"
							className="text-xl text-primary"
							onClick={() => {
								submitRoleMenu();
							}}
						/>
					</Space>
				}
			>
				<div className="flex flex-col gap-4">
					{/* 控制区域 */}
					<div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2 pb-2 border-b border-gray-100">
						<Checkbox checked={checkAll} onChange={handleCheckAllChange}>
							全选/全不选
						</Checkbox>
						<Checkbox checked={expandAll} onChange={handleExpandAllChange}>
							全部展开/收起
						</Checkbox>
					</div>

					{/* 树控件 - 设置最大高度和滚动 */}
					<div className="overflow-auto max-h-[calc(100vh-280px)]">
						<Tree
							checkable
							onExpand={onExpand}
							expandedKeys={expandedKeys}
							autoExpandParent={autoExpandParent}
							onCheck={onCheck}
							checkedKeys={checkedKeys}
							onSelect={onSelect}
							selectedKeys={selectedKeys}
							checkStrictly
							fieldNames={{
								key: "id",
								title: "name",
								children: "children",
							}}
							treeData={treeData as DataNode[]}
						/>
					</div>
				</div>
			</Card>
		</div>
	);
}
