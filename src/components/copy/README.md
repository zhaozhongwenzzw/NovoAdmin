# Copy 复制组件

一个功能完整的文本复制组件，支持多种样式和配置选项。

## 特性

- 🎯 **简单易用** - 一键复制任意文本内容
- 🎨 **多种样式** - 支持 Ant Design 的所有按钮类型
- 📱 **兼容性好** - 自动降级到传统复制方案
- ⚡ **反馈及时** - 复制状态实时反馈
- 🔧 **高度可配置** - 丰富的配置选项
- 💡 **TypeScript** - 完整的类型定义

## 基础用法

```tsx
import Copy from '@/components/copy';

// 基础用法
<Copy text="要复制的文本内容">复制</Copy>

// 主要按钮样式
<Copy text="Hello World!" type="primary">复制文本</Copy>

// 不显示图标
<Copy text="Hello World!" showIcon={false}>复制</Copy>
```

## 高级用法

```tsx
// 带回调函数
<Copy 
  text="复制内容"
  onCopySuccess={() => console.log('复制成功!')}
  onCopyError={(error) => console.error('复制失败:', error)}
>
  复制并处理结果
</Copy>

// 静态方法直接复制
const handleCopy = async () => {
  const success = await Copy.copyText('要复制的文本');
  if (success) {
    console.log('复制成功');
  }
};
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| text | 要复制的文本内容 | `string` | - |
| type | 按钮类型 | `'primary' \| 'default' \| 'dashed' \| 'link' \| 'text'` | `'default'` |
| size | 按钮大小 | `'large' \| 'middle' \| 'small'` | `'middle'` |
| showIcon | 是否显示复制图标 | `boolean` | `true` |
| children | 按钮文本 | `React.ReactNode` | `'复制'` |
| className | 自定义样式类名 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| tooltip | 提示文本 | `string` | `'点击复制'` |
| onCopySuccess | 复制成功回调 | `() => void` | - |
| onCopyError | 复制失败回调 | `(error: Error) => void` | - |

### 静态方法

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| Copy.copyText | 直接复制文本 | `(text: string) => Promise<boolean>` |

## 样式定制

组件使用 styled-components 构建，支持通过 className 进行样式定制：

```tsx
<Copy 
  text="自定义样式"
  className="my-copy-button"
  type="primary"
>
  自定义复制按钮
</Copy>
```

```css
.my-copy-button {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

## 注意事项

1. **安全上下文**: 在 HTTPS 环境下会使用现代的 `navigator.clipboard` API
2. **降级方案**: 在不支持的环境下会自动降级到 `document.execCommand`
3. **权限处理**: 某些浏览器可能需要用户授权才能使用剪贴板功能
4. **错误处理**: 建议使用 `onCopyError` 回调处理复制失败的情况

## 浏览器兼容性

- Chrome 66+
- Firefox 63+
- Safari 13.1+
- Edge 79+
- IE 11+ (降级方案)