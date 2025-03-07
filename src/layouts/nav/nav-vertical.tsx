import { Menu, Layout } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserInfo } from '@/store/userStore';
import { useMemo, useState, useEffect } from 'react';
import type { MenuProps } from 'antd';
import type { Permission } from '@/types/user';
import NavLogo from './nav-logo';
import { NAV_WIDTH } from '../config';
import { useSettingActions, useSettings } from '@/store/settingStore';
import { Iconify } from '@/components/icon';
import styled from 'styled-components';
import { ThemeLayout } from '@/types/enum/setting';

const { Sider } = Layout;

const NavVertical = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = useUserInfo();
  const settings = useSettings();
  const { setSettings } = useSettingActions();
  const [collapsed, setCollapsed] = useState(true);
  const { themeLayout } = settings;

  // 获取默认展开的菜单keys
  const defaultOpenKeys = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const openKeys: string[] = [];

    // 构建每一级的路径
    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      openKeys.push(currentPath);
    });

    return openKeys;
  }, [location.pathname]);

  // 监听 themeLayout 变化，自动设置 collapsed 状态
  useEffect(() => {
    setCollapsed(themeLayout === ThemeLayout.Mini);
  }, [themeLayout]);

  // 处理折叠状态变化
  const handleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    setSettings({
      ...settings,
      themeLayout: newCollapsed ? ThemeLayout.Mini : ThemeLayout.Vertical,
    });
  };

  const menuItems = useMemo(() => {
    const generateMenuItems = (permissions: Permission[] = []): MenuProps['items'] => {
      return permissions.map((permission) => ({
        key: permission.path,
        label: permission.name,
        icon: permission.icon ? <Iconify className="text-2xl ml-[-5px]" icon={permission.icon} /> : null,
        children: permission.children?.length ? generateMenuItems(permission.children) : undefined,
        hidden: permission.hide,
      }));
    };
    return generateMenuItems(userInfo.permissions);
  }, [userInfo.permissions]);

  const darkSidebar = useMemo(() => (settings.darkSidebar ? 'dark' : 'light'), [settings.darkSidebar]);

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} theme={darkSidebar} width={NAV_WIDTH} className="!fixed left-[0px] top-0 h-screen border-r border-dashed border-border">
      <div className="flex h-full flex-col relative">
        <NavLogo collapsed={collapsed} />
        <Menu
          mode="inline"
          theme={darkSidebar}
          selectedKeys={[location.pathname]}
          defaultOpenKeys={defaultOpenKeys}
          items={menuItems}
          onClick={({ key }: { key: string }) => navigate(key)}
          className="!border-none"
        />
        <CollapseButton onClick={handleCollapse} $collapsed={collapsed}>
          <Iconify icon="ep:arrow-left-bold" className="collapse-icon" />
        </CollapseButton>
      </div>
    </Sider>
  );
};

export default NavVertical;

const CollapseButton = styled.div<{ $collapsed: boolean }>`
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 0 4px 4px 0;
  color: var(--colors-text-secondary);
  transition: all 0.2s ease;
  background-color: var(--colors-background-paper);
  border-left: none;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  opacity: 0.6;

  &:hover {
    color: var(--colors-palette-primary-default);
    background-color: var(--colors-background-default);
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
    opacity: 1;

    .collapse-icon {
      transform: ${(props) => (props.$collapsed ? 'rotate(180deg) translateX(-2px)' : 'rotate(0deg) translateX(-2px)')};
    }
  }

  .collapse-icon {
    font-size: 14px;
    transition: transform 0.2s ease;
    transform: ${(props) => (props.$collapsed ? 'rotate(180deg)' : 'rotate(0deg)')};
  }
`;
