import { Variants } from 'framer-motion';
import { AnimationType } from '../types';

export const specialEffects: Partial<Record<AnimationType, Variants>> = {
  [AnimationType.GLOW]: {
    initial: {
      filter: 'brightness(100%) drop-shadow(0 0 0 rgba(255,255,255,0))',
      scale: 1,
    },
    animate: {
      filter: ['brightness(100%) drop-shadow(0 0 0 rgba(255,255,255,0))', 'brightness(120%) drop-shadow(0 0 15px rgba(255,255,255,0.4))', 'brightness(100%) drop-shadow(0 0 0 rgba(255,255,255,0))'],
      scale: [1, 1.03, 1],
      transition: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse',
        repeatDelay: 0.5,
      },
    },
  },
  [AnimationType.BLUR]: {
    initial: {
      filter: 'blur(5px)',
      opacity: 0,
    },
    animate: {
      filter: 'blur(0px)',
      opacity: 1,
      transition: {
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1],
        filter: { duration: 0.4 },
        opacity: { duration: 0.3 },
      },
    },
    exit: {
      filter: 'blur(5px)',
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 1, 1],
        opacity: { duration: 0.2 },
      },
    },
  },
  [AnimationType.NEON]: {
    initial: {
      textShadow: '0 0 0px rgba(255,255,255,0)',
      color: 'rgba(255,255,255,0.5)',
    },
    animate: {
      textShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 8px rgba(255,255,255,0.7)', '0 0 15px rgba(255,255,255,0.4)', '0 0 20px rgba(255,255,255,0.2)'],
      color: ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.95)', 'rgba(255,255,255,0.8)'],
      transition: {
        duration: 2.5,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse',
        repeatDelay: 0.8,
      },
    },
  },
  [AnimationType.GLITCH]: {
    initial: {
      clipPath: 'inset(0 0 0 0)',
      filter: 'none',
      opacity: 1,
    },
    animate: {
      clipPath: ['inset(0 0 0 0)', 'inset(7% -5px 80% 0)', 'inset(80% 0 12% 0)', 'inset(15% 0 55% 0)', 'inset(0 0 0 0)'],
      filter: ['none', 'hue-rotate(70deg)', 'hue-rotate(-70deg)', 'none'],
      x: [0, -2, 2, -2, 0],
      opacity: [1, 0.92, 0.85, 0.92, 1],
      transition: {
        duration: 0.4,
        ease: 'steps(3)',
        repeat: Infinity,
        repeatDelay: 4,
      },
    },
  },
};
