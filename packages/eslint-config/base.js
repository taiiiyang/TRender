import antfu from '@antfu/eslint-config'
import turboPlugin from 'eslint-plugin-turbo'

const antfuConfig = {
  formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks
     * By default uses Prettier
     */
    css: true,
    /**
     * Format HTML files
     * By default uses Prettier
     */
    html: true,
    /**
     * Format Markdown files
     * Supports Prettier and dprint
     * By default uses Prettier
     */
    markdown: 'prettier',
  },
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'double', // or 'double'
    semi: true,
  },
  rules: {
    'unused-imports/no-unused-imports': 'error',
    'no-inner-declarations': 'error',
    'react-refresh/only-export-components': 'off',
    'n/prefer-global/process': 0,
    'react-hooks-extra/no-direct-set-state-in-use-effect': 0,
    'no-extra-boolean-cast': 0,
  },
}

const userConfigs = [
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
]

// Default config without additional options
export const config = antfu(antfuConfig, userConfigs)

// Function to create config with additional antfu options
export function createConfig(additionalOptions = {}) {
  return antfu(
    {
      ...antfuConfig,
      ...additionalOptions,
    },
    userConfigs,
  )
}
