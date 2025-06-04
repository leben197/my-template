module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-standard-scss",
    "stylelint-config-recommended-vue/scss",
    "stylelint-config-prettier",
  ],
  rules: {
    "selector-class-pattern": null, // 允许任意类名格式
    "no-descending-specificity": null, // 不检查特异性降序
    "scss/at-import-partial-extension": null, // 允许 @import 时带扩展名
    "font-family-no-missing-generic-family-keyword": null, // 不要求通用字体族名
    "selector-pseudo-element-no-unknown": [
      true,
      {
        ignorePseudoElements: ["v-deep", ":deep"],
      },
    ],
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["deep"],
      },
    ],
  },
};
