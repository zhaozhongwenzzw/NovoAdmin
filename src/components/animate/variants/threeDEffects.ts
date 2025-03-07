import { Variants } from 'framer-motion';
import { AnimationType } from '../types';

export const threeDEffects: Partial<Record<AnimationType, Variants>> = {
  [AnimationType.PERSPECTIVE]: {
    initial: {
      opacity: 0,
      rotateX: 35,
      rotateY: -25,
      scale: 0.85,
      z: -250,
      transformPerspective: 1200,
      transformOrigin: 'center',
    },
    animate: {
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      z: 0,
      transition: {
        duration: 0.7,
        ease: [0.23, 1.13, 0.25, 1],
        opacity: {
          duration: 0.4,
          ease: 'easeOut',
        },
        scale: {
          type: 'spring',
          stiffness: 180,
          damping: 18,
        },
        rotateX: {
          type: 'spring',
          stiffness: 120,
          damping: 15,
        },
        rotateY: {
          type: 'spring',
          stiffness: 120,
          damping: 15,
        },
        z: {
          duration: 0.6,
          ease: 'easeOut',
        },
      },
    },
    exit: {
      opacity: 0,
      rotateX: -25,
      rotateY: 20,
      scale: 0.9,
      z: -150,
      transition: {
        duration: 0.5,
        ease: [0.33, 0.67, 0.83, 0.67],
      },
    },
  },
  [AnimationType.DEPTH]: {
    initial: {
      scale: 0.88,
      opacity: 0,
      z: -80,
      rotateX: 8,
      y: 15,
      transformPerspective: 1000,
    },
    animate: {
      scale: 1,
      opacity: 1,
      z: 0,
      rotateX: 0,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.34, 1.3, 0.64, 1],
        opacity: { duration: 0.35, ease: 'easeOut' },
        rotateX: { type: 'spring', stiffness: 100, damping: 12 },
      },
    },
    exit: {
      scale: 1.05,
      opacity: 0,
      z: 60,
      rotateX: -5,
      y: -12,
      transition: {
        duration: 0.4,
        ease: [0.36, 0, 0.66, -0.56],
        opacity: { duration: 0.25 },
      },
    },
  },
};
