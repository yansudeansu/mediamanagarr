import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import storybook from 'eslint-plugin-storybook'
import vueParser from 'vue-eslint-parser'

export default defineConfig(
  {
    ignores: ['dist/**', 'coverage/**', 'storybook-static/**'],
  },

  js.configs.recommended,

  tseslint.configs.recommended,

  vue.configs['flat/recommended'],

  {
    files: ['**/*.vue'],
    extends: [
      ...tseslint.configs.recommended.map((config) => ({
        ...config,
        files: ['**/*.vue'],
      })),
    ],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
  },

  {
    files: ['src/components/atoms/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },

  storybook.configs['flat/recommended'],

  prettier,
)
