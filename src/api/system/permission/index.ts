import { http } from "@/utils/http";
import type { PaginationDto } from "@/types/baseType/pagination";
import type { PageResponse } from "@/types/baseType/response";

export type PermissionType = "menu" | "api" | "action";
export interface PermissionListRequest extends PaginationDto {
	name?: string;
	type?: PermissionType;
	identifier?: string;
}

export interface PermissionListResponse {
	id: string;
	name: string;
	type: PermissionType;
	identifier: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export const getPermissionList = (params: PermissionListRequest) => {
	return http.post<PageResponse<PermissionListResponse>>("/permissions/list", params);
};

// 新增权限
export interface PermissionRequest {
	id?: string;
	name: string;
	type: PermissionType;
	identifier: string;
	description?: string;
}

export const addPermission = (params: PermissionRequest) => {
	return http.post<boolean>("/permissions/create", params);
};

export const updatePermission = (params: PermissionRequest) => {
	return http.post<boolean>("/permissions/update", params);
};
