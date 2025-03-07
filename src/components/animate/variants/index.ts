import { basicAnimations } from './basicAnimations';
import { physicsAnimations } from './physicsAnimations';
import { transformAnimations } from './transformAnimations';
import { specialEffects } from './specialEffects';
import { combinedAnimations } from './combinedAnimations';
import { threeDEffects } from './threeDEffects';
import { Variants } from 'framer-motion';
import { AnimationType } from '../types';
// 合并所有动画
export const variants: Record<AnimationType, Variants> = {
  ...basicAnimations,
  ...physicsAnimations,
  ...transformAnimations,
  ...specialEffects,
  ...combinedAnimations,
  ...threeDEffects,
} as Record<AnimationType, Variants>;

//获取动画类型
export const getAnimationType = (animation: AnimationType) => {
  return variants[animation];
};

//页面可用的动画类型
export const pageVariants: Record<AnimationType, Variants> = {
  ...basicAnimations,
  ...physicsAnimations,
  ...transformAnimations,
  ...combinedAnimations,
  ...threeDEffects,
} as Record<AnimationType, Variants>;
