import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [isPc, setIsPc] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsPc(window.innerWidth >= 768);
    };

    // 初始检测
    handleResize();

    // 添加窗口大小变化监听
    window.addEventListener('resize', handleResize);

    // 清理
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isPc };
};
