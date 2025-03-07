import { http } from '@/utils/http';

// 定义路由数据结构
export interface IRouterApi {
  path: string;
  redirect?: string;
  component?: string;
  meta?: {
    title?: string;
    key?: string;
    icon?: string;
    hidden?: boolean;
    single?: boolean;
  };
  children?: IRouterApi[];
}

// 获取路由列表接口
export const fetchRouterList = () => {
  return http.get<IRouterApi[]>('/router/list');
};
