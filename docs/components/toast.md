# 通知系统组件 (Toast)

通知系统组件用于在页面上显示临时的消息提示。

## 使用示例

```tsx
import { Toast } from "@/components/toast";

const MyComponent = () => {
  const showToast = () => {
    Toast.show('This is a toast message!');
  };

  return <button onClick={showToast}>Show Toast</button>;
}
```

## 方法

- `Toast.show(message: string, duration?: number)` - 显示一条通知
- `Toast.hide()` - 隐藏当前通知

## 配置

| 属性     | 类型   | 默认值 | 描述                 |
| -------- | ------ | ------ | -------------------- |
| duration | number | 3000   | 通知显示时长（毫秒） |
