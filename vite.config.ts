import { defineConfig, type UserConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(
  (env): UserConfig => ({
    plugins: [tailwindcss()],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    build: {},
    base: env.mode === 'production' && !env.isPreview ? '/d-reboot/' : '',
  })
);
