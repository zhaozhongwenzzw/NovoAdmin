import { useState, useCallback, useMemo } from "react";
import type { TablePaginationConfig } from "antd";
import type { FormInstance } from "antd/lib/form";

interface PaginationState {
	current: number;
	pageSize: number;
	total?: number;
}

// 所有查询都需要包含的基础分页参数
interface PaginationParams {
	page: number;
	pageSize: number;
}

interface UsePaginationOptions {
	form?: FormInstance;
	defaultPageSize?: number;
	defaultCurrent?: number;
}

// 使用泛型T扩展查询参数接口
interface UsePaginationResult<T extends PaginationParams> {
	// 分页状态
	pagination: PaginationState;
	// 合并后的查询参数，类型为T
	params: T;
	// 处理分页变化的函数
	handlePaginationChange: (pagination: TablePaginationConfig) => void;
	// 处理搜索的函数
	handleSearch: () => T;
	// 处理重置的函数
	handleReset: () => T;
	// 设置总数的函数
	setTotal: (total: number) => void;
	// 刷新当前页面
	refresh: () => void;
}

/**
 * 分页逻辑钩子
 * @param options 配置选项
 * @returns 分页相关的状态和方法
 */
export const usePagination = <T extends PaginationParams>(
	options: UsePaginationOptions = {},
): UsePaginationResult<T> => {
	const { form, defaultPageSize = 15, defaultCurrent = 1 } = options;

	// 分页状态
	const [pagination, setPagination] = useState<PaginationState>({
		current: defaultCurrent,
		pageSize: defaultPageSize,
	});

	// 查询参数（不包含分页）
	const [searchParams, setSearchParams] = useState<Omit<T, "page" | "pageSize">>({} as Omit<T, "page" | "pageSize">);

	// 构建查询参数的函数
	const buildParams = (values: Omit<T, "page" | "pageSize">, page: number, pageSize: number): T =>
		({
			page,
			pageSize,
			...values,
		}) as T;

	// 使用useMemo计算当前params
	const params = useMemo(
		() => buildParams(searchParams, pagination.current, pagination.pageSize),
		[searchParams, pagination.current, pagination.pageSize],
	);

	// 处理分页变化
	const handlePaginationChange = useCallback(
		(newPagination: TablePaginationConfig) => {
			const { current, pageSize } = newPagination;
			setPagination((prev) => ({
				...prev,
				current: current || defaultCurrent,
				pageSize: pageSize || defaultPageSize,
			}));
		},
		[defaultCurrent, defaultPageSize],
	);

	// 处理搜索 - 返回最新参数
	const handleSearch = useCallback(() => {
		if (form) {
			// 获取最新表单值
			const values = form.getFieldsValue() as Omit<T, "page" | "pageSize">;

			// 构建最新参数
			const newParams = buildParams(values, 1, pagination.pageSize);

			// 异步更新状态
			setSearchParams(values);
			setPagination((prev) => ({ ...prev, current: 1 }));

			// 立即返回最新参数
			return newParams;
		}
		return params;
	}, [form, pagination.pageSize]);

	// 处理重置 - 返回最新参数
	const handleReset = useCallback(() => {
		if (form) {
			// 重置表单
			form.resetFields();

			// 构建重置后的参数
			const newParams = buildParams({} as Omit<T, "page" | "pageSize">, 1, pagination.pageSize);

			// 异步更新状态
			setSearchParams({} as Omit<T, "page" | "pageSize">);
			setPagination((prev) => ({ ...prev, current: 1 }));

			// 立即返回重置后的参数
			return newParams;
		}
		return params;
	}, [form, pagination.pageSize]);

	// 设置总数
	const setTotal = useCallback((total: number) => {
		setPagination((prev) => ({
			...prev,
			total,
		}));
	}, []);

	// 刷新当前页面
	const refresh = useCallback(() => {
		setPagination((prev) => ({ ...prev }));
	}, []);

	return {
		pagination,
		params,
		handlePaginationChange,
		handleSearch,
		handleReset,
		setTotal,
		refresh,
	};
};
