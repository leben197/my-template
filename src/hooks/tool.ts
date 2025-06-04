import { ref } from 'vue';

export function useDebounce(fn: () => void, delay = 500) {
  let timer: string | number | NodeJS.Timeout | undefined;

  const debouncedFn = () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn();
    }, delay);
  };

  return debouncedFn;
}

// 定义 useThrottle 函数，接收一个回调函数和节流时间间隔（默认为 500ms）
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  // 用于存储定时器 ID
  const timer = ref<number | null>(null);
  // 存储上一次执行函数的时间戳
  const lastExecTime = ref<number>(0);

  // 返回一个新的函数，该函数会对传入的回调函数进行节流处理
  return (...args: Parameters<T>) => {
    const now = Date.now();
    // 计算距离上一次执行函数已经过去的时间
    const elapsed = now - lastExecTime.value;

    // 如果没有定时器且距离上次执行已经超过了节流时间间隔
    if (!timer.value && elapsed >= delay) {
      // 执行回调函数
      callback(...args);
      // 更新上一次执行时间
      lastExecTime.value = now;
    } else if (!timer.value) {
      // 如果没有定时器，但还未达到节流时间间隔
      timer.value = window.setTimeout(() => {
        // 执行回调函数
        callback(...args);
        // 更新上一次执行时间
        lastExecTime.value = Date.now();
        // 清空定时器
        timer.value = null;
      }, delay - elapsed);
    }
  };
}
