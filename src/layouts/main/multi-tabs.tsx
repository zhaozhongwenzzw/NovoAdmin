import React, { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { useTabs, TabItem } from './TabsContext';
import { Iconify } from '@/components/icon';

// 标签容器
const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--colors-background-default);
`;

// 标签栏样式
const TabsBar = styled.div`
  display: flex;
  align-items: flex-end;
  overflow-x: auto;
  overflow-y: hidden;
  font-size: 14px;

  /* 隐藏滚动条但保留功能 */
  &::-webkit-scrollbar {
    height: 0;
    width: 0;
  }
`;

// 弧形标签样式
const Tab = styled.div<{ $active: boolean }>`
  position: relative;
  margin: 0 -15px;
  cursor: pointer;
  transition: 0.2s;
  padding: 4px 17.5px;
  background-color: ${(props) => (props.$active ? 'rgba(var(--colors-palette-primary-defaultChannel),0.2)' : 'transparent')};
  -webkit-mask-box-image: url("data:image/svg+xml,%3Csvg width='67' height='33' viewBox='0 0 67 33' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M27 0c-6.627 0-12 5.373-12 12v6c0 8.284-6.716 15-15 15h67c-8.284 0-15-6.716-15-15v-6c0-6.627-5.373-12-12-12H27z' fill='%23F8EAE7'/%3E%3C/svg%3E")
    12 27 15;
  mask-box-image: url("data:image/svg+xml,%3Csvg width='67' height='33' viewBox='0 0 67 33' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M27 0c-6.627 0-12 5.373-12 12v6c0 8.284-6.716 15-15 15h67c-8.284 0-15-6.716-15-15v-6c0-6.627-5.373-12-12-12H27z' fill='%23F8EAE7'/%3E%3C/svg%3E")
    12 27 15;
`;

// 标签内容容器
const TabContent = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: transparent;
  overflow: hidden;
  gap: 8px;
  padding: 6px 17.5px;
  &:hover {
    background-color: ${(props) => (props.$active ? 'transparent' : 'rgba(var(--colors-palette-primary-defaultChannel),0.2)')};
    border-radius: 10px;
  }
`;

// 标签图标
const TabIcon = styled(Iconify)`
  font-size: 16px;
  flex-shrink: 0;
`;

// 标签标题
const TabTitle = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// 关闭按钮
const CloseButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  flex-shrink: 0;
  opacity: 0.7;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    opacity: 1;
  }
`;

// 内容区域
const ContentContainer = styled.div`
  flex: 1;
  overflow: hidden;
  padding: 16px;
`;

const MultiTabs: React.FC = () => {
  const { activeKey, tabs, removeTab, setActiveTab, removeOthers, removeAll } = useTabs();
  const tabsBarRef = useRef<HTMLDivElement>(null);

  // 滚动到活动标签
  useEffect(() => {
    if (tabsBarRef.current && activeKey) {
      const activeTab = tabsBarRef.current.querySelector(`[data-key="${activeKey}"]`);
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeKey]);

  // 标签右键菜单选项
  const getContextMenuItems = (tab: TabItem): MenuProps => {
    return {
      items: [
        {
          key: 'refresh',
          label: '刷新',
          icon: <Iconify icon="mdi:refresh" />,
          onClick: () => {
            setActiveTab(tab.key);
          },
        },
        {
          key: 'close',
          label: '关闭',
          icon: <Iconify icon="mdi:close" />,
          disabled: !tab.closable,
          onClick: () => removeTab(tab.key),
        },

        {
          type: 'divider',
        },
        {
          key: 'closeOthers',
          label: '关闭其他标签页',
          icon: <Iconify icon="mdi:close-circle" />,
          onClick: () => removeOthers(tab.key),
        },
        {
          key: 'closeAll',
          label: '关闭所有标签页',
          icon: <Iconify icon="mdi:close-circle-multiple" />,
          onClick: removeAll,
        },
      ],
    };
  };

  // 如果没有标签，显示默认标签
  if (tabs.length === 0) {
    return (
      <TabsContainer>
        <TabsBar>
          <Tab $active={true}>
            <TabContent $active={true}>
              <TabIcon icon="mdi:home" />
              <TabTitle>首页</TabTitle>
            </TabContent>
          </Tab>
        </TabsBar>
        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </TabsContainer>
    );
  }

  return (
    <TabsContainer>
      <TabsBar ref={tabsBarRef}>
        {tabs.map((tab) => (
          <Dropdown key={tab.key} menu={getContextMenuItems(tab)} trigger={['contextMenu']}>
            <Tab $active={activeKey === tab.key} onClick={() => setActiveTab(tab.key)} data-key={tab.key}>
              <TabContent $active={activeKey === tab.key}>
                <TabIcon icon={tab.path === '/home' ? 'mdi:home' : 'mdi:file-document-outline'} />
                <TabTitle>{tab.label}</TabTitle>
                {tab.closable && (
                  <CloseButton
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      removeTab(tab.key);
                    }}
                  >
                    <Iconify icon="mdi:close" fontSize={14} />
                  </CloseButton>
                )}
              </TabContent>
            </Tab>
          </Dropdown>
        ))}
      </TabsBar>
      <ContentContainer>
        <Outlet />
      </ContentContainer>
    </TabsContainer>
  );
};

export default MultiTabs;
