import { Variants, Transition } from 'framer-motion';
import { AnimationConfig } from './types';

interface AnimateVariant {
  animate?: {
    transition?: Transition;
    [key: string]: any;
  };
  exit?: {
    transition?: Transition;
    [key: string]: any;
  };
}

/**
 * 修改预设动画的配置
 * @param variant 预设的动画变体
 * @param config 要修改的配置
 */
export const createTransition = (variant: AnimateVariant, config: Partial<AnimationConfig>): Variants => {
  // 深拷贝 variant 对象
  const newVariant = JSON.parse(JSON.stringify(variant));

  // 更新 animate 的配置
  if (newVariant.animate?.transition) {
    newVariant.animate.transition = {
      ...newVariant.animate.transition,
      ...config,
    };
  }

  // 更新 exit 的配置
  if (newVariant.exit?.transition) {
    newVariant.exit.transition = {
      ...newVariant.exit.transition,
      ...config,
    };
  }

  return newVariant as Variants;
};
