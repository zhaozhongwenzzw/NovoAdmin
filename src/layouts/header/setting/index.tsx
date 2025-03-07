import React, { useState } from 'react';

import ColorThemeSetting from './colorThemeSetting';
import { Drawer } from 'antd';
import { Iconify } from '@/components/icon';
import LayoutSetting from './layoutSetting';
import PageSetting from './pageSetting';
import ToggleSwitch from './toggleSwitch';

const SettingItemsContent: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="mt-4">
      <div className="mb-2 text-sm font-[600] text-text-secondary">{title}</div>
      {children}
    </div>
  );
};
const Setting: React.FC = () => {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const settingsMap = [
    {
      title: '整体风格',
      children: <ToggleSwitch />,
    },
    {
      title: '布局',
      children: <LayoutSetting />,
    },
    {
      title: '页面',
      children: <PageSetting />,
    },
    {
      title: '颜色主题',
      children: <ColorThemeSetting />,
    },
  ];
  return (
    <>
      <Iconify icon="solar:settings-bold-duotone" className="text-2xl cursor-pointer animate-spin [animation-duration:4s]" onClick={showDrawer} />
      <Drawer
        title="设置"
        placement="right"
        width={400}
        rootClassName="!outline-none"
        styles={{
          body: { padding: '12px' },
          mask: { backgroundColor: 'transparent' },
        }}
        style={{ backgroundColor: 'rgba(var(--colors-background-paperChannel), 0.9)' }}
        onClose={onClose}
        open={open}
      >
        {settingsMap.map(({ title, children }) => (
          <SettingItemsContent key={title} title={title}>
            {children}
          </SettingItemsContent>
        ))}
      </Drawer>
    </>
  );
};

export default Setting;
