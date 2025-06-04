<template>
  <div class="home-page">
    <h1 :class="{ 'text-xl': isMobile, 'text-2xl': !isMobile }">首页</h1>
    <p>欢迎使用 Vue3 项目模板</p>

    <div
      class="feature-list"
      :class="{ 'grid-cols-1': isMobile, 'grid-cols-3': !isMobile }"
    >
      <div class="feature-item">
        <h3>TypeScript 支持</h3>
        <p>使用 TypeScript 提供类型安全</p>
      </div>
      <div class="feature-item">
        <h3>现代化工具链</h3>
        <p>Vite + ESLint + StyleLint + Prettier</p>
      </div>
      <div class="feature-item">
        <h3>组件自动导入</h3>
        <p>自动导入常用 API 和组件</p>
      </div>
    </div>

    <!-- 移动端专用内容 -->
    <div v-if="isMobile" class="mt-4 p-4 bg-warning-100 rounded-md">
      <p class="text-warning-700">您正在使用移动设备浏览本站</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDevice } from "@/composables/useDevice";

const { isMobile } = useDevice();
</script>

<style lang="scss" scoped>
.home-page {
  h1 {
    font-size: 28px;
    margin-bottom: 20px;

    @media (width <= 768px) {
      font-size: 24px;
    }
  }

  .feature-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 40px;

    @media (width <= 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .feature-item {
      background: var(--bg-base);
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgb(0 0 0 / 8%);

      @media (width <= 768px) {
        padding: 16px;
      }

      h3 {
        margin-top: 0;
        color: var(--primary-color);
      }
    }
  }
}
</style>
