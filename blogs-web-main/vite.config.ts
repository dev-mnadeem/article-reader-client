import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  plugins: [react()],
  // Keep the CRA-era variable name so existing .env files keep working.
  envPrefix: 'REACT_APP_',
  resolve: {
    // Mirrors tsconfig's baseUrl: imports such as 'components/Post/Post' resolve from src/.
    alias: [
      {
        find: /^(components|constants|contexts|fixtures|pages|schemas|services|types)\//,
        replacement: `${srcDir}/$1/`,
      },
    ],
  },
  server: { port: 3000, strictPort: true },
  preview: { port: 3000, strictPort: true },
  build: { outDir: 'build' },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    mockReset: true,
    css: false,
  },
});
