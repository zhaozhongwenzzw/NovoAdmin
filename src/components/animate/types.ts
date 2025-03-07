/**
 * 动画类型枚举 - 包含常见动画效果
 */
export enum AnimationType {
  DEFAULT = 'default', // 默认
  // 基础动画
  FADE_IN = 'fadeIn', // 淡入
  FADE_OUT = 'fadeOut', // 淡出
  SLIDE_IN_LEFT = 'slideInL', // 左侧滑入
  SLIDE_OUT_LEFT = 'slideOutL', // 左侧滑出
  SLIDE_IN_RIGHT = 'slideInR', // 右侧滑入
  SLIDE_OUT_RIGHT = 'slideOutR', // 右侧滑出
  SLIDE_IN_TOP = 'slideInT', // 顶部滑入
  SLIDE_OUT_TOP = 'slideOutT', // 顶部滑出
  SLIDE_IN_BOTTOM = 'slideInB', // 底部滑入
  SLIDE_OUT_BOTTOM = 'slideOutB', // 底部滑出

  // // 物理效果动画
  BOUNCE = 'bounce', // 弹跳
  BOUNCE_IN = 'bounceIn', // 弹跳进入
  BOUNCE_OUT = 'bounceOut', // 弹跳退出
  SPRING = 'spring', // 弹簧效果

  // // 变形动画
  SCALE_IN = 'scaleIn', // 缩放进入
  SCALE_OUT = 'scaleOut', // 缩放退出
  ROTATE_CW = 'rotateCW', // 顺时针旋转
  ROTATE_CCW = 'rotateCCW', // 逆时针旋转
  FLIP_X = 'flipX', // X轴翻转
  FLIP_Y = 'flipY', // Y轴翻转

  // // 特殊效果
  GLOW = 'glow', // 发光效果
  BLUR = 'blur', // 模糊过渡
  NEON = 'neon', // 霓虹效果
  GLITCH = 'glitch', // 故障效果

  // // 组合动画
  ZOOM_SLIDE = 'zoomSlide', // 缩放+滑动组合
  SPIN_FADE = 'spinFade', // 旋转+淡入淡出
  BOUNCE_SLIDE = 'bounceSlide', // 弹跳+滑动

  // // 3D效果
  PERSPECTIVE = 'perspective', // 3D透视
  DEPTH = 'depth', // 深度移动
}

// 动画配置接口
export interface AnimationConfig {
  duration?: number; // 动画持续时间
  delay?: number; // 延迟时间
  ease?: number[] | string; // 缓动函数
  stiffness?: number; // 弹性刚度
  damping?: number; // 阻尼
  mass?: number; // 质量
  repeat?: number; // 重复次数
  repeatType?: 'loop' | 'reverse' | 'mirror'; // 重复类型
}
