export const ease = {
  smooth: [0.4, 0, 0.2, 1],
  spring: [0.43, 0.13, 0.23, 0.96],
  bounce: [0.68, -0.55, 0.265, 1.55],
};

export const transition = {
  duration: 0.3,
  ease: ease.smooth,
};

export const defaultConfig = {
  duration: 0.3,
  smooth: ease.smooth,
  spring: ease.spring,
  bounce: ease.bounce,
};
