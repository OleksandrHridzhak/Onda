import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    {
        ignores: ['**/build/**', '**/dist/**'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['src/render/src/shared/**/*.{ts,tsx}'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        'app/*',
                        'pages/*',
                        'widgets/*',
                        'features/*',
                        'entities/*',
                    ],
                },
            ],
        },
    },
    {
        files: ['src/render/src/entities/**/*.{ts,tsx}'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: ['app/*', 'pages/*', 'widgets/*', 'features/*'],
                },
            ],
        },
    },
    {
        files: ['src/render/src/features/**/*.{ts,tsx}'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: ['app/*', 'pages/*', 'widgets/*'],
                },
            ],
        },
    },
    {
        files: ['src/render/src/widgets/**/*.{ts,tsx}'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: ['app/*', 'pages/*'],
                },
            ],
        },
    },
    {
        files: ['src/render/src/pages/**/*.{ts,tsx}'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: ['app/*'],
                },
            ],
        },
    },
    {
        files: ['**/*.{js,jsx,mjs,cjs}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
                globalThis: 'readonly',
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
        },
        rules: {
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'warn',
            'no-unused-vars': 'warn',
            'no-console': 'off',
            'react/jsx-uses-react': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
                globalThis: 'readonly',
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
        },
        rules: {
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            'no-console': 'off',
            'react/jsx-uses-react': 'off',
            'react-hooks/set-state-in-effect': 'off',
        },
        settings: {
            'react-hooks/set-state-in-effect': 'off',
        },
    },
    {
        ignores: [
            'node_modules/',
            'dist/',
            'build/',
            'render/build/',
            '*.bundle.js',
            'webpack.config.js',
        ],
    },
];
