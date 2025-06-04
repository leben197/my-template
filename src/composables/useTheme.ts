import { useDark, useStorage, useToggle } from "@vueuse/core";

export type Theme = "light" | "dark" | "green";

export function useTheme() {
  const isDark = useDark();
  const toggleDark = useToggle(isDark);

  // 存储当前主题到localStorage
  const currentTheme = useStorage<Theme>("app-theme", "light");

  // 应用主题到HTML元素
  const applyTheme = (theme: Theme) => {
    document.documentElement.classList.remove("light", "dark", "green");
    document.documentElement.classList.add(theme);
    currentTheme.value = theme;

    // 如果是深色模式，需要触发useDark的设置
    if (theme === "dark") {
      isDark.value = true;
    } else {
      isDark.value = false;
    }
  };

  // 切换主题
  const setTheme = (theme: Theme) => {
    applyTheme(theme);
  };

  // 初始化主题
  const initTheme = () => {
    applyTheme(currentTheme.value);
  };

  return {
    currentTheme,
    isDark,
    toggleDark,
    setTheme,
    initTheme,
  };
}
