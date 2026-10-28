const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');

module.exports = [
  ...expoConfig,
  prettierConfig,
  {
    ignores: ['dist/*', 'coverage/*', '.expo/*', 'android/*', 'ios/*'],
  },
];
