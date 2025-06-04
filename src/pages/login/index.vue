<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>系统登录</h1>
      </div>

      <div class="login-form">
        <div class="form-item">
          <label>用户名</label>
          <input
            type="text"
            v-model="form.username"
            placeholder="请输入用户名"
          />
        </div>

        <div class="form-item">
          <label>密码</label>
          <input
            type="password"
            v-model="form.password"
            placeholder="请输入密码"
          />
        </div>

        <div class="form-item">
          <button class="login-button" @click="handleLogin">登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter, useRoute } from "vue-router";

// 如果有用户状态管理，可以取消此注释
// import { useUserStore } from '@/stores/modules/user';
// const userStore = useUserStore();

const router = useRouter();
const route = useRoute();

const form = reactive({
  username: "",
  password: "",
});

// 处理登录
const handleLogin = async () => {
  if (!form.username || !form.password) {
    alert("请输入用户名和密码");
    return;
  }

  try {
    // 模拟登录成功
    // 实际项目中应使用 userStore.login(form.username, form.password)
    localStorage.setItem("token", "demo-token");

    // 获取重定向地址或跳转首页
    const redirectPath = (route.query.redirect as string) || "/home";
    router.replace(redirectPath);
  } catch (error) {
    console.error("登录失败", error);
  }
};
</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);

  .login-container {
    width: 400px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    padding: 30px;

    .login-header {
      text-align: center;
      margin-bottom: 30px;

      h1 {
        font-size: 24px;
        color: #333;
      }
    }

    .login-form {
      .form-item {
        margin-bottom: 20px;

        label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: #606266;
        }

        input {
          width: 100%;
          height: 40px;
          padding: 0 15px;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.2s;

          &:focus {
            outline: none;
            border-color: #409eff;
          }
        }

        .login-button {
          width: 100%;
          height: 40px;
          background-color: #409eff;
          border: none;
          border-radius: 4px;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.2s;

          &:hover {
            background-color: #66b1ff;
          }
        }
      }
    }
  }
}
</style>
