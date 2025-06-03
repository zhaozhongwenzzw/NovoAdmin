import React, { useState } from 'react';
import { message } from 'antd';
import styled from 'styled-components';

interface CopyProps {
  /**
   * 要复制的文本内容
   */
  text: string;

  children?: React.ReactNode;
  /**
   * 自定义样式类名
   */
  className?: string;
  /**
   * 复制成功回调
   */
  onCopySuccess?: () => void;
  /**
   * 复制失败回调
   */
  onCopyError?: (error: Error) => void;

}

const StyledCopyButton = styled('div')`
  display: inline-flex;
  align-items: center;
  gap: 4px;  
  
  &:hover{
   cursor: pointer;
  }

`;

const Copy: React.FC<CopyProps> = ({
  text,
  children = '复制',
  className = '',
  onCopySuccess,
  onCopyError
}) => {
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      // 使用现代的 Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // 降级方案：使用传统的 document.execCommand
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (!successful) {
          throw new Error('复制失败');
        }
      }
      
      message.success('复制成功！');
      onCopySuccess?.();     
      
    } catch (error) {
      const err = error as Error;
      message.error(err.message || '复制失败');
      onCopyError?.(err);
    } finally {
      setLoading(false);
    }
  };

  const buttonContent = (
    <StyledCopyButton
      className={`${className}`}
      onClick={handleCopy}
    >
      {children}
    </StyledCopyButton>
  );
  return buttonContent;
};

export default Copy;
export type { CopyProps };