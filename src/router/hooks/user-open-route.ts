// 获取当前打开路由的路径(包括父级)
import { useLocation } from "react-router-dom";
import { useFlattenMenus } from "./user-permission-route";
import type { Permission } from "@/types/user";
import { useMemo } from "react";

export const useOpenRoutePath = () => {
	const flattenMenus = useFlattenMenus();
	const location = useLocation();

	// 使用 useMemo 缓存结果，并在 location.pathname 变化时重新计算
	const openRoutePath = useMemo(() => {
		const result: Permission[] = [];

		// 当前打开的路由
		const activePath = flattenMenus.find((item) => item.path === location.pathname);

		// 如果找到当前路由，添加到路径中并开始查找父级
		if (activePath) {
			// 首先添加当前活动路由
			result.push({
				id: activePath.id,
				parentId: activePath.parentId,
				name: activePath.name,
				label: activePath.label,
				path: activePath.path,
				children: activePath.children,
				type: activePath.type,
			});

			// 然后递归查找所有父级路由
			findPidPath(activePath.parentId);
		}

		// 递归查找父级路由并添加到路径数组
		function findPidPath(parentId: string | undefined) {
			if (!parentId) {
				return;
			}

			const parentMenu = flattenMenus.find((item) => item.id === parentId);
			if (parentMenu) {
				// 在数组前面插入父级路由，这样路径顺序是从根到叶
				result.unshift({
					id: parentMenu.id,
					parentId: parentMenu.parentId,
					name: parentMenu.name,
					label: parentMenu.label,
					path: parentMenu.path,
					children: parentMenu.children,
					type: parentMenu.type,
				});

				// 继续向上查找更高级的父级路由
				findPidPath(parentMenu.parentId);
			}
		}

		return result;
	}, [flattenMenus, location.pathname]); // 依赖项包括 flattenMenus 和 pathname

	return openRoutePath;
};
