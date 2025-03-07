import { useState, useEffect, useCallback, useRef } from 'react';
import type { TableColumnType } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

export interface ColumnItem {
  key: string;
  title: string;
  visible: boolean;
  fixed?: boolean | 'left' | 'right'; // 列固定状态：左侧、右侧或不固定
  disabled?: boolean; // 不允许隐藏的列
  order?: number; // 用于排序
}

/**
 * 表格列配置钩子
 * @param tableKey 表格唯一标识，用于内部状态管理
 * @param initialColumns 初始列配置
 * @returns 表格列相关的状态与方法
 */
export function useTableColumns(tableKey: string, initialColumns: ColumnItem[] = []) {
  // 使用ref跟踪初始列配置的变化，防止无限循环
  const initialColumnsRef = useRef<ColumnItem[]>([]);

  // 状态初始化时设置为初始列配置
  const [columnsState, setColumnsState] = useState<ColumnItem[]>(initialColumns);

  // 只在初次渲染或tableKey/initialColumns变化时更新列设置
  useEffect(() => {
    // 检查初始列是否变化
    const columnsChanged = initialColumnsRef.current.length !== initialColumns.length || JSON.stringify(initialColumnsRef.current) !== JSON.stringify(initialColumns);

    if (columnsChanged) {
      // 确保列有order属性，用于排序
      const columnsWithOrder = initialColumns.map((col, index) => ({
        ...col,
        order: col.order ?? index,
      }));
      initialColumnsRef.current = [...columnsWithOrder];
      setColumnsState(columnsWithOrder);
    }
  }, [tableKey, initialColumns]);

  // 处理列显示状态变更
  const handleColumnChange = useCallback(
    (e: CheckboxChangeEvent, index: number) => {
      const newColumns = [...columnsState];
      newColumns[index].visible = e.target.checked;
      setColumnsState(newColumns);
      return newColumns;
    },
    [columnsState],
  );

  // 全选/全不选
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      const newColumns = columnsState.map((col) => {
        if (col.disabled) return col;
        return { ...col, visible: checked };
      });
      setColumnsState(newColumns);
      return newColumns;
    },
    [columnsState],
  );

  // 处理列固定状态变更
  const handleFixedChange = useCallback(
    (index: number) => {
      const newColumns = [...columnsState];
      const currentFixed = newColumns[index].fixed;

      // 循环切换: 无固定 -> 左固定 -> 右固定 -> 无固定
      if (!currentFixed) {
        newColumns[index].fixed = 'left';
      } else if (currentFixed === 'left') {
        newColumns[index].fixed = 'right';
      } else {
        newColumns[index].fixed = undefined;
      }

      setColumnsState(newColumns);
      return newColumns;
    },
    [columnsState],
  );

  // 处理列排序
  const handleDragSort = useCallback(
    (dragIndex: number, dropIndex: number) => {
      if (dragIndex === dropIndex) return columnsState;

      const newColumns = [...columnsState];
      const draggedItem = newColumns[dragIndex];

      // 删除拖拽的项
      newColumns.splice(dragIndex, 1);
      // 插入到新位置
      newColumns.splice(dropIndex, 0, draggedItem);

      // 更新顺序属性
      const columnsWithOrder = newColumns.map((col, index) => ({
        ...col,
        order: index,
      }));

      setColumnsState(columnsWithOrder);
      return columnsWithOrder;
    },
    [columnsState],
  );

  // 重置为默认配置
  const handleReset = useCallback(() => {
    // 深拷贝初始配置，保留原始顺序
    const defaultColumns = initialColumnsRef.current.map((col, index) => ({
      ...col,
      visible: true, // 重置为可见
      fixed: (col.key === 'operation' ? 'right' : undefined) as boolean | 'left' | 'right' | undefined,
      order: index, // 重置为初始顺序
    }));

    // 按初始顺序排序
    const sortedColumns = [...defaultColumns].sort((a, b) => (a.order || 0) - (b.order || 0));

    // 更新状态
    setColumnsState(sortedColumns);
    return sortedColumns;
  }, []);

  // 检查全选状态
  const getSelectAllStatus = useCallback(() => {
    const allChecked = columnsState.every((col) => col.disabled || col.visible);
    const indeterminate = !allChecked && columnsState.some((col) => col.visible);

    return { allChecked, indeterminate };
  }, [columnsState]);

  // 辅助函数：从antd Table列定义转换为ColumnItem
  const convertColumnsToItems = useCallback((columns: TableColumnType<any>[]): ColumnItem[] => {
    return columns.map((col, index) => ({
      key: col.key?.toString() || col.dataIndex?.toString() || '',
      title: typeof col.title === 'string' ? col.title : '未命名列',
      visible: true,
      fixed: col.fixed,
      disabled: col.key === 'operation', // 默认操作列不允许隐藏
      order: index,
    }));
  }, []);

  return {
    columnsState,
    setColumnsState,
    handleColumnChange,
    handleSelectAll,
    handleFixedChange,
    handleDragSort,
    handleReset,
    getSelectAllStatus,
    convertColumnsToItems,
  };
}
