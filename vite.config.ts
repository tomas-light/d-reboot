import tailwindcss from '@tailwindcss/vite';
import { writeFile } from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, type UserConfig } from 'vite';

export const paths = {
  __dirname: path.dirname(fileURLToPath(import.meta.url)),
  get generatedEnvFile() {
    return path.join(this.__dirname, 'src', 'env.json');
  },
};

export default defineConfig(async (env): Promise<UserConfig> => {
  const BASE_URL_TO_PUBLIC =
    env.mode === 'production' && !env.isPreview ? '/d-reboot/' : '/';

  const generatedEnvContent = JSON.stringify(
    {
      BASE_URL_TO_PUBLIC,
    },
    null,
    2
  );

  await writeFile(paths.generatedEnvFile, generatedEnvContent, 'utf8');

  return {
    plugins: [tailwindcss()],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    build: {},
    base: BASE_URL_TO_PUBLIC,
  };
});
