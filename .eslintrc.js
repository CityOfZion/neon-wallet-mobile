module.exports = {
  extends: [
    'universe',
    'universe/shared/typescript-analysis',
    'plugin:react/recommended',
  ],

  rules: {
    'prettier/prettier': 'error',
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
