import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RouteObject, useLocation, useNavigate } from 'react-router-dom';
import { matchRoutes } from '@/router/utils';
import { usePermissionRoutes } from '@/router/hooks/user-permission-route';

// 定义标签页接口
export interface TabItem {
  key: string; // 唯一标识，使用路径
  label: string; // 显示名称
  path: string; // 完整路径
  closable: boolean; // 是否可关闭
  component?: React.ReactNode; // 缓存的组件
  cached?: boolean; // 是否缓存该标签
}

interface TabsContextType {
  activeKey: string;
  tabs: TabItem[];
  addTab: (tab: TabItem) => void;
  removeTab: (targetKey: string) => void;
  setActiveTab: (key: string) => void;
  removeOthers: (targetKey: string) => void;
  removeAll: () => void;
}

// 创建上下文
const TabsContext = createContext<TabsContextType | undefined>(undefined);

// 提供者组件
export const TabsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeKey, setActiveKey] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const routes = usePermissionRoutes();

  // 获取路由标题辅助函数
  const getRouteTitle = (path: string, matchedRoute?: any): string => {
    // 1. 如果有匹配路由且有meta.title，优先使用
    if (matchedRoute?.meta?.title) {
      return matchedRoute.meta.title;
    }

    // 2. 使用路径中的最后一段，首字母大写
    const segments = path.split('/').filter(Boolean);
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      // 检查是不是index，如果是则使用上一段路径
      if (lastSegment === 'index' && segments.length > 1) {
        const parentSegment = segments[segments.length - 2];
        return parentSegment.charAt(0).toUpperCase() + parentSegment.slice(1);
      }
      return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    }

    // 3. 如果是根路径或其他情况
    return path === '/' || path === '/home' ? '首页' : '未命名页面';
  };

  // 初始化添加首页标签
  useEffect(() => {
    if (tabs.length === 0) {
      const home = {
        key: '/home',
        label: '首页',
        path: '/home',
        closable: false,
        cached: true, // 首页始终缓存
      };
      setTabs([home]);

      // 如果当前就在首页，激活它
      if (location.pathname === '/home') {
        setActiveKey('/home');
      }
    }
  }, []);

  // 根据当前路径自动添加标签页
  useEffect(() => {
    const path = location.pathname;

    // 检查是否已有标签对应当前路径
    const existingTab = tabs.find((tab) => tab.path === path);
    if (existingTab) {
      setActiveKey(existingTab.key);
      return;
    }
    // 匹配路由获取标题信息
    const matched = matchRoutes(routes as RouteObject[], path);

    let matchedRoute = null;
    if (matched && matched.length > 0) {
      matchedRoute = matched[matched.length - 1].route;
    }

    // 获取标题
    const title = getRouteTitle(path, matchedRoute);

    // 创建新标签
    const newTab = {
      key: path,
      label: title,
      path,
      closable: path !== '/home',
      cached: true, // 默认开启缓存
    };

    // 添加到标签列表
    setTabs((prev) => [...prev, newTab]);
    setActiveKey(path);
  }, [location.pathname, routes]);

  // 添加标签页
  const addTab = (tab: TabItem) => {
    // 检查是否已存在
    setTabs((prev) => {
      const existingTabIndex = prev.findIndex((item) => item.path === tab.path);
      if (existingTabIndex !== -1) {
        // 如果标签已存在，仅激活它
        setActiveKey(prev[existingTabIndex].key);
        return prev;
      }
      return [...prev, { ...tab, cached: tab.cached !== false }]; // 默认缓存
    });
    setActiveKey(tab.key);
  };

  // 移除标签页
  const removeTab = (targetKey: string) => {
    // 不能删除所有标签
    if (tabs.length === 1) {
      return;
    }

    setTabs((prev) => {
      const index = prev.findIndex((tab) => tab.key === targetKey);
      if (index === -1) return prev;

      // 清理要删除的标签页的组件缓存
      const targetTab = prev[index];
      if (targetTab.component) {
        targetTab.component = undefined;
      }

      const newTabs = prev.filter((tab) => tab.key !== targetKey);

      // 如果删除的是当前标签，需要激活其他标签
      if (targetKey === activeKey && newTabs.length) {
        const nextActiveKey = index === 0 ? newTabs[0].key : newTabs[index - 1].key;
        setActiveKey(nextActiveKey);
        navigate(newTabs[index === 0 ? 0 : index - 1].path);
      }

      return newTabs;
    });
  };

  // 设置活动标签
  const setActiveTab = (key: string) => {
    const targetTab = tabs.find((tab) => tab.key === key);
    if (targetTab) {
      // 切换标签时，清理非活动标签的组件缓存
      tabs.forEach((tab) => {
        if (tab.key !== key && tab.component && !tab.cached) {
          tab.component = undefined;
        }
      });
      setActiveKey(key);
      navigate(targetTab.path);
    }
  };

  // 移除其他标签
  const removeOthers = (targetKey: string) => {
    setTabs((prev) => {
      // 清理要删除的标签页的组件缓存
      prev.forEach((tab) => {
        if (tab.key !== targetKey && tab.closable && tab.component) {
          tab.component = undefined;
        }
      });
      return prev.filter((tab) => !tab.closable || tab.key === targetKey);
    });
    setActiveKey(targetKey);
  };

  // 移除所有标签
  const removeAll = () => {
    const homeTab = tabs.find((tab) => !tab.closable);
    if (homeTab) {
      // 清理所有可关闭标签的组件缓存
      tabs.forEach((tab) => {
        if (tab.closable && tab.component) {
          tab.component = undefined;
        }
      });
      setTabs([homeTab]);
      setActiveKey(homeTab.key);
      navigate(homeTab.path);
    } else if (tabs.length) {
      // 如果没有不可关闭的标签，保留第一个
      const firstTab = tabs[0];
      // 清理其他标签的组件缓存
      tabs.slice(1).forEach((tab) => {
        if (tab.component) {
          tab.component = undefined;
        }
      });
      setTabs([{ ...firstTab, closable: false }]);
      setActiveKey(firstTab.key);
      navigate(firstTab.path);
    }
  };

  return (
    <TabsContext.Provider
      value={{
        activeKey,
        tabs,
        addTab,
        removeTab,
        setActiveTab,
        removeOthers,
        removeAll,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};

// 使用上下文的钩子
export const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
};
