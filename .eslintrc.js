module.exports = {
  globals: {
    setTimeout: true,
    setInterval: true,
    process: true,
    clearInterval: true,
    window: true,
    Intl: true,
  },
  extends: [
    'universe',
    'universe/shared/typescript-analysis',
    'plugin:react/recommended',
  ],

  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
  },

  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
}
