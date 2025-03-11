import Axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type InternalAxiosRequestConfig,
	type AxiosResponse,
} from "axios";
import type { RequestMethods, PureHttpError, PureHttpRequestConfig, CustomConfig } from "@/types/http/types";
import type { BaseResponse } from "@/types/baseType/response";
import NProgress from "./nprogress";
import { getToken } from "@/utils/auth";
import { message } from "antd";
const baseURL = import.meta.env.VITE_API_BASE_URL;
const whiteList = ["/refreshToken", "/login"];
const timeout = 30000;
const defaultConfig: AxiosRequestConfig = {
	timeout,
	headers: {
		"Content-Type": "application/x-www-form-urlencoded",
	},
	baseURL,
};

class PureHttp {
	private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

	constructor() {
		this.httpInterceptorsRequest();
		this.httpInterceptorsResponse();
	}

	/**
	 * 请求拦截器
	 */
	private httpInterceptorsRequest(): void {
		PureHttp.axiosInstance.interceptors.request.use(
			async (config: InternalAxiosRequestConfig) => {
				// 将 config 转换为包含自定义属性的类型
				const customConfig = config as CustomConfig;
				if (customConfig.isShowNProgress !== false) {
					NProgress.start();
				}
				//如果不使用后缀地址则跳过，否则拼接后缀地址
				if (!customConfig.isNotUseSuffixUrl) {
					customConfig.baseURL = customConfig.baseURL + import.meta.env.VITE_API_Suffix_URL;
				}
				// 如果请求 URL 包含白名单中的任一字符串，直接返回配置
				if (customConfig.url && whiteList.some((v) => (customConfig.url as string).includes(v))) {
					return customConfig;
				}
				// 如果没有 token，则跳转到登录页面
				return new Promise((resolve) => {
					const accessToken = getToken();
					if (accessToken) {
						config.headers = config.headers || {};
						config.headers.Authorization = `Bearer ${accessToken}`;
						resolve(config);
					} else {
						window.location.href = "/login";
					}
				});
			},
			(error) => Promise.reject(error),
		);
	}

	/**
	 * 响应拦截器
	 */
	private httpInterceptorsResponse(): void {
		PureHttp.axiosInstance.interceptors.response.use(
			(response: AxiosResponse<any, PureHttpRequestConfig>) => {
				NProgress.done();

				// 如果返回的 code 为 403，则跳转到登录页面
				if (response.status === 403 || response.status === 401) {
					window.location.href = "/login";
				}
				// 返回响应数据中的 data 部分（根据实际业务可以调整返回值）
				return response.data;
			},
			(error: PureHttpError) => {
				NProgress.done();
				const status = error.response?.status;
				// 定义状态码对应的提示信息
				const messageMap: { [key: number | string]: string } = {
					401: "请先登录",
					403: "拒绝访问",
					404: "请求地址错误",
					500: "服务器错误",
					default: "网络错误",
				};

				// 默认使用状态码对应的提示信息
				let errMsg = messageMap[status || "default"] || messageMap.default;
				// 如果响应中存在自定义的错误提示，则使用该提示
				if (error.response?.data && (error.response.data as any).message) {
					errMsg = (error.response.data as any).message;
				}
				// 根据配置决定是否展示 antd 的错误提示，默认展示
				const config = error.config as PureHttpRequestConfig;
				if (!config || config.isShowMessage !== false) {
					message.error(errMsg);
				}
				if (status === 401) {
					window.localStorage.clear();
					window.location.href = "/login";
				}
				return Promise.reject(error);
			},
		);
	}

	/**
	 * 通用请求方法
	 * @param method 请求方法
	 * @param url 请求 URL
	 * @param config 请求配置
	 * @returns Promise<T>
	 */
	public request<T>(method: RequestMethods, url: string, config?: PureHttpRequestConfig): Promise<BaseResponse<T>> {
		return new Promise((resolve, reject) => {
			PureHttp.axiosInstance
				.request({ method, url, ...config })
				.then((response: any) => resolve(response))
				.catch((error) => reject(error));
		});
	}

	/**
	 * GET 请求
	 * @param url 请求 URL
	 * @param params URL 参数
	 * @param config 请求配置
	 * @returns Promise<T>
	 */
	public get<T>(url: string, params?: object, config?: PureHttpRequestConfig): Promise<BaseResponse<T>> {
		return this.request<T>("get", url, { ...config, params });
	}

	/**
	 * POST 请求
	 * @param url 请求 URL
	 * @param params 请求体数据
	 * @param config 请求配置
	 * @returns Promise<T>
	 */
	public post<T>(url: string, params?: object, config?: PureHttpRequestConfig): Promise<BaseResponse<T>> {
		return this.request<T>("post", url, { ...config, data: params });
	}
}

export const http = new PureHttp();
