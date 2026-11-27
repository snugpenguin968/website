import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import UnoCSS from '@unocss/astro';

export default defineConfig({
  site: 'https://snugpenguin.dev',
  output: 'static',
  adapter: cloudflare({
    imageService: 'compile',
  }),
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    mdx(),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
      defaultColor: false,
      wrap: true,
    },
  },
});
