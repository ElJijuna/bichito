import { createEslintConfig } from 'super-configs/eslint';
import eslintVitest from 'super-configs/eslint/vitest';

export default [
  ...createEslintConfig({
    runtime: 'browser',
    language: 'ts',
    typeChecked: true,
    ignores: ['dist/**', 'coverage/**', 'storybook-static/**'],
  }),
  ...eslintVitest,
];
