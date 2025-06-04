import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
    }),
    presetTypography(),
  ],
  transformers: [transformerVariantGroup()],
  theme: {
    colors: {
      // 定义基础颜色
      primary: "var(--primary-color)",
      success: "var(--success-color)",
      warning: "var(--warning-color)",
      error: "var(--error-color)",
      info: "var(--info-color)",
      // 定义背景色
      "bg-base": "var(--bg-base)",
      "bg-soft": "var(--bg-soft)",
      "bg-muted": "var(--bg-muted)",
      // 定义文本颜色
      "text-primary": "var(--text-primary)",
      "text-secondary": "var(--text-secondary)",
      "text-muted": "var(--text-muted)",
    },
  },
  shortcuts: {
    btn: "px-4 py-2 rounded-md inline-block cursor-pointer transition-all duration-200",
    "btn-primary": "btn bg-primary text-white hover:opacity-90",
    "btn-success": "btn bg-success text-white hover:opacity-90",
    "btn-warning": "btn bg-warning text-white hover:opacity-90",
    "btn-error": "btn bg-error text-white hover:opacity-90",
    center: "flex items-center justify-center",
  },
});
