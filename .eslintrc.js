module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  settings: {
    react: {
      version: 'detect',
    },
    next: {
      rootDir: './',
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@next/next/recommended',
    'prettier', // Optional: if using Prettier
  ],
  plugins: [
    'react',
    '@typescript-eslint',
    'jsx-a11y',
    'react-hooks',
  ],
  rules: {
    // TypeScript Rules
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    // '@typescript-eslint/no-explicit-any': 'error', // change to 'warn' or 'off' if needed
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // React Rules
    'react/prop-types': 'off', // using TS, so not needed
    'react/react-in-jsx-scope': 'off', // Next.js does this automatically

    // Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // General ESLint Rules
    'no-unused-vars': 'off', // handled by TS version
    'no-console': 'warn',
    'prefer-const': 'warn',

    // Next.js specific rules
    '@next/next/no-img-element': 'off', // Optional if you want to use <img>
  },
};
