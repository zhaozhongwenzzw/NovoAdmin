import { http } from '@/utils/http';
import { PageResponse } from '@/types/baseType/response';
import { PaginationDto } from '@/types/baseType/pagination';

// 角色列表返回类型
export interface RoleListResponse {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 创建角色参数
export interface CreateRoleDto {
  // 角色名称（必填）
  name: string;
  // 角色描述（可选）
  description?: string;
}

// 查询角色列表参数
export interface QueryRoleDto extends PaginationDto {
  // 角色名称（可选）
  name?: string;
}

// 更新角色参数
export interface UpdateRoleDto {
  // 角色ID（必填）
  id: string;
  // 角色名称（可选）
  name?: string;
  // 角色描述（可选）
  description?: string;
}

// 删除角色参数
export interface DeleteRoleDto {
  // 角色ID（必填）
  id: string;
}

// 创建角色
export const createRole = (params: CreateRoleDto) => {
  return http.post<boolean>('/roles/create', params);
};

// 获取角色列表
export const getRoleList = (params: QueryRoleDto) => {
  return http.post<PageResponse<RoleListResponse>>('/roles/list', params);
};

// 获取角色详情
export const getRoleDetail = (id: string) => {
  return http.post<RoleListResponse>(`/roles/detail/${id}`, {});
};

// 更新角色
export const updateRole = (params: UpdateRoleDto) => {
  return http.post<boolean>('/roles/update', params);
};

// 删除角色
export const deleteRole = (params: DeleteRoleDto) => {
  return http.post<boolean>('/roles/delete', params);
};
