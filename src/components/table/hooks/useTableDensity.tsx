import { useState } from 'react';
import type { MenuProps } from 'antd';
import { Iconify } from '@/components/icon';

export type TableSize = 'middle' | 'small' | 'large';

/**
 * 表格密度钩子
 * @param initialSize 初始密度
 * @returns 表格密度相关的状态与方法
 */
export default function useTableDensity(initialSize: TableSize = 'middle') {
  const [tableSize, setTableSize] = useState<TableSize>(initialSize);

  // 获取当前模式对应的图标
  const getSizeIcon = () => {
    switch (tableSize) {
      case 'small':
        return 'mdi:format-align-justify';
      case 'large':
        return 'mdi:view-sequential';
      default:
        return 'mdi:view-headline';
    }
  };

  // 处理表格大小变更
  const handleSizeChange = ({ key }: { key: string }) => {
    setTableSize(key as TableSize);
  };

  // 密度菜单项
  const sizeItems: MenuProps['items'] = [
    {
      key: 'middle',
      label: '默认',
      icon: <Iconify icon="mdi:view-headline" size={16} />,
    },
    {
      key: 'small',
      label: '紧凑',
      icon: <Iconify icon="mdi:format-align-justify" size={16} />,
    },
    {
      key: 'large',
      label: '宽松',
      icon: <Iconify icon="mdi:view-sequential" size={16} />,
    },
  ];

  return {
    tableSize,
    setTableSize,
    getSizeIcon,
    handleSizeChange,
    sizeItems,
  };
}
