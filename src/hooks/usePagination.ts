import { useState, useCallback } from "react";
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
	handleSearch: () => void;
	// 处理重置的函数
	handleReset: () => void;
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

	// 合并分页参数和查询参数
	const params = {
		page: pagination.current,
		pageSize: pagination.pageSize,
		...searchParams,
	} as T;

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

	// 处理搜索
	const handleSearch = useCallback(() => {
		if (form) {
			const values = form.getFieldsValue();
			setSearchParams(values as Omit<T, "page" | "pageSize">);
			// 搜索时回到第一页
			setPagination((prev) => ({
				...prev,
				current: 1,
			}));
		}
	}, [form]);

	// 处理重置
	const handleReset = useCallback(() => {
		if (form) {
			form.resetFields();
			setSearchParams({} as Omit<T, "page" | "pageSize">);
			// 重置时回到第一页
			setPagination((prev) => ({
				...prev,
				current: 1,
			}));
		}
	}, [form]);

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
