import { http } from "@/utils/http";
import type { PageResponse } from "@/types/baseType/response";
import type { PaginationDto } from "@/types/baseType/pagination";

// 模型接口
export interface Model {
	id: string;
	name: string;
	description: string;
	modelKey: string;
	groupId: string;
	groupName?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

// 模型列表请求参数
export interface ModelListRequest extends PaginationDto {
	name?: string;
	groupId?: string;
	isActive?: boolean;
}

// 新增模型参数
export interface CreateModelParams {
	name: string;
	description: string;
	modelKey: string;
	groupId: string;
	isActive: boolean;
}

// 更新模型参数
export interface UpdateModelParams {
	id: string;
	name: string;
	description: string;
	modelKey: string;
	groupId: string;
	isActive: boolean;
}

// 删除模型参数
export interface DeleteModelParams {
	id: string;
}

// 获取模型列表
export const getModelList = (params: ModelListRequest) => {
	return http.post<PageResponse<Model>>("/model-config/model/list", params);
};

// 获取所有激活的模型
export const getAllActiveModels = () => {
	return http.post<Model[]>("/model-config/model/all");
};

// 获取模型详情
export const getModelDetail = (id: string) => {
	return http.post("/model-config/model/detail", { id });
};

// 新增模型
export const createModel = (params: CreateModelParams) => {
	return http.post("/model-config/model/create", params);
};

// 更新模型
export const updateModel = (params: UpdateModelParams) => {
	return http.post("/model-config/model/update", params);
};

// 删除模型
export const deleteModel = (params: DeleteModelParams) => {
	return http.post("/model-config/model/delete", params);
};

// 根据分组ID获取模型列表
export const getModelsByGroupId = (groupId: string) => {
	return http.post<Model[]>("/model-config/model/by-group", { groupId });
};

//同步模型
export const syncApiModel = () => {
	return http.post("/model-config/model/syncApiModel");
};