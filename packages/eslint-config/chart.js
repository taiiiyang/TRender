import { config as baseConfig } from './base.js'

export const config = baseConfig.append({
  rules: {
    'react-refresh/only-export-components': 'off',
    // vitest rule - use antfu built-in test/* prefix
    'test/consistent-test-it': 'error',
    'test/no-identical-title': 'error',
    'test/prefer-hooks-on-top': 'error',
  },
})
