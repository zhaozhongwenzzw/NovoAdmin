import React from 'react';
import { Popconfirm, Tooltip } from 'antd';

interface WithTooltipConfirmProps {
  tooltipTitle?: string;
  showPopconfirm?: boolean;
  popconfirmTitle?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
}

const withTooltipConfirm = (props: WithTooltipConfirmProps) => {
  const { tooltipTitle, showPopconfirm = true, popconfirmTitle = '确认执行此操作吗？', onConfirm, onCancel, children } = props;

  // 基础组件
  const BaseComponent = <>{children}</>;

  // 如果不需要Tooltip和Popconfirm，直接返回原始组件
  if (!tooltipTitle && !showPopconfirm) {
    return BaseComponent;
  }

  // 如果只需要Tooltip
  if (tooltipTitle && !showPopconfirm) {
    return <Tooltip title={tooltipTitle}>{BaseComponent}</Tooltip>;
  }

  // 如果只需要Popconfirm
  if (!tooltipTitle && showPopconfirm) {
    return (
      <Popconfirm title={popconfirmTitle} onConfirm={onConfirm} onCancel={onCancel}>
        {BaseComponent}
      </Popconfirm>
    );
  }

  // 同时需要Tooltip和Popconfirm
  return (
    <Tooltip title={tooltipTitle}>
      <Popconfirm title={popconfirmTitle} onConfirm={onConfirm} onCancel={onCancel}>
        {BaseComponent}
      </Popconfirm>
    </Tooltip>
  );
};

export default withTooltipConfirm;
