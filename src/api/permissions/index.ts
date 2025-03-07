import { http } from '@/utils/http';
import { UserInfo } from '@/types/user';

// 获取路由列表接口
export const getPermissions = () => {
  return http.post<UserInfo>('/permissions/role');
};
