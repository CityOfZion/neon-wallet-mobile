const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const prettierRecommended = require('eslint-plugin-prettier/recommended')
const simpleImportSortPlugin = require('eslint-plugin-simple-import-sort')
const tseslint = require('typescript-eslint')
const jsoncPlugin = require('eslint-plugin-jsonc')
const jsoncParser = require('jsonc-eslint-parser')

module.exports = defineConfig([
  { ignores: ['dist/*', 'node_modules/*', 'out/*'] },

  expoConfig,
  prettierRecommended,

  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [...tseslint.configs.recommended],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },

  {
    plugins: {
      'simple-import-sort': simpleImportSortPlugin,
    },
    rules: {
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^react$', '^react-dom$'],
            ['^@?\\w'],
            ['^@/components/'],
            ['^@/helpers/'],
            ['^@/hooks/'],
            ['^@/layouts/'],
            ['^@/routes/'],
            ['^@/assets/'],
            ['^@[^/]+/[^/]+/'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.?(css)$'],
          ],
        },
      ],
    },
  },

  {
    rules: {
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'react/display-name': 'off',
      'react/jsx-boolean-value': ['warn', 'never'],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    },
  },

  {
    files: ['src/locales/**/*.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    plugins: {
      jsonc: jsoncPlugin,
    },
    rules: {
      'jsonc/sort-keys': [
        'error',
        {
          pathPattern: '^$',
          order: { type: 'asc' },
        },
        {
          pathPattern: '.*',
          order: { type: 'asc' },
        },
      ],
    },
  },
])
