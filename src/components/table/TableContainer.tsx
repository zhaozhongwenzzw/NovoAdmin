import React, { useRef, useEffect, useState, useMemo, ReactNode } from 'react';
import { CardProps, TableProps, TablePaginationConfig } from 'antd';
import Table from '@/components/table/CustomTable';
import TableSettings, { ColumnItem, useTableColumns, RowAlign, TableSize } from './TableSettings';
import styled from 'styled-components';
import useTableAlign from './hooks/useTableAlign';
import useTableDensity from './hooks/useTableDensity';

// 定义自定义Card组件，确保它是一个flex容器并占据全高
const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  height: 100%;
  overflow: hidden;
`;

const TableContainerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;

  .title {
    font-size: 16px;
    font-weight: 600;
  }

  .header-left {
    display: flex;
    align-items: center;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  @media (prefers-color-scheme: dark) {
    .title {
      color: rgba(255, 255, 255, 0.85);
    }
  }
`;

// 创建一个接收align参数的表格容器样式
const TableWrapper = styled.div<{ $align: RowAlign }>`
  height: 100%;
  ${(props) => props.$align && useTableAlign().getAlignStyle(props.$align)}
`;

interface TableContainerProps {
  children?: ReactNode;
  cardProps: CardProps;
  tableProps: TableProps<any>;
  /**
   * 表格唯一标识，用于持久化配置
   */
  tableKey?: string;
  /**
   * 是否显示表格设置
   */
  showSettings?: boolean;
  /**
   * 刷新表格的回调
   */
  onRefresh?: () => void;
  /**
   * 分页变化的回调
   */
  onPaginationChange?: (pagination: TablePaginationConfig) => void;
}

const TableContainer: React.FC<TableContainerProps> = ({ children, cardProps, tableProps, tableKey = 'default_table', showSettings = true, onRefresh, onPaginationChange }) => {
  const [tableHeight, setTableHeight] = useState<number | string>('100%');
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  // 使用自定义钩子管理表格设置
  const { tableSize, setTableSize } = useTableDensity('middle');
  const { tableAlign, setTableAlign } = useTableAlign('center');

  // 处理列设置
  const { columnsState, setColumnsState, convertColumnsToItems } = useTableColumns(tableKey);

  // 当列配置变更时修改表格列
  const visibleColumns = useMemo(() => {
    if (!tableProps.columns || !columnsState.length) return tableProps.columns;

    // 先按照order属性排序
    const sortedColumnItems = [...columnsState].sort((a, b) => (a.order || 0) - (b.order || 0));

    return sortedColumnItems
      .filter((item) => item.visible !== false)
      .map((item) => {
        const originalCol = tableProps.columns?.find((col: any) => {
          if ('dataIndex' in col) {
            return (col.key?.toString() || col.dataIndex?.toString() || '') === item.key;
          }
          return col.key?.toString() === item.key;
        });

        if (originalCol) {
          // 合并原始列定义和自定义设置
          return {
            ...originalCol,
            fixed: item.fixed, // 应用列固定设置
          };
        }
        return null;
      })
      .filter(Boolean) as typeof tableProps.columns;
  }, [tableProps.columns, columnsState]);

  // 初始化列配置
  useEffect(() => {
    if (tableProps.columns?.length && (!columnsState.length || columnsState.length !== tableProps.columns.length)) {
      const items = convertColumnsToItems(tableProps.columns);
      setColumnsState(items);
    }
  }, [tableProps.columns, convertColumnsToItems, setColumnsState, columnsState.length]);

  // 更新表格高度的函数
  const updateTableHeight = () => {
    if (!tableContainerRef.current) return;

    // 使用requestAnimationFrame确保DOM已渲染
    requestAnimationFrame(() => {
      if (!tableContainerRef.current) return;

      // 获取容器高度
      const containerHeight = tableContainerRef.current.clientHeight;

      // 获取自定义头部高度
      const headerHeight = headerRef.current?.clientHeight || 0;

      // 获取表格表头高度（如果已渲染）
      const tableHeaderElement = tableWrapperRef.current?.querySelector('.ant-table-thead');
      const tableHeaderHeight = tableHeaderElement ? tableHeaderElement.clientHeight : 0;

      // 计算可用高度（减去所有固定高度组件）
      const availableHeight = Math.max(0, containerHeight - headerHeight - tableHeaderHeight - 16); // 16px为内边距

      // 设置表格高度
      setTableHeight(`${availableHeight}px`);
    });
  };

  // 初始化和窗口大小变化时重新计算高度
  useEffect(() => {
    updateTableHeight();

    const handleResize = () => updateTableHeight();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 数据源变化时重新计算高度
  useEffect(() => {
    updateTableHeight();
  }, [tableProps.dataSource]);

  // 处理列变更 - 必须更新状态
  const handleColumnsChange = (items: ColumnItem[]) => {
    // 将最新的列配置更新到state中，这样visibleColumns会重新计算
    setColumnsState(items);
  };

  // 处理表格刷新
  const handleRefresh = () => {
    onRefresh?.();
  };

  // 处理表格大小变更
  const handleSizeChange = (size: TableSize) => {
    setTableSize(size);
  };

  // 处理表格对齐方式变更
  const handleAlignChange = (align: RowAlign) => {
    setTableAlign(align);
  };

  // 处理表格变化事件（分页、排序、筛选）
  const handleTableChange = (pagination: TablePaginationConfig, filters: any, sorter: any, extra: any) => {
    // 调用原始的 onChange 事件(如果存在)
    if (tableProps.onChange) {
      tableProps.onChange(pagination, filters, sorter, extra);
    }

    // 通知父组件分页改变
    if (onPaginationChange) {
      onPaginationChange(pagination);
    }
  };

  // 增强分页配置
  const enhancedPagination = useMemo(() => {
    // 如果没有提供分页配置或设为false，保持原样
    if (tableProps.pagination === false) return false;

    // 默认分页配置
    const defaultPagination: TablePaginationConfig = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: number) => `共 ${total} 条记录`,
      pageSize: 10,
      size: 'default',
    };

    // 合并用户提供的分页配置和默认配置
    return {
      ...defaultPagination,
      ...(typeof tableProps.pagination === 'object' ? tableProps.pagination : {}),
    };
  }, [tableProps.pagination]);

  // 合并表格属性，添加滚动高度、列配置和增强的分页配置
  const enhancedTableProps: TableProps<any> = {
    ...tableProps,
    size: tableSize,
    columns: visibleColumns,
    scroll: {
      ...tableProps.scroll,
      y: tableHeight,
    },
    pagination: enhancedPagination,
    onChange: handleTableChange,
  };

  return (
    <StyledCard>
      <TableContainerHeader ref={headerRef}>
        <div className="header-left">
          <div className="title">{cardProps.title}</div>
        </div>

        <div className="header-right">
          {cardProps.extra}
          {showSettings && (
            <TableSettings
              tableKey={tableKey}
              columns={columnsState}
              onRefresh={handleRefresh}
              onSizeChange={handleSizeChange}
              onColumnsChange={handleColumnsChange}
              size={tableSize}
              onAlignChange={handleAlignChange}
              align={tableAlign}
            />
          )}
        </div>
      </TableContainerHeader>

      <div ref={tableContainerRef} className="flex-1 overflow-hidden">
        <TableWrapper ref={tableWrapperRef} className="h-full" $align={tableAlign}>
          <Table {...enhancedTableProps} />
        </TableWrapper>
      </div>

      {children}
    </StyledCard>
  );
};

export default TableContainer;
