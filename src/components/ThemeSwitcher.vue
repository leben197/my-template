<template>
  <div class="theme-switcher">
    <div class="theme-options">
      <button
        class="theme-option"
        :class="{ active: currentTheme === 'light' }"
        title="浅色模式"
        @click="setTheme('light')"
      >
        <div class="i-carbon-sun text-2xl" />
      </button>
      <button
        class="theme-option"
        :class="{ active: currentTheme === 'dark' }"
        title="深色模式"
        @click="setTheme('dark')"
      >
        <div class="i-carbon-moon text-2xl" />
      </button>
      <button
        class="theme-option"
        :class="{ active: currentTheme === 'green' }"
        title="绿色模式"
        @click="setTheme('green')"
      >
        <div class="i-carbon-tree text-2xl" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";

const { currentTheme, setTheme } = useTheme();

// 组件加载时初始化主题
onMounted(() => {
  // 从localStorage读取已保存的主题
  const savedTheme = localStorage.getItem("app-theme");
  if (savedTheme) {
    setTheme(savedTheme as "light" | "dark" | "green");
  }
});
</script>

<style scoped>
.theme-switcher {
  display: inline-block;
}

.theme-options {
  display: flex;
  gap: 8px;
}

.theme-option {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--bg-soft);
  border: 1px solid var(--border-color);
}

.theme-option:hover {
  background-color: var(--bg-muted);
}

.theme-option.active {
  background-color: var(--primary-color);
  color: white;
}
</style>
