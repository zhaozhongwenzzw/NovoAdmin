export interface DataInfo<T> {
  /** token */
  token: string;
  /** `token`的过期时间（时间戳） */
  expires: T;
  /** 用于调用刷新token的接口时所需的token */
  refreshToken: string;
  /** 用户名 */
  username?: string;
  /** 当前登陆用户的角色 */
  roles?: Array<string>;
}

export const sessionKey = 'user-info';
export const TokenKey = 'authorized-token';

/** 获取`token` */
export function getToken(): string | null {
  try {
    const userStore = window.localStorage.getItem('userStore');
    if (userStore) {
      const userStoreData = JSON.parse(userStore);
      return userStoreData.state.userToken || null;
    }
    return null;
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
}

export function setToken(token: string): void {
  window.localStorage.setItem('token', token);
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return 'Bearer ' + token;
};
