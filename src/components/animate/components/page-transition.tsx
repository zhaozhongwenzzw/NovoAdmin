import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { pageVariants } from '../variants';
import { AnimationType } from '../types';
import { useFlattenMenus } from '@/router/hooks/user-permission-route';
import { useRef, useEffect } from 'react';
import { createTransition } from '../useAnimate';
// 根据路由路径选择动画

export const PageTransition = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const flattenMenus = useFlattenMenus();
  const currentMenu = flattenMenus.find((menu) => menu.path === location.pathname);

  // 使用 ref 保存前一个页面的退出动画配置
  const prevExitRef = useRef(currentMenu?.outAnimation || AnimationType.DEFAULT);

  // 当路由变化时更新前一个页面的退出动画
  useEffect(() => {
    prevExitRef.current = currentMenu?.outAnimation || AnimationType.DEFAULT;
  }, [location.pathname]);

  // 分别获取进入和退出动画
  const animateType = currentMenu?.inAnimation || AnimationType.DEFAULT;
  const exitType = prevExitRef.current;
  const { initial, animate } = createTransition(pageVariants[animateType], {
    duration: 0.3,
  });
  const { exit } = createTransition(pageVariants[exitType], {
    duration: 0.3,
  });
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial,
        animate,
        exit,
      }}
      className="size-full"
    >
      {children}
    </motion.div>
  );
};
