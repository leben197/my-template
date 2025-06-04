<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>页面不存在</h2>
      <p>抱歉，您访问的页面不存在或已被删除</p>
      <button @click="goHome">返回首页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>

<style lang="scss" scoped>
.not-found {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;

  .content {
    text-align: center;

    h1 {
      font-size: 120px;
      margin: 0;
      color: #409eff;
    }

    h2 {
      font-size: 30px;
      margin: 0;
      margin-bottom: 20px;
    }

    p {
      color: #606266;
      margin-bottom: 30px;
    }

    button {
      padding: 10px 25px;
      background-color: #409eff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #66b1ff;
      }
    }
  }
}
</style>
