module.exports = {
  extends: [
    'universe',
    'universe/shared/typescript-analysis',
    'plugin:react/recommended',
  ],

  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
}
