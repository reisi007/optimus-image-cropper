import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [
            '^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$',
            '^.*/src/common/',
            '^.*/src/theme/',
            '^.*/src/i18n/',
            '^@all-the\\.rest/optimus-image-cropper(/.*)?$',
          ],
          depConstraints: [
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              sourceTag: 'scope:demo',
              onlyDependOnLibsWithTags: [
                'scope:optimus-image-cropper',
                'scope:shared',
              ],
            },
            {
              sourceTag: 'scope:optimus-image-cropper',
              onlyDependOnLibsWithTags: [
                'scope:optimus-image-cropper',
                'scope:shared',
              ],
            },
            {
              sourceTag: 'type:data',
              onlyDependOnLibsWithTags: ['type:data'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    rules: {},
  },
];
