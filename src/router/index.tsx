import DashboardLayout from "@/layouts";
import PageError from "@/pages/error/PageError";
import Login from "@/pages/Login";
import ProtectedRoute from "@/router/components/protected-route";
import { usePermissionRoutes } from "@/router/hooks";
import { ERROR_ROUTE } from "@/router/components/error-routes";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate, type RouteObject, createHashRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import type { AppRouteObject } from "@/types/enum/router";
import { useUserPermissions } from "@/store/userStore";
import { Spin } from "antd";
import React from "react";

const { VITE_APP_HOMEPAGE: HOMEPAGE = "/home" } = import.meta.env;

// 智能重定向组件 - 等待权限加载完成
const SmartRedirect = () => {
	const permissions = useUserPermissions();
	const [waitingCount, setWaitingCount] = React.useState(0);

	React.useEffect(() => {
		// 如果5秒内仍未加载，使用默认路径
		const timer = setTimeout(() => {
			setWaitingCount((prev) => prev + 1);
		}, 1000);
		return () => clearTimeout(timer);
	}, [waitingCount]);

	// 如果权限已加载或等待太久，执行重定向
	if (permissions?.length || waitingCount > 5) {
		return <Navigate to={HOMEPAGE} replace />;
	}

	// 等待权限加载的loading状态
	return (
		<div className="flex h-full flex-col items-center justify-center gap-2">
			<Spin size="large" />
			<div className="text-primary">正在加载权限页面...</div>
		</div>
	);
};

const PUBLIC_ROUTE: AppRouteObject = {
	path: "/login",
	element: (
		<ErrorBoundary FallbackComponent={PageError}>
			<Login />
		</ErrorBoundary>
	),
};

const NO_MATCHED_ROUTE: AppRouteObject = {
	path: "*",
	element: <Navigate to="/404" replace />,
};

export default function Router() {
	const permissionRoutes = usePermissionRoutes();
	const PROTECTED_ROUTE: AppRouteObject = {
		path: "/",
		element: (
			<ProtectedRoute>
				<DashboardLayout />
			</ProtectedRoute>
		),
		children: [
			// 使用SmartRedirect替代立即重定向
			{ index: true, element: <SmartRedirect /> },
			...permissionRoutes,
		],
	};

	const routes = [PUBLIC_ROUTE, PROTECTED_ROUTE, NO_MATCHED_ROUTE, ERROR_ROUTE] as RouteObject[];

	const router = createHashRouter(routes);

	return <RouterProvider router={router} />;
}
