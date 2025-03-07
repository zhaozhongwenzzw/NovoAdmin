import { useState } from 'react';
import type { MenuProps } from 'antd';
import { Iconify } from '@/components/icon';
import { css } from 'styled-components';

export type RowAlign = 'left' | 'center' | 'right';

/**
 * 表格对齐方式钩子
 * @param initialAlign 初始对齐方式
 * @returns 表格对齐相关的状态与方法
 */
export default function useTableAlign(initialAlign: RowAlign = 'center') {
  const [tableAlign, setTableAlign] = useState<RowAlign>(initialAlign);

  // 获取当前对齐方式对应的图标
  const getAlignIcon = () => {
    switch (tableAlign) {
      case 'left':
        return 'mdi:format-align-left';
      case 'right':
        return 'mdi:format-align-right';
      default:
        return 'mdi:format-align-center';
    }
  };

  // 处理对齐方式变更
  const handleAlignChange = ({ key }: { key: string }) => {
    setTableAlign(key as RowAlign);
  };

  // 获取对齐样式
  const getAlignStyle = (align: RowAlign) => {
    switch (align) {
      case 'left':
        return css`
          .ant-table-thead > tr > th,
          .ant-table-tbody > tr > td {
            text-align: left;
          }
        `;
      case 'right':
        return css`
          .ant-table-thead > tr > th,
          .ant-table-tbody > tr > td {
            text-align: right;
          }
        `;
      case 'center':
      default:
        return css`
          .ant-table-thead > tr > th,
          .ant-table-tbody > tr > td {
            text-align: center;
          }
        `;
    }
  };

  // 对齐方式菜单项
  const alignItems: MenuProps['items'] = [
    {
      key: 'left',
      label: '左对齐',
      icon: <Iconify icon="mdi:format-align-left" size={16} />,
    },
    {
      key: 'center',
      label: '居中对齐',
      icon: <Iconify icon="mdi:format-align-center" size={16} />,
    },
    {
      key: 'right',
      label: '右对齐',
      icon: <Iconify icon="mdi:format-align-right" size={16} />,
    },
  ];

  return {
    tableAlign,
    setTableAlign,
    getAlignIcon,
    handleAlignChange,
    getAlignStyle,
    alignItems,
  };
}
