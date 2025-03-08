import type { RouteObject } from "react-router-dom";

// 匹配路由函数，类似 react-router v5 的 matchRoutes
export function matchRoutes(routes: RouteObject[], pathname: string): Array<{ route: any; match: any }> | null {
	const matchedRoutes: Array<{ route: any; match: any }> = [];

	function matchRoute(routes: RouteObject[], path: string, parentPath = "") {
		for (const route of routes) {
			// 构建完整路径
			const fullPath = parentPath + (route.path || "");

			// 调试每个路由匹配尝试

			const isExactMatch = path === fullPath;
			const isPathMatch =
				path.startsWith(fullPath) && (fullPath.endsWith("/") || path.substring(fullPath.length, 1) === "/");

			if (isExactMatch || isPathMatch) {
				matchedRoutes.push({
					route,
					match: {
						path: route.path,
						url: fullPath,
						isExact: isExactMatch,
						params: {},
					},
				});

				// 递归检查子路由
				if (route.children) {
					matchRoute(route.children, path, fullPath);
				}
			}
		}
	}

	matchRoute(routes, pathname);
	return matchedRoutes.length > 0 ? matchedRoutes : null;
}
