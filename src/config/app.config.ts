export default {
  // 应用信息
  app: {
    name: "Vue3 Template",
    version: "1.0.0",
    description: "Vue3 + TypeScript + Vite 项目模板",
    logo: "/logo.png",
  },

  // 本地缓存配置
  storage: {
    prefix: "app_",
    expire: 7 * 24 * 60 * 60 * 1000, // 默认缓存期限为7天
  },

  // 主题配置
  theme: {
    primary: "#409eff",
    success: "#67c23a",
    warning: "#e6a23c",
    danger: "#f56c6c",
    info: "#909399",
  },

  // 布局配置
  layout: {
    // 侧边栏
    sidebar: {
      width: 220,
      collapsedWidth: 64,
    },
    // 头部
    header: {
      height: 60,
    },
  },

  // 权限配置
  auth: {
    // 路由白名单（不需要登录即可访问的路由）
    whiteList: ["/login", "/register", "/404", "/403"],
  },

  // 接口配置
  api: {
    // 接口超时时间
    timeout: 10000,
    // 接口错误码
    errorCode: {
      unauthorized: 401,
      forbidden: 403,
      notFound: 404,
      serverError: 500,
    },
  },
};
