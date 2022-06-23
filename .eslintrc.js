module.exports = {
  env: {
    es2021: true,
  },
  extends: ['universe/native', 'universe/shared/typescript-analysis'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'import/namespace': 'off',
  },
}
