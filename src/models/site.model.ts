import type { SiteConfigEntity } from './entities/site.entity';

/**
 * Central domain configuration for the personal website.
 * Adjust `portraitDither.algorithm` ('atkinson' | 'floyd-steinberg' | 'bayer4x4')
 * or `portraitDither.revealOnHover` to customize the dithered portrait rendering.
 */
export const SITE_CONFIG: SiteConfigEntity = {
  title: 'John Tian',
  description:
    'Software engineer building thoughtful systems, developer tools, and minimalist web experiences.',
  siteUrl: 'https://snugpenguin.dev',
  lang: 'en',
  author: {
    name: 'John Tian',
    handle: 'snugpenguin',
    tagline: 'Builder, systems tinkerer, and software engineer.',
    bioParagraphs: [
      'Hey, I am John Tian — a software engineer who enjoys crafting clean architectures, fast developer tooling, and quiet, expressive interfaces on the web.',
      'I care deeply about type safety, deliberate design, and systems that age well. Outside of engineering, you can usually find me hunting for good katsu curry, reading, or tinkering with side projects.',
    ],
    location: 'United States',
  },
  navigation: [
    { id: 'blog', label: 'Blog', path: '/blog' },
    { id: 'projects', label: 'Projects', path: '/projects' },
    { id: 'notes', label: 'Notes', path: '/notes' },
  ],
  socials: [
    {
      id: 'github',
      label: 'GitHub',
      href: 'https://github.com/snugpenguin968',
      icon: 'i-ri-github-line',
      external: true,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/jt42/',
      icon: 'i-ri-linkedin-line',
      external: true,
    },
    {
      id: 'x',
      label: 'X / Twitter',
      href: 'https://x.com/snugpenguin42',
      icon: 'i-ri-twitter-x-line',
      external: true,
    },
    {
      id: 'rss',
      label: 'RSS Feed',
      href: '/rss.xml',
      icon: 'i-ri-rss-line',
      external: false,
    },
  ],
  background: 'plum',
  portraitDither: {
    algorithm: 'atkinson',
    targetWidth: 280,
    contrast: 1.16,
    gamma: 1.0,
    brightness: 4,
    threshold: 128,
    revealOnHover: true,
    lightInk: { r: 24, g: 24, b: 27 },
    darkInk: { r: 232, g: 232, b: 232 },
  },
  copyrightStartYear: 2026,
} as const;
