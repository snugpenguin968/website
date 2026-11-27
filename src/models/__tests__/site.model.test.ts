import { describe, expect, it } from 'vitest';
import { SITE_CONFIG } from '../site.model';

describe('site.model', () => {
  it('defaults portrait dithering to soft multi-level atkinson', () => {
    expect(SITE_CONFIG.portraitDither.algorithm).toBe('atkinson');
    expect(SITE_CONFIG.portraitDither.levels).toBeGreaterThanOrEqual(4);
    expect(SITE_CONFIG.portraitDither.targetWidth).toBeGreaterThanOrEqual(420);
  });

  it('exposes experiences, blog, and notes navigation routes', () => {
    expect(SITE_CONFIG.navigation.map((n) => n.path)).toEqual([
      '/experiences',
      '/blog',
      '/notes',
    ]);
  });

  it('includes configured GitHub, LinkedIn, X, Email, and RSS links', () => {
    const byId = new Map(SITE_CONFIG.socials.map((s) => [s.id, s.href]));
    expect(byId.get('github')).toBe('https://github.com/snugpenguin968');
    expect(byId.get('linkedin')).toBe('https://www.linkedin.com/in/jt42/');
    expect(byId.get('x')).toBe('https://x.com/snugpenguin42');
    expect(byId.get('email')).toBe('mailto:johntian2014@gmail.com');
    expect(byId.get('rss')).toBe('/rss.xml');
  });
});
