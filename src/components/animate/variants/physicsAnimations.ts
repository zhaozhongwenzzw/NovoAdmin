import { Variants } from 'framer-motion';
import { AnimationType } from '../types';
import { defaultConfig } from '../config';
// 物理效果动画 - 优化版
export const physicsAnimations: Partial<Record<AnimationType, Variants>> = {
  [AnimationType.BOUNCE]: {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.08, 0.95, 1.02, 1],
      transition: {
        duration: defaultConfig.duration * 1.2,
        ease: [0.25, 0.1, 0.25, 1], // 自定义缓动函数，更平滑
      },
    },
  },
  [AnimationType.BOUNCE_IN]: {
    initial: {
      scale: 0.3,
      opacity: 0,
    },
    animate: {
      scale: [0.3, 1.06, 0.97, 1.01, 1],
      opacity: [0, 1, 1, 1, 1],
      transition: {
        duration: defaultConfig.duration * 1.2,
        ease: [0.34, 1.56, 0.64, 1], // 优化的缓动曲线
      },
    },
  },
  [AnimationType.BOUNCE_OUT]: {
    initial: {
      scale: 1,
      opacity: 1,
    },
    exit: {
      scale: [1, 1.06, 0],
      opacity: [1, 1, 0],
      transition: {
        duration: defaultConfig.duration * 0.8, // 略微缩短退出时间
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  },
  [AnimationType.SPRING]: {
    initial: { scale: 0.85, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260, // 降低一点刚度
        damping: 20, // 增加阻尼
        mass: 0.9, // 稍微降低质量
        restSpeed: 0.1, // 控制停止阈值
        restDelta: 0.01,
      },
    },
  },
};
