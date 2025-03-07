import { http } from '@/utils/http';
import { PageResponse } from '@/types/baseType/response';
import { PaginationDto } from '@/types/baseType/pagination';

export enum UserStatus {
  NORMAL = 1,
  DISABLE = 2,
}
export interface UserListResponse {
  id: string;
  account: string;
  username: string;
  phone: string;
  remark: string;
  status: UserStatus;
  loginCount: number;
  statusStr: string;
}

export interface AddUserParams {
  account: string;
  username: string;
  phone: string;
  remark?: string;
  password: string;
}

export const getUserList = (params: any) => {
  return http.post<PageResponse<UserListResponse>>('/user/list', params);
};

export const addUser = (params: AddUserParams) => {
  return http.post('/user/add', params);
};

export interface UpdateUserParams {
  id: string;
  username?: string;
  phone?: string;
  remark?: string;
  status?: UserStatus;
}
export const updateUser = (params: UpdateUserParams) => {
  return http.post('/user/update', params);
};

// 查询用户列表参数
export interface QueryUserParams extends PaginationDto {
  searchTerm?: string;
  status?: number;
  // 其他查询参数...
}

export const deleteUser = (params: UpdateUserParams) => {
  return http.post('/user/delete', params);
};
