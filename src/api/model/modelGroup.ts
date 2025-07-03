import { http } from "@/utils/http";
import type { PageResponse } from "@/types/baseType/response";
import type { PaginationDto } from "@/types/baseType/pagination";

// 模型分组接口
export interface ModelGroups {
	id: string;
	name: string;
	description: string;
	baseUrl: string;
	apiKey: string;
	options: string;
	createdAt: string;
}

// 模型分组列表请求参数
export interface ModelGroupListRequest extends PaginationDto {
	name?: string;
}

// 新增模型分组参数
export interface AddModelGroupParams {
	name: string;
	baseUrl: string;
	apiKey: string;
	description: string;
}

// 更新模型分组参数
export interface UpdateModelGroupParams {
	id: string;
	name: string;
	baseUrl: string;
	apiKey: string;
	description: string;
}

// 删除模型分组参数
export interface DeleteModelGroupParams {
	id: string;
}

export interface SyncModelParams {
	groupId: string;
}

// 获取模型分组列表
export const getModelGroupList = (params: ModelGroupListRequest) => {
	return http.post<PageResponse<ModelGroups>>("/model-groups/list", params);
};

// 新增模型分组
export const addModelGroup = (params: AddModelGroupParams) => {
	return http.post("/model-groups/add", params);
};

// 更新模型分组
export const updateModelGroup = (params: UpdateModelGroupParams) => {
	return http.post("/model-groups/update", params);
};

// 删除模型分组
export const deleteModelGroup = (params: DeleteModelGroupParams) => {
	return http.post("/model-groups/delete", params);
};

// 同步模型分组
export const syncModel = (params: SyncModelParams) => {
	return http.post("/model-config/model/syncApiModel", params);
};

// 获取所有模型分组
export const getAllModelGroups = () => {
	return http.post<ModelGroups[]>("/model-groups/all");
};
