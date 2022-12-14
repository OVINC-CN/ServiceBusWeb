/**
 * @file eslint config
 * @author
 */

module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
    'vue/setup-compiler-macros': true,
  },
  extends: ['plugin:vue/vue3-strongly-recommended'],
  rules: {
    'vue/no-side-effects-in-computed-properties': 'off',
    'vue/multi-word-component-names': 'off',
    'max-len': 'off',
  },
};
