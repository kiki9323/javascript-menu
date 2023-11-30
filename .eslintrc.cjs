module.exports = {
  env: {
    browser: true,
    es2021: true,
    // 'jest' is not defined 오류 방지
    jest: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended', 'jest'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // 들여쓰기 깊이 제한
    'max-depth': ['error', 2],
    // 함수의 매개변수 개수 제한
    'max-params': ['error', 3],
    // esm 사용을 위한 침묵
    'import/extensions': ['error', 'always', { ignorePackages: true }],
    // 함수의 길이 제한
    'max-lines-per-function': ['error', { max: 15 }],
    'prettier/prettier': ['error', { endOfLine: 'auto' }], // 공백 문자 호환 설정
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    eqeqeq: 'error',
    'no-console': 'warn',
    'no-dupe-args': 'error',
    'no-unreachable': 'error',
    'no-unused-vars': 'warn',
  },
  plugins: ['import'],
};
