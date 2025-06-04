import preloadDirective from "@/directives/preload";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
// const vConsole = new VConsole();
import router from "./router";

// 引入UnoCSS (修改为正确的虚拟导入)
import "virtual:uno.css";
// 引入主题样式
import "@/assets/style/theme.scss";
// 引入全局样式
import "@/assets/style/global.scss";

// 移动端浏览器调试工具(仅在开发模式下启用)
if (
  import.meta.env.DEV &&
  navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
) {
  const vConsole = await import("vconsole").then(
    (module) => new module.default()
  );
}

const pinia = createPinia();
const app = createApp(App);
app.use(router).use(pinia).directive("preload", preloadDirective).mount("#app");
