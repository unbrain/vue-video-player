module.exports = {
  root: true,
  env: {
    "node": true
  },
  extends: [
    'plugin:vue/essential',
    "plugin:prettier/recommended",
    'eslint:recommended',
  ],
  rules: {
    "prettier/prettier": ["warn", {}, {
      "usePrettierrc": true
    }],
    // "vue/no-side-effects-in-computed-properties": "warn",
    // "vue/return-in-computed-property": "warn",
    // "vue/no-side-effects-in-computed-properties": "warn",
    // "vue/no-unused-vars": "warn",
    // "no-undef": ["warn"],
    // "no-empty": ["warn"],
    // "no-console": ["warn"],
    // "no-useless-escape": ["warn"],
    // "no-redeclare": ["warn"],
    // "no-dupe-keys": ["warn"],
    // "vue/no-side-effects-in-computed-properties": "off",
    // "vue/return-in-computed-property": "off",
    // "vue/no-side-effects-in-computed-properties": "off",
    // "vue/no-unused-vars": "off",
    // "no-undef": ["off"],
    // "no-empty": ["off"],
    // "no-console": ["off"],
    // "no-useless-escape": ["off"],
    // "no-redeclare": ["off"],
    // "no-dupe-keys": ["off"],
    // "no-unused-vars": ["off"],
    // "no-control-regex": ["off"],
    // "no-mixed-spaces-and-tabs": ["off"],
    // "eslint-no-useless-escape": ["off"], //转义字符通知
    // "multiline-ternary": ["error", "always-multiline"], //三元运算符可换行
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
