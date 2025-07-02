import { Suspense, useMemo } from "react";
import { useUserPermissions } from "@/store/userStore";
import type { Permission } from "@/types/user";
import { MenuType, type AppRouteObject } from "@/types/enum/router";
import { lazy } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/animate/components/page-transition";
import AnimatedTitleFM from "@/components/animate/components/AnimatedTitleFM";

const ENTRY_PATH = "/src/pages";
const PAGES = import.meta.glob("@/pages/**/*.tsx");
const loadComponentFromPath = (path: string) => PAGES[`${ENTRY_PATH}${path}.tsx`];
// 将 Permission 转换为 AppRouteObject
function formatPermissionToRoute(permission: Permission): AppRouteObject {
	const route: AppRouteObject = {
		path: permission.path,
	};

	// 为懒加载组件提供一个统一的 Suspense 包裹
	const suspenseWrapper = (children: React.ReactNode) => (
		<Suspense fallback={<div className="flex justify-center items-center h-screen">
			<AnimatedTitleFM text="页面加载中..." />
		</div>}>
			<AnimatePresence mode="wait">
				<PageTransition key={permission.path}>
					{children}
				</PageTransition>
			</AnimatePresence>
		</Suspense>
	);

	if (permission.type === MenuType.DIRECTORY && permission.children?.length) {
		// 目录本身也可能需要 Suspense，因为它渲染的 Outlet 最终会是懒加载的子页面
		route.element = suspenseWrapper(<Outlet key={permission.path} />);
	} else if (permission.component || permission.path) {
		const Element = lazy(loadComponentFromPath(permission.component || permission.path) as any);
		route.element = suspenseWrapper(<Element key={permission.path} />);
	}
	// 如果有子权限，递归转换
	if (permission.children?.length) {
		route.children = permission.children.map(formatPermissionToRoute);
	}

	return route;
}

export function usePermissionRoutes() {
	const permissions = useUserPermissions();

	return useMemo(() => {
		if (!permissions?.length) return [];
		return permissions.map(formatPermissionToRoute);
	}, [permissions]);
}

/**
 * 将树形菜单扁平化为一维数组
 * @param menus 树形菜单数组
 * @param parentPath 父级路径
 * @returns 扁平化后的菜单数组
 */
function flattenMenus(menus: Permission[]): Permission[] {
	return menus.reduce<Permission[]>((acc, menu) => {
		acc.push(menu);
		// 如果有子菜单，递归处理
		if (menu.children?.length) {
			acc.push(...flattenMenus(menu.children));
		}

		return acc;
	}, []);
}

/**
 * 扁平化菜单 Hook
 * @returns 扁平化后的菜单数组
 */
export function useFlattenMenus() {
	const permissions = useUserPermissions();
	return useMemo(() => {
		if (!permissions?.length) return [];
		return flattenMenus(permissions);
	}, [permissions]);
}
