import { http } from '@/utils/http';

export interface loginReqType {
  account: string;
  password: string;
}
export interface loginResType {
  access_token: string;
}
export const login = (data: loginReqType) => {
  return http.post<loginResType>('/login', data);
};
