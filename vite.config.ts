import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/kiro/',
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    extensions: ['.web.js', '.web.ts', '.web.tsx', '.js', '.ts', '.tsx', '.json'],
  },
  build: {
    outDir: 'dist',
  },
});
