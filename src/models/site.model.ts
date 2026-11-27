import type { SiteConfigEntity } from './entities/site.entity';

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
    { id: 'experiences', label: 'Experiences', path: '/experiences', alwaysVisible: true },
    { id: 'blog', label: 'Blog', path: '/blog', alwaysVisible: true },
    { id: 'highlights', label: 'Highlights', path: '/highlights', alwaysVisible: false },
    { id: 'photos', label: 'Photos', path: '/photos', alwaysVisible: false },
    { id: 'shorts', label: 'Shorts', path: '/shorts', alwaysVisible: false },
    { id: 'notes', label: 'Notes', path: '/notes', alwaysVisible: false },
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
      id: 'email',
      label: 'Email',
      href: 'mailto:johntian2014@gmail.com',
      icon: 'i-ri-mail-line',
      external: false,
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
    levels: 5,
    targetWidth: 480,
    contrast: 1.0,
    gamma: 1.0,
    brightness: 0,
    threshold: 128,
    inkOpacity: 0.88,
    revealOnHover: true,
    lightInk: { r: 28, g: 28, b: 30 },
    darkInk: { r: 228, g: 228, b: 230 },
  },
  copyrightStartYear: 2026,
} as const;
