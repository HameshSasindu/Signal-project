import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@css': path.resolve(__dirname, 'src/css'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@redux': path.resolve(__dirname, 'src/redux'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@public': path.resolve(__dirname, 'src/public'),
      '@common-utils': path.resolve(__dirname, 'src/components/common.tsx'),
    },
  }
});
