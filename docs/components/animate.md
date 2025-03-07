# 动画组件 (Animate)

提供流畅的页面过渡和元素动画效果，支持30+种预设动画类型，可自定义动画参数。

## 功能特性
- 预设多种动画类型
- 支持交互动画触发
- 动画队列管理
- 响应式动画配置
- 性能优化（自动开启硬件加速）

## 使用示例

```tsx
import { Animate, AnimationType } from "@/components/animate";

// 基础使用
function PageTransition() {
  return (
    <Animate 
      type={AnimationType.ZOOM_IN}
      duration={800}
      delay={200}
    >
      <div>页面内容</div>
    </Animate>
  );
}

// 交互动画
function InteractiveDemo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Animate
      type={AnimationType.BOUNCE}
      trigger="hover"
      active={isHovered}
      onStart={() => console.log('动画开始')}
    >
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        悬停触发动画
      </div>
    </Animate>
  );
}
```

## Props 配置

| 属性            | 类型                      | 默认值          | 说明                                                                 |
|-----------------|---------------------------|-----------------|--------------------------------------------------------------------|
| type            | AnimationType             | FADE            | 动画类型（见下方类型表）                                              |
| duration        | number                    | 500             | 动画持续时间（毫秒）                                                 |
| delay           | number                    | 0               | 动画延迟时间（毫秒）                                                 |
| trigger         | 'mount' \| 'hover' \| 'click' | 'mount'      | 动画触发方式                                                        |
| loop            | boolean \| number         | false           | 是否循环播放（true无限循环，数字指定循环次数）                          |
| easing          | string                    | 'ease-in-out'   | 动画缓动函数                                                        |
| active          | boolean                   | true            | 控制动画状态（配合trigger使用）                                       |

## 动画类型表

```ts
enum AnimationType {
  // 渐显类
  FADE = 'fade',          // 渐显
  FADE_UP = 'fade-up',    // 上浮渐显
  
  // 缩放类  
  ZOOM_IN = 'zoom-in',    // 放大进入
  ZOOM_OUT = 'zoom-out',  // 缩小退出
  
  // 滑动类
  SLIDE_LEFT = 'slide-left',  // 左侧滑入
  SLIDE_RIGHT = 'slide-right',
  
  // 特殊效果
  FLIP = 'flip',          // 翻转效果
  BOUNCE = 'bounce',      // 弹跳效果
  SPIN = 'spin',          // 旋转效果
  
  // 组合动画
  FADE_SLIDE_LEFT = 'fade-slide-left' // 组合动画
}
```

## 高级用法

### 自定义动画参数
```tsx
<Animate
  type={AnimationType.FADE}
  config={{
    duration: 1000,
    easing: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
    delay: 300,
    iterations: 3
  }}
>
  <div>自定义动画</div>
</Animate>
```

### 动画队列控制
```tsx
const animationQueue = useAnimateQueue([
  { type: AnimationType.FADE_UP },
  { type: AnimationType.SLIDE_RIGHT, delay: 200 },
  { type: AnimationType.BOUNCE, duration: 1000 }
]);

return (
  <div>
    {animationQueue.map((props, index) => (
      <Animate key={index} {...props}>
        <div>元素 {index + 1}</div>
      </Animate>
    ))}
  </div>
);
```

## 最佳实践
1. 页面转场动画建议持续时间在300-500ms之间
2. 复杂动画建议使用`useAnimate` hook进行细粒度控制
3. 移动端使用需注意性能，避免同时触发过多动画
4. 优先使用CSS动画，复杂效果可结合Web Animation API
