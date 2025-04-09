import { http } from "@/utils/http";
import type { MenuType } from "@/types/enum/router";

export interface MenuListResponse {
	id: string;
	name: string;
	path: string;
	icon?: string;
	parentId?: string;
	orderNum?: number;
	type: MenuType;
	component: string;
	inAnimation?: string;
	outAnimation?: string;
	children?: MenuListResponse[];
	identifier?: string;
}

export const getMenus = () => {
	return http.post<MenuListResponse[]>("/menu/list", {});
};

export interface MenuAddRequest {
	name: string;
	path: string;
	icon?: string;
	parentId?: string;
	orderNum?: number;
	type: MenuType;
	component?: string;
	inAnimation?: string;
	outAnimation?: string;
	identifier?: string;
}

export const addMenu = (params: MenuAddRequest) => {
	return http.post("/menu/add", params);
};

export interface MenuUpdateRequest extends MenuAddRequest {
	id: string;
}

export const updateMenu = (params: MenuUpdateRequest) => {
	return http.post("/menu/update", params);
};

export const deleteMenu = (id: string) => {
	return http.post("/menu/delete", { id });
};
