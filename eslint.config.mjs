import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import playwrightPlugin from 'eslint-plugin-playwright';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import bddPlugin from './eslint/plugin-bdd.mjs';

export default defineConfig([
  {
    ignores: [
      'node_modules/',
      'test-results/',
      'playwright-report/',
      'blob-report/',
      'playwright/.cache/',
      '.features-gen/',
      'reports/',
      'allure-results/',
      'allure-report/',
      'log/',
      'logs/',
      '.env*',
      '!.env.example',
      '.vscode/*',
      '!.vscode/settings.json',
      'dist/',
      'scripts/',
      'gitActions/',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {
      js,
      import: importPlugin,
      playwright: playwrightPlugin,
      prettier: prettierPlugin,
      bdd: bddPlugin,
    },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',

      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: '@playwright/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'playwright-bdd',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@fixtures/**',
              group: 'internal',
            },
            {
              pattern: '@pages/**',
              group: 'internal',
            },
            {
              pattern: '@utils/**',
              group: 'internal',
            },
            {
              pattern: '@config/**',
              group: 'internal',
            },
            {
              pattern: '@resources/**',
              group: 'internal',
            },
            {
              pattern: '@type/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-unresolved': 'error',
      'import/no-duplicates': 'error',
      'import/no-unused-modules': 'error',

      'require-await': 'off',
      'no-return-await': 'error',
      'prefer-promise-reject-errors': 'error',

      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'consistent-return': 'error',
      'no-empty-pattern': 'off',
      'no-unused-expressions': 'error',
      'no-undef': 'off',

      'playwright/missing-playwright-await': 'error',
      'playwright/no-conditional-in-test': 'warn',
      'playwright/prefer-web-first-assertions': 'warn',
      'playwright/no-wait-for-timeout': 'off',
      'playwright/no-useless-await': 'warn',
    },
  },
  {
    files: ['**/*.steps.ts', '**/step-definitions/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          args: 'after-used',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      'bdd/step-order': 'error',
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
]);
