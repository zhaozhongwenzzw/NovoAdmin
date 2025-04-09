import { useState, useEffect } from "react";
import type { BaseResponse } from "@/types/baseType/response";
/**
 * 枚举钩子返回值接口
 */
interface UseEnumResult<T> {
	data: T[]; // 枚举数据列表
	error: Error | null; // 错误信息
	refresh: () => void; // 手动刷新方法
}

/**
 * 获取枚举列表的自定义钩子
 * @param fetchFn 获取枚举的API函数
 * @param deps 可选的依赖数组，当依赖变化时重新获取数据
 * @returns 包含枚举数据、加载状态和错误信息的对象
 */
export const useEnum = <T>(fetchFn: () => Promise<BaseResponse<T[]>>, deps: any[] = []): UseEnumResult<T> => {
	// 内部状态管理
	const [data, setData] = useState<T[]>([]);
	const [error, setError] = useState<Error | null>(null);

	// 获取数据的函数
	const fetchData = async () => {
		setError(null);
		try {
			const result = await fetchFn();
			if (result.code === 200) {
				setData(result.data);
			} else {
				setError(new Error(result.message));
			}
		} catch (err) {
			setError(err instanceof Error ? err : new Error("获取枚举数据失败"));
			console.error("获取枚举数据出错:", err);
		}
	};

	// 监听依赖变化，重新获取数据
	useEffect(() => {
		fetchData();
	}, deps); // 依赖数组

	// 暴露手动刷新方法
	const refresh = () => {
		fetchData();
	};

	return { data, error, refresh };
};
