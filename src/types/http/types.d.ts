import type { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

export interface MenuItem {
  path: string;
  component: string;
  authPermissions: string[];
}

// HTTP 请求方法枚举
export type RequestMethods = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'option' | 'head';

// 扩展 AxiosRequestConfig 类型
export interface PureHttpRequestConfig extends AxiosRequestConfig {
  isShowNProgress?: boolean; // 是否显示进度条
  isShowMessage?: boolean; // 是否显示消息提示
  isNotUseSuffixUrl?: boolean; // 是否不使用后缀地址
}

// 自定义配置类型
export interface CustomConfig extends InternalAxiosRequestConfig {
  isShowNProgress?: boolean;
  isShowMessage?: boolean;
  isNotUseSuffixUrl?: boolean;
  url?: string;
}

// HTTP 错误类型
export interface PureHttpError extends AxiosError {
  config: PureHttpRequestConfig;
}

// HTTP 响应类型
export interface PureHttpResponse extends AxiosResponse {
  config: PureHttpRequestConfig;
}
