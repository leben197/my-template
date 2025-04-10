import vue from '@vitejs/plugin-vue';
import path from "path";
// import postcsspxtoviewport from "postcss-px-to-viewport";
// import postCssPxToRem from "postcss-pxtorem"
import mobile from 'postcss-mobile-forever';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig, loadEnv } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // const root = process.cwd();

  const { VITE_NODE_ENV, VITE_APP_BASE_PATH } = env;
  return {

    plugins: [vue(), AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'pinia',
      ],
      dts: 'types/auto-imports.d.ts', // 使用typescript，需要指定生成对应的d.ts文件或者设置为true,生成默认导入d.ts文件
      dirs: ['src/stores', 'src/composables', 'src/hooks'],
    }), vueDevTools()],
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
          // postcsspxtoviewport({
          //   unitToConvert: "px", // 要转化的单位
          //   viewportWidth: 750, // UI设计稿的宽度
          //   unitPrecision: 6, // 转换后的精度，即小数点位数
          //   propList: ["*"], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
          //   viewportUnit: "vw", // 指定需要转换成的视窗单位，默认vw
          //   fontViewportUnit: "vw", // 指定字体需要转换成的视窗单位，默认vw
          //   selectorBlackList: ["ignore-"], // 指定不转换为视窗单位的类名，
          //   minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
          //   mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
          //   replace: true, // 是否转换后直接更换属性值
          //   // exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
          //   exclude: [],
          //   landscape: false, // 是否处理横屏情况
          // }),
          // postCssPxToRem({
          //   rootValue: 75, // 1rem的大小
          //   propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
          // })
          mobile({ // <---- 这里
            rootSelector: '#app',
            viewportWidth: 750,
            border: false,
            maxDisplayWidth: 750
          }),
        ],
      },
    },
    base: VITE_NODE_ENV === 'production' ? 'https://yjcmndzb.sanguosha.com/' : './',
    server: {
      host: "0.0.0.0",
    },
  }
})
