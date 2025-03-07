import { memo } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { ThemeLayout } from '@/types/enum/setting';
import styled from 'styled-components';
import { cn } from '@/utils/cn';
import { themeVars } from '@/configs/theme/hooks/theme.css';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/animate/components/page-transition';
import { useSettings } from '@/store/settingStore';
import MultiTabs from './multi-tabs';
import { TabsProvider } from './TabsContext';

const StyledContent = styled(Layout.Content)`
  background: ${themeVars.colors.background.default};
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

//Todo: 添加动画,如果同时设置进入和离开动画,页面会闪烁，因为路由切换会直接切换，但是动画还没有结束，导致页面显示很怪异，所以借鉴了
//https://github.com/remix-run/react-router/discussions/10411
//https://stackoverflow.com/questions/74351136/nested-child-route-transitions-in-react-router-dom-6-4-3-using-framer-motion/74352029#74352029
//虽然完成了动画，但是还是有点小问题，比如不能在外侧包裹Suspense，页面偶尔不能正常显示,
export default memo(({ themeLayout }: { themeLayout: ThemeLayout }) => {
  const { enableTabs } = useSettings();

  return (
    <StyledContent className="flex w-full">
      <div className="flex-grow overflow-hidden size-full relative">
        <div className={cn('overflow-hidden m-auto size-full flex-grow sm:p-3', themeLayout === ThemeLayout.Horizontal ? 'flex-col' : 'flex-row')}>
          <AnimatePresence mode="wait">
            <PageTransition>
              {enableTabs ? (
                <TabsProvider>
                  <MultiTabs />
                </TabsProvider>
              ) : (
                <Outlet />
              )}
            </PageTransition>
          </AnimatePresence>
        </div>
      </div>
    </StyledContent>
  );
});
