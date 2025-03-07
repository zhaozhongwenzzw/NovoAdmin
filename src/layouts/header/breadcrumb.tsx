import React, { useMemo } from 'react';
import { Breadcrumb, Dropdown, MenuProps } from 'antd';
import type { ItemType as BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { useLocation } from 'react-router-dom';
import { useFlattenMenus } from '@/router/hooks/user-permission-route';
import styled from 'styled-components';
import { Iconify } from '@/components/icon';
import { useRouter } from '@/router/hooks';

const BreadcrumbWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
`;

const ActiveBreadcrumbItem = styled.span`
  color: var(--primary-color); /* 使用主题的主色调 */
  font-size: 0.8rem;
`;

const BreadcrumbItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  height: 100%;
`;

const HomeIcon = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
  margin-right: 4px;
  color: var(--primary-color);

  &:hover {
    opacity: 0.8;
  }
`;

interface MenuItem {
  id: string;
  name: string;
  path: string;
  parentId?: string;
  children?: MenuItem[];
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const flattenMenus: MenuItem[] = useFlattenMenus();
  const activePath = flattenMenus.find((item) => item.path === location.pathname);
  const flattenMenusPath: { title: string; path: string; children?: MenuItem[] }[] = [];
  const router = useRouter();
  const homepagePath = import.meta.env.VITE_APP_HOMEPAGE || '/';

  const findPidPath = (parentId: string | undefined) => {
    if (!parentId) {
      return;
    }
    const parentMenu = flattenMenus.find((item) => item.id === parentId);
    if (parentMenu) {
      flattenMenusPath.unshift({
        title: parentMenu.name,
        path: parentMenu.path,
        children: parentMenu.children,
      });
      findPidPath(parentMenu.parentId);
    }
  };

  if (activePath) {
    flattenMenusPath.push({
      title: activePath.name,
      path: activePath.path,
      children: activePath.children,
    });
    findPidPath(activePath.parentId);
  }

  const handleHomeClick = () => {
    router.push(homepagePath);
  };

  const items: BreadcrumbItemType[] = useMemo(() => {
    const homeItem: BreadcrumbItemType = {
      key: 'home',
      title: (
        <HomeIcon onClick={handleHomeClick} className="h-full">
          <Iconify className="text-xl" icon="mdi:home" />
        </HomeIcon>
      ),
    };

    const breadcrumbItems = [homeItem];

    const pathItems = flattenMenusPath.map((item) => {
      const isActive = item.path === location.pathname;
      const title = isActive ? <ActiveBreadcrumbItem>{item.title}</ActiveBreadcrumbItem> : <BreadcrumbItem>{item.title}</BreadcrumbItem>;

      const menu: MenuProps['items'] =
        item.children?.map((child) => ({
          key: child.path,
          label: <BreadcrumbItem onClick={() => router.push(child.path)}>{child.name}</BreadcrumbItem>,
        })) || [];

      return {
        key: item.path,
        title: item.children ? (
          <Dropdown menu={{ items: menu }} placement="bottom" arrow>
            <BreadcrumbItem>{title}</BreadcrumbItem>
          </Dropdown>
        ) : (
          title
        ),
      };
    });

    return [...breadcrumbItems, ...pathItems];
  }, [flattenMenusPath, location.pathname, homepagePath]);

  return (
    <BreadcrumbWrapper>
      <Breadcrumb
        items={items}
        separator={
          <div className="h-full flex items-center">
            <Iconify icon="gis:point" />
          </div>
        }
      />
    </BreadcrumbWrapper>
  );
};

export default Breadcrumbs;
