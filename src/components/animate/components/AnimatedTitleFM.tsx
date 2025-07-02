// AnimatedTitleFM.tsx

import React, { useEffect, useRef } from 'react';
import {
  motion,
  useAnimationControls,
  type Variants,
  type AnimationControls
} from 'framer-motion';

// Props 类型定义保持不变
interface AnimatedTitleProps {
  text?: string;
}

const AnimatedTitleFM: React.FC<AnimatedTitleProps> = ({
  text = 'Looping Animation' // 更新默认值
}) => {
  const controls: AnimationControls = useAnimationControls();
  const isMounted = useRef(true);

  // --- 动画变体 (无变化) ---
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
        // 1. 动画显示文本
        await controls.start('visible');
        if (!isMounted.current) break;

        // 文本完全显示后停留1秒
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!isMounted.current) break;

        // 2. 动画文本淡出
        await controls.start({ opacity: 0, transition: { duration: 1, ease: 'easeOut' } });
        if (!isMounted.current) break;

        // 文本淡出后，在重置为 hidden 之前短暂停留0.5秒
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!isMounted.current) break;

        // 3. 立即重置文本到初始隐藏状态（无动画）
        controls.set('hidden');
        if (!isMounted.current) break; // 再次检查，确保在下一次循环开始前组件仍然挂载

        // 【核心优化】在文本完全隐藏后，等待一段时间再开始下一轮循环
        // 这会给动画一个明确的“休息”时间，让循环感更强
        await new Promise(resolve => setTimeout(resolve, 1500)); // 例如，等待1.5秒
        if (!isMounted.current) break;
      }
    };
    sequence();

    return () => {
      isMounted.current = false;
    };
  }, [controls]);

  // --- JSX 渲染部分 ---
  return (
    <motion.h1
      className="relative font-extralight text-6xl text-gray-800"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      <span
        className="relative inline-block overflow-hidden pt-[0.2em] pr-[0.05em] pb-[0.1em]"
      >
        <span>
          {text.split('').map((char, index) => { // 【优化】将 key 从 char 改为 index
            if (/\S/.test(char)) {
              return (
                <motion.span
                  key={`${index}-${char}`} // 更好的 key 值，确保唯一性
                  variants={letterVariants}
                  className="inline-block origin-bottom leading-none"
                >
                  {char}
                </motion.span>
              );
            }
            return <React.Fragment key={`${index}-${char}`}> </React.Fragment>; // 对应 key 的修改
          })}
        </span>
      </span>
    </motion.h1>
  );
};

export default AnimatedTitleFM;
