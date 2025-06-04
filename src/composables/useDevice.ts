import { breakpointsTailwind, useWindowSize } from "@vueuse/core";
import { computed } from "vue";

export function useDevice() {
  const { width } = useWindowSize();

  const isMobile = computed(() => width.value < breakpointsTailwind.md);
  const isTablet = computed(
    () =>
      width.value >= breakpointsTailwind.md &&
      width.value < breakpointsTailwind.lg
  );
  const isDesktop = computed(() => width.value >= breakpointsTailwind.lg);

  // 当前设备类型
  const deviceType = computed(() => {
    if (isMobile.value) return "mobile";
    if (isTablet.value) return "tablet";
    return "desktop";
  });

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceType,
    width,
  };
}
