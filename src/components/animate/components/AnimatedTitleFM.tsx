// AnimatedTitleFM.tsx

// 1. 确保 React 和 framer-motion 的导入是正确的
import React, { useEffect, useRef } from 'react';
import {
  motion,
  useAnimationControls,
  type Variants,
  type AnimationControls
} from 'framer-motion';

// 我们不再需要导入任何 .css 文件了！

// Props 类型定义保持不变
interface AnimatedTitleProps {
  text?: string;
}

const AnimatedTitleFM: React.FC<AnimatedTitleProps> = ({
  text = 'Tailwind Rocks' // 换个新默认值庆祝一下！
}) => {
  const controls: AnimationControls = useAnimationControls();
  const isMounted = useRef(true);

  // --- 动画变体和 useEffect 逻辑完全保持不变 ---
  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.045 },
    },
  };

  const letterVariants: Variants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 15 },
    },
  };

  useEffect(() => {
    isMounted.current = true;
    const sequence = async () => {
      while (isMounted.current) {
        await controls.start('visible');
        if (!isMounted.current) break;
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!isMounted.current) break;
        await controls.start({ opacity: 0, transition: { duration: 1, ease: 'easeOut' } });
        if (!isMounted.current) break;
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!isMounted.current) break;
        controls.set('hidden');
      }
    };
    sequence();
    return () => {
      isMounted.current = false;
    };
  }, [controls]);

  // --- JSX 渲染部分：应用 Tailwind CSS 类 ---
  return (
    <motion.h1
      className="relative font-extralight text-6xl text-gray-800"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      <span
        // 使用 Tailwind 的 JIT (Just-In-Time) 模式的任意值来实现精确的 em 单位内边距
        className="relative inline-block overflow-hidden pt-[0.2em] pr-[0.05em] pb-[0.1em]"
      >
        <span className="letters-container"> {/* 这个 span 只是一个容器，不需要特定样式 */}
          {text.split('').map((char) => {
            if (/\S/.test(char)) {
              return (
                <motion.span
                  key={char}
                  variants={letterVariants}
                  // 这里是字母的样式
                  className="inline-block origin-bottom leading-none"
                >
                  {char}
                </motion.span>
              );
            }
            return <React.Fragment key={char}> </React.Fragment>;
          })}
        </span>
      </span>
    </motion.h1>
  );
};

export default AnimatedTitleFM;
