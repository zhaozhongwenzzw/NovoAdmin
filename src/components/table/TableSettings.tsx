import React, { useState, useEffect, forwardRef } from 'react';
import { Button, Popover, Checkbox, Divider, Tooltip, Dropdown } from 'antd';
import styled from 'styled-components';
import { Iconify } from '@/components/icon';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import useTableDensity, { TableSize } from './hooks/useTableDensity';
import useTableAlign, { RowAlign } from './hooks/useTableAlign';
import { useTableColumns, ColumnItem } from './hooks/useTableColumns';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

const SettingsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 10px;
`;

const ColumnsSettingContent = styled.div`
  width: 280px;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;

  .column-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    padding: 4px 0;
    border-radius: 4px;
    cursor: move;

    &:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }

    &.dragging {
      opacity: 0.5;
      background-color: rgba(0, 0, 0, 0.04);
    }

    .column-drag {
      cursor: move;
      color: rgba(0, 0, 0, 0.45);
      padding: 0 4px;

      &:hover {
        color: rgba(0, 0, 0, 0.85);
      }
    }

    .column-title {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0 8px;
    }

    .column-actions {
      display: flex;
      align-items: center;
    }

    .column-fixed {
      cursor: pointer;
      color: rgba(0, 0, 0, 0.45);
      padding: 0 4px;

      &:hover {
        color: rgba(0, 0, 0, 0.85);
      }

      &.fixed-left {
        color: #1890ff;
      }

      &.fixed-right {
        color: #52c41a;
      }
    }
  }

  .column-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }
`;

// 创建一个带有 ref 转发的图标包装器
const ForwardRefIcon = forwardRef<
  HTMLSpanElement,
  {
    icon: string;
    size?: number;
    className?: string;
    onClick?: () => void;
  }
>((props, ref) => {
  const { icon, size, className = '', onClick } = props;
  return (
    <span ref={ref} className={`cursor-pointer ${className}`} onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center' }}>
      <Iconify icon={icon} size={size} />
    </span>
  );
});

// 导出类型
export type { RowAlign };
export type { TableSize };
export type { ColumnItem };

interface TableSettingsProps {
  /**
   * 表格唯一标识，用于本地存储配置
   */
  tableKey: string;
  /**
   * 列配置
   */
  columns: ColumnItem[];
  /**
   * 刷新表格回调
   */
  onRefresh?: () => void;
  /**
   * 表格密度切换回调
   */
  onSizeChange?: (size: TableSize) => void;
  /**
   * 列配置变更回调
   */
  onColumnsChange?: (columns: ColumnItem[]) => void;
  /**
   * 当前表格密度
   */
  size?: TableSize;
  /**
   * 行对齐方式切换回调
   */
  onAlignChange?: (align: RowAlign) => void;
  /**
   * 当前行对齐方式
   */
  align?: RowAlign;
}

// 创建可排序的列项组件
const SortableColumnItem = ({
  item,
  index,
  onColumnChange,
  onFixedChange,
}: {
  item: ColumnItem;
  index: number;
  onColumnChange: (e: CheckboxChangeEvent, index: number) => void;
  onFixedChange: (index: number) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.key,
  });

  const customTransform = transform ? { ...transform, x: 0 } : transform;

  const style = {
    transform: CSS.Transform.toString(customTransform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? 'rgba(0, 0, 0, 0.04)' : undefined,
    width: '100%',
    boxSizing: 'border-box' as const,
  };

  // 获取固定状态图标
  const getFixedIcon = (fixed?: boolean | 'left' | 'right') => {
    if (fixed === 'left') return 'mdi:lock-outline';
    if (fixed === 'right') return 'mdi:lock-outline';
    return 'mdi:lock-open-outline';
  };

  // 获取固定状态图标样式
  const getFixedClass = (fixed?: boolean | 'left' | 'right') => {
    if (fixed === 'left') return 'fixed-left';
    if (fixed === 'right') return 'fixed-right';
    return '';
  };

  return (
    <div ref={setNodeRef} style={style} className="column-item" {...attributes}>
      <div className="column-drag" {...listeners}>
        <Iconify icon="mdi:drag" size={16} />
      </div>

      <Checkbox checked={item.visible} disabled={item.disabled} onChange={(e: any) => onColumnChange(e, index)} />

      <span className="column-title">{item.title}</span>

      <div className="column-actions">
        <Tooltip title={item.fixed ? (item.fixed === 'left' ? '固定在左侧' : '固定在右侧') : '未固定'}>
          <div className={`column-fixed ${getFixedClass(item.fixed)}`} onClick={() => onFixedChange(index)}>
            <Iconify icon={getFixedIcon(item.fixed)} size={16} />
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

const TableSettings: React.FC<TableSettingsProps> = ({ tableKey, columns, onRefresh, onSizeChange, onColumnsChange, size = 'middle', onAlignChange, align = 'center' }) => {
  const [open, setOpen] = useState(false);

  // 使用自定义钩子
  const { tableSize, setTableSize, getSizeIcon, handleSizeChange: handleDensityChange, sizeItems } = useTableDensity(size);
  const { tableAlign, setTableAlign, getAlignIcon, handleAlignChange: handleRowAlignChange, alignItems } = useTableAlign(align);
  const { columnsState, handleColumnChange, handleSelectAll, handleFixedChange, handleDragSort, handleReset, getSelectAllStatus } = useTableColumns(tableKey, columns);

  // 同步外部属性变化
  useEffect(() => {
    if (size && size !== tableSize) {
      setTableSize(size);
    }
  }, [size, tableSize, setTableSize]);

  useEffect(() => {
    if (align && align !== tableAlign) {
      setTableAlign(align);
    }
  }, [align, tableAlign, setTableAlign]);

  // 设置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // 处理拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = columnsState.findIndex((item) => item.key === active.id);
      const overIndex = columnsState.findIndex((item) => item.key === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        const newColumns = handleDragSort(activeIndex, overIndex);
        onColumnsChange?.(newColumns);
      }
    }
  };

  // 处理列变更
  const onColumnChange = (e: CheckboxChangeEvent, index: number) => {
    const newColumns = handleColumnChange(e, index);
    onColumnsChange?.(newColumns);
  };

  // 处理全选
  const onSelectAll = (checked: boolean) => {
    const newColumns = handleSelectAll(checked);
    onColumnsChange?.(newColumns);
  };

  // 处理固定列
  const onFixedChange = (index: number) => {
    const newColumns = handleFixedChange(index);
    onColumnsChange?.(newColumns);
  };

  // 处理重置
  const onReset = () => {
    const newColumns = handleReset();
    onColumnsChange?.(newColumns);
  };

  // 处理表格大小变更
  const handleSizeChange = (info: { key: string }) => {
    handleDensityChange(info);
    onSizeChange?.(info.key as TableSize);
  };

  // 处理对齐方式变更
  const handleAlignChange = (info: { key: string }) => {
    handleRowAlignChange(info);
    onAlignChange?.(info.key as RowAlign);
  };

  // 列配置内容
  const getColumnSettingContent = () => {
    const { allChecked, indeterminate } = getSelectAllStatus();

    return (
      <ColumnsSettingContent id="columns-setting-container">
        <div className="column-header">
          <Checkbox indeterminate={indeterminate} checked={allChecked} onChange={(e: { target: { checked: boolean } }) => onSelectAll(e.target.checked)}>
            列展示
          </Checkbox>
          <Divider />
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
          <SortableContext items={columnsState.map((item) => item.key)} strategy={verticalListSortingStrategy}>
            {columnsState.map((col, index) => (
              <SortableColumnItem key={col.key} item={col} index={index} onColumnChange={onColumnChange} onFixedChange={onFixedChange} />
            ))}
          </SortableContext>
        </DndContext>

        <div className="column-footer">
          <Button size="small" onClick={onReset}>
            重置
          </Button>
          <Button size="small" type="primary" onClick={() => setOpen(false)}>
            确定
          </Button>
        </div>
      </ColumnsSettingContent>
    );
  };

  return (
    <SettingsWrapper>
      <Tooltip title="刷新">
        <ForwardRefIcon icon="mdi:refresh" size={18} onClick={onRefresh} />
      </Tooltip>

      <Divider type="vertical" />

      <Dropdown trigger={['click']} menu={{ items: sizeItems, onClick: handleSizeChange, selectedKeys: [tableSize] }} placement="bottom">
        <Tooltip title="表格密度">
          <ForwardRefIcon icon={getSizeIcon()} size={18} />
        </Tooltip>
      </Dropdown>

      <Divider type="vertical" />

      <Dropdown trigger={['click']} menu={{ items: alignItems, onClick: handleAlignChange, selectedKeys: [tableAlign] }} placement="bottom">
        <Tooltip title="对齐方式">
          <ForwardRefIcon icon={getAlignIcon()} size={18} />
        </Tooltip>
      </Dropdown>

      <Divider type="vertical" />

      <Popover title="列设置" trigger="click" open={open} onOpenChange={setOpen} content={getColumnSettingContent()} placement="bottomRight">
        <Tooltip title="列设置">
          <ForwardRefIcon icon="mdi:cog-outline" size={18} onClick={() => setOpen(true)} />
        </Tooltip>
      </Popover>
    </SettingsWrapper>
  );
};

export default TableSettings;
export { useTableColumns };
