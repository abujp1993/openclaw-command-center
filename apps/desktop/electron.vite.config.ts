import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({ exclude: ['@openclaw/shared', '@openclaw/database', '@openclaw/ai-providers'] })],
    build: {
      outDir: 'dist/main',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.ts'),
        },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin({ exclude: ['@openclaw/shared'] })],
    build: {
      outDir: 'dist/preload',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts'),
        },
      },
    },
  },
  renderer: {
    root: '../renderer',
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, '../renderer/src'),
      },
    },
    build: {
      outDir: resolve(__dirname, '../renderer/dist'),
      rollupOptions: {
        input: {
          index: resolve(__dirname, '../renderer/index.html'),
        },
      },
    },
  },
});
