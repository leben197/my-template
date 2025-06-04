import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// 自动导入所有页面路由模块
const modules = import.meta.glob("./modules/**/*.ts", { eager: true });

// 路由记录
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Root",
    redirect: "/home",
    component: () => import("@/layouts/default-layout.vue"),
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("@/pages/home/index.vue"),
        meta: {
          title: "首页",
          keepAlive: true,
          requiresAuth: false,
          showInMenu: true,
        },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/layouts/simple-layout.vue"),
    children: [
      {
        path: "",
        name: "LoginPage",
        component: () => import("@/pages/login/index.vue"),
        meta: {
          title: "登录",
          keepAlive: false,
          requiresAuth: false,
          showInMenu: false,
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/pages/error/404.vue"),
    meta: {
      title: "页面不存在",
      showInMenu: false,
    },
  },
];

// 动态添加路由模块
Object.values(modules).forEach((module: any) => {
  if (module.default) {
    routes[0].children?.push(...module.default);
  }
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = (to.meta.title as string) || "Vue3 App";

  // 权限验证
  if (to.meta.requiresAuth && !localStorage.getItem("token")) {
    next({ name: "Login", query: { redirect: to.fullPath } });
    return;
  }

  next();
});

export default router;
