import { writeFile } from 'node:fs/promises';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import { defineConfig, type UserConfig } from 'vite';

export const paths = {
  __dirname: path.dirname(fileURLToPath(import.meta.url)),
  get env() {
    return path.join(this.__dirname, 'src', 'env.json');
  },
};

export default defineConfig(async (): Promise<UserConfig> => {
  const BASE_URL_TO_PUBLIC = process.env?.BASE_URL_TO_PUBLIC ?? '/';

  const envContent = JSON.stringify(
    {
      BASE_URL_TO_PUBLIC: BASE_URL_TO_PUBLIC,
    },
    null,
    2
  );
  await writeFile(paths.env, envContent, 'utf8');

  return {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    base: BASE_URL_TO_PUBLIC,
    server: {
      open: true,
    },
    build: {
      target: 'esnext',
    },
  };
});
