module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档修改
        'style', // 代码格式修改不影响代码功能
        'refactor', // 代码重构
        'perf', // 优化相关，提升性能体验
        'test', // 测试用例修改
        'chore', // 其他改动
        'revert', // 回滚到上一个版本
        'build', // 编译相关修改
        'ci', // CI配置文件和脚本的修改
      ],
    ],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
  },
};
