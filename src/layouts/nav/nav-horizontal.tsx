import { Menu } from 'antd';
import { useLocation } from 'react-router-dom';
import { useUserInfo } from '@/store/userStore';
import { useMemo } from 'react';
import { useRouter } from '@/router/hooks/use-router';
import type { MenuProps } from 'antd';
import type { Permission } from '@/types/user';
import { Iconify } from '@/components/icon';

const NavHorizontal = () => {
  const location = useLocation();
  const userInfo = useUserInfo();
  const router = useRouter();
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
  const onClick = (e: string) => {
    router.push(e);
  };
  return <Menu mode="horizontal" selectedKeys={[location.pathname]} items={menuItems} onClick={({ key }: { key: string }) => onClick(key)} className="border-b border-gray-200" />;
};

export default NavHorizontal;
