module.exports = {
  root: false,
  env: { browser: true, es2022: true, node: true },
  parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },
  settings: { react: { version: 'detect' } },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  plugins: ['react'],
  rules: {
    // This project relies on React 17+ automatic JSX transform; React import isn't required
    'react/react-in-jsx-scope': 'off',
    // We don't use prop-types in most components; disable to reduce noise during cleanup
    'react/prop-types': 'off',
    // Keep unknown DOM property errors to surface real JSX attribute mistakes
    'react/no-unknown-property': 'error',
    // Surface real issues
    'no-undef': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true }],
  },
}
