import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 className，并解决 Tailwind 类名冲突
 * @param inputs className 数组
 * @returns 合并后的 className 字符串
 * @example
 * cn('px-2 py-1', 'bg-red-500', { 'text-white': true, 'text-black': false })
 * // => 'px-2 py-1 bg-red-500 text-white'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
