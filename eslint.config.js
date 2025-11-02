import vueTypeScript from '@vue/eslint-config-typescript'
import love from 'eslint-config-love'
import pluginVue from 'eslint-plugin-vue'

export default [
  love,
  ...pluginVue.configs['flat/recommended'],
  ...vueTypeScript({
    supportedScriptLangs: {
      ts: true,
      tsx: true,
    },
  }),
  {
    files: ['**/*.vue'],
    rules: {
      // Vue-specific rules
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'off',

      // Allow Pug templates in Vue
      'vue/html-indent': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-self-closing': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    rules: {
      // Relaxed TypeScript rules
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/unified-signatures': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/prefer-destructuring': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      'max-lines': 'warn',
      'no-plusplus': 'off',
      'prefer-const': 'warn',
      'import/no-duplicates': 'error',
      'no-console': 'warn',
    },
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '*.d.ts',
      'vite.config.ts',
      'eslint.config.js',
      'postcss.config.js',
    ],
  },
]
