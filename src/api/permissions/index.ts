import { http } from "@/utils/http";
import type { UserInfo } from "@/types/user";

// 获取路由列表接口
export const getPermissions = () => {
	return http.post<UserInfo>("/permissions/role");
};

//根据类型查询权限列表
export interface PermissionList {
	identifier: string;
	name: string;
	type: "menu" | "api" | "action";
}
export const getPermissionsByType = (type?: "menu" | "api" | "action") => {
	return http.post<PermissionList[]>("/permissions/selectAll", { type });
};
