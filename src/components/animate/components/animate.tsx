import { motion, type Variants } from 'framer-motion';
import { type ReactNode, useMemo } from 'react';
import { variants } from '../variants';
import { AnimationType, type AnimationConfig } from '../types';
import { createTransition } from '../useAnimate';
// 根据路由路径选择动画

interface AnimateProps {
  children: ReactNode;
  type?: AnimationType; // 单个动画类型
  enter?: AnimationType; // 进入动画
  exit?: AnimationType; // 退出动画
  config?: Partial<AnimationConfig>;
  className?: string;
  variants?: Variants; // 自定义动画变体
}

export const Animate = ({ children, type, enter, exit, config = {}, className = 'size-full', variants: customVariants }: AnimateProps) => {
  const animationVariants = useMemo(() => {
    if (customVariants) return customVariants;

    if (type) {
      return createTransition(variants[type], config);
    }

    const enterVariant = variants[enter || AnimationType.DEFAULT];
    const exitVariant = variants[exit || AnimationType.DEFAULT];

    return {
      initial: enterVariant.initial,
      animate: enterVariant.animate,
      exit: exitVariant.exit,
    };
  }, [type, enter, exit, config, customVariants]);

  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={animationVariants} className={className}>
      {children}
    </motion.div>
  );
};
