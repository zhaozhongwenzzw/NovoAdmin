import { memo, Suspense } from 'react';
import { Layout } from 'antd';
import Nav from './nav';
import Main from './main';
import Header from './header';
import { useSettings } from '@/store/settingStore';
import { CircleLoading } from '@/components/loading/circle-loading';
import { NAV_COLLAPSED_WIDTH, NAV_WIDTH } from './config';
import { ThemeLayout } from '@/types/enum/setting';
import { useMemo } from 'react';
import { cn } from '@/utils/cn';
import { CSSProperties } from 'styled-components';

export default memo(() => {
  const settings = useSettings();
  const { themeLayout } = settings;
  const secondLayoutStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    width: '100vw',
    paddingLeft: themeLayout === ThemeLayout.Horizontal ? 0 : themeLayout === ThemeLayout.Mini ? NAV_COLLAPSED_WIDTH : NAV_WIDTH,
  };
  const layoutClassName = useMemo(() => {
    return cn('flex h-screen overflow-hidden', themeLayout === ThemeLayout.Horizontal ? 'flex-col' : 'flex-row');
  }, [themeLayout]);
  return (
    <Layout className={layoutClassName}>
      <Suspense fallback={<CircleLoading />}>
        <Layout style={secondLayoutStyle}>
          <Header />
          <Nav themeLayout={themeLayout} />
          <Main themeLayout={themeLayout} />
        </Layout>
      </Suspense>
    </Layout>
  );
});
