import React from 'react';
import { Dropdown, Avatar as AntdAvatar } from 'antd';
import type { MenuProps } from 'antd';
import { useUserInfo, useUserActions } from '@/store/userStore';
import { useRouter } from '@/router/hooks';
import { Iconify } from '@/components/icon';
import styled from 'styled-components';
import { UserOutlined } from '@ant-design/icons';

const AvatarWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: var(--spacing-2);
  margin-right: var(--spacing-2);
`;

const Avatar: React.FC<{ isPc?: boolean }> = ({ isPc = true }) => {
  const userInfo = useUserInfo();
  const { clearUserInfoAndToken } = useUserActions();
  const router = useRouter();

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: '个人设置',
      icon: (
        <div className="mr-2">
          <Iconify icon="solar:user-circle-bold" size={16} style={{ color: 'rgb(var(--colors-palette-primary-defaultChannel))' }} />
        </div>
      ),
      onClick: () => router.push('/profile'),
    },
    {
      key: 'password',
      label: '修改密码',
      icon: (
        <div className="mr-2">
          <Iconify icon="solar:lock-password-bold" size={16} style={{ color: 'rgb(var(--colors-palette-warning-defaultChannel))' }} />
        </div>
      ),
      onClick: () => router.push('/change-password'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: (
        <div className="mr-2">
          <Iconify icon="solar:logout-3-bold" size={16} style={{ color: 'rgb(var(--colors-palette-error-defaultChannel))' }} />
        </div>
      ),
      onClick: () => {
        clearUserInfoAndToken();
        router.replace('/login');
      },
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
        style: {
          padding: '4px',
        },
      }}
      placement="bottom"
      arrow={{ pointAtCenter: true }}
      trigger={['hover']}
    >
      <AvatarWrapper>
        <AntdAvatar className="hover:scale-110 transition ease-in-out" src={userInfo.avatar} size={32} icon={<UserOutlined />}></AntdAvatar>
        {isPc && <span className="text-text-secondary ml-3 leading-[1]">{userInfo.username}</span>}
      </AvatarWrapper>
    </Dropdown>
  );
};

export default Avatar;
