import dayjs from 'dayjs';

/**
 * 随机生成n位的随机数
 * @param n 位数
 * @returns
 */
export function generateUniqueString(n: number): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const allowedChars = alphabet + alphabet.toUpperCase() + '0123456789';
  const set = new Set<string>();

  while (set.size < n) {
    const randomIndex = Math.floor(Math.random() * allowedChars.length);
    const randomChar = allowedChars.charAt(randomIndex);
    set.add(randomChar);
  }

  return Array.from(set).join('');
}

/** 获取当前时间 */
export const getCurrentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
