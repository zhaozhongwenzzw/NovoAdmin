import { memo } from 'react';
import { Layout } from 'antd';
import { themeVars } from '@/configs/theme/hooks/theme.css';
import { rgbAlpha } from '@/utils/theme';
import Setting from './setting';
import Avatar from './avatar';
import { HEADER_HEIGHT } from '../config';
import styled from 'styled-components';
import { Iconify } from '@/components/icon';
import Search from './search';
import Breadcrumbs from './breadcrumb';
import { useResponsive } from '@/hooks/useResponsive';
import { useSettings } from '@/store/settingStore';

const IconHover = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--colors-palette-gray-300);
  }

  :root.dark & {
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
`;

const Header = () => {
  const { Header } = Layout;
  const { isPc } = useResponsive();
  const { breadCrumb } = useSettings();

  const headerStyle = {
    backgroundColor: rgbAlpha(themeVars.colors.background.defaultChannel, 0.9),
    height: HEADER_HEIGHT,
    lineHeight: '2em',
  };

  const handleGithubClick = () => {
    window.open('https://github.com/your-repo-url', '_blank');
  };

  return (
    <Header style={headerStyle} className="flex items-center justify-between px-4">
      <div>{isPc && breadCrumb && <Breadcrumbs />}</div>
      <div className="flex items-center">
        <Search />
        <IconHover onClick={handleGithubClick}>
          <Iconify icon="mdi:github" className="text-2xl cursor-pointer" />
        </IconHover>
        <IconHover>
          <Setting />
        </IconHover>
        <Avatar isPc={isPc} />
      </div>
    </Header>
  );
};

export default memo(Header);
