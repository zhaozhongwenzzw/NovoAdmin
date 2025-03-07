# 动画组件 (Animate)

动画组件提供了一系列预设的动画效果，可以应用于页面转场和元素动画。

## 使用示例

```tsx
import { Animate } from "@/components/animate";
import { AnimationType } from "@/components/animate/types";

const MyComponent = () => {
  return (
    <Animate type={AnimationType.PERSPECTIVE}>
      <div>这里的内容将应用透视动画</div>
    </Animate>
  );
}
```

## Props

| 属性      | 类型            | 默认值 | 描述       |
| --------- | --------------- | ------ | ---------- |
| type      | AnimationType   | -      | 动画类型   |
| config    | AnimationConfig | -      | 动画配置   |
| className | string          | -      | 自定义类名 |
| children  | ReactNode       | -      | 子元素     |

## 可用的动画类型

- PERSPECTIVE (透视效果)
- DEPTH (深度效果)
- 更多动画类型...
