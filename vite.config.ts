import vue from '@vitejs/plugin-vue';
import path from "path";
import mobile from "postcss-mobile-forever";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig, loadEnv } from "vite";
import eslintPlugin from "vite-plugin-eslint";
import stylelintPlugin from "vite-plugin-stylelint";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // const root = process.cwd();

  const { VITE_NODE_ENV } = env;
  return {
    plugins: [
      vue(),
      UnoCSS(),
      AutoImport({
        imports: ["vue", "vue-router", "@vueuse/core", "pinia"],
        dts: "types/auto-imports.d.ts", // 使用typescript，需要指定生成对应的d.ts文件或者设置为true,生成默认导入d.ts文件
        dirs: ["src/stores", "src/composables", "src/hooks"],
      }),
      vueDevTools(),
      eslintPlugin({
        include: ["src/**/*.js", "src/**/*.ts", "src/**/*.vue"],
        cache: false,
        fix: true, // 自动修复
        overrideConfigFile: path.resolve(__dirname, ".eslintrc.cjs"), // 明确指定配置文件路径
      }),
      stylelintPlugin({
        include: ["src/**/*.css", "src/**/*.scss", "src/**/*.vue"],
        fix: true, // 自动修复样式问题
        cache: false,
        configFile: path.resolve(__dirname, ".stylelintrc.cjs"), // 明确指定配置文件路径
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    css: {
      // css预处理器
      preprocessorOptions: {
        scss: {
          // 引入 mixin.scss 这样就可以在全局中使用 mixin.scss中预定义的变量了
          // 给导入的路径最后加上 ;
          additionalData: '@import "@/assets/style/mixin.scss";',
        },
      },
      postcss: {
        plugins: [
          mobile({
            // <---- 这里
            rootSelector: "#app",
            viewportWidth: 750,
            border: false,
            maxDisplayWidth: 750,
          }),
        ],
      },
    },

    server: {
      host: "0.0.0.0",
    },
  };
});
