/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/optimus-image-cropper',
  plugins: [angular()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    name: 'optimus-image-cropper',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/packages/optimus-image-cropper',
      provider: 'v8' as const,
    },
  },
});
