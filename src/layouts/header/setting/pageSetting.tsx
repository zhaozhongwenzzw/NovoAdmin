import { Divider, Switch } from 'antd';
import { useSettingActions, useSettings } from '@/store/settingStore';

import React from 'react';
import styled from 'styled-components';

// 样式化的设置项容器
const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

// 样式化的设置项标题
const SettingTitle = styled.div`
  font-size: 14px;
  color: var(--colors-text-primary);
`;

// 样式化的设置项描述
const SettingDescription = styled.div`
  font-size: 12px;
  color: var(--colors-text-secondary);
  margin-top: 4px;
`;

const PageSetting: React.FC = () => {
  const settings = useSettings();
  const { setSettings } = useSettingActions();

  // 处理面包屑显示切换
  const handleBreadcrumbChange = (checked: boolean) => {
    setSettings({ ...settings, breadCrumb: checked });
  };

  // 处理多标签页启用切换
  const handleTabsChange = (checked: boolean) => {
    setSettings({ ...settings, enableTabs: checked });
  };

  return (
    <div>
      <SettingItem>
        <div>
          <SettingTitle>显示面包屑</SettingTitle>
          <SettingDescription>在页面顶部显示面包屑导航</SettingDescription>
        </div>
        <Switch size="small" checked={settings.breadCrumb} onChange={handleBreadcrumbChange} />
      </SettingItem>

      <Divider style={{ margin: '12px 0' }} />

      <SettingItem>
        <div>
          <SettingTitle>启用多标签页</SettingTitle>
          <SettingDescription>开启页面多标签模式</SettingDescription>
        </div>
        <Switch size="small" checked={settings.enableTabs} onChange={handleTabsChange} />
      </SettingItem>
    </div>
  );
};

export default PageSetting;
