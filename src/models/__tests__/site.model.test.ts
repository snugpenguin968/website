import { describe, expect, it } from 'vitest';
import { SITE_CONFIG } from '../site.model';

describe('site.model', () => {
  it('defaults portrait dithering to atkinson with tuned resolution', () => {
    expect(SITE_CONFIG.portraitDither.algorithm).toBe('atkinson');
    expect(SITE_CONFIG.portraitDither.targetWidth).toBeGreaterThanOrEqual(360);
  });

  it('exposes blog, experiences, and notes navigation routes', () => {
    expect(SITE_CONFIG.navigation.map((n) => n.path)).toEqual([
      '/blog',
      '/experiences',
      '/notes',
    ]);
  });

  it('includes configured GitHub, LinkedIn, X, and RSS links', () => {
    const byId = new Map(SITE_CONFIG.socials.map((s) => [s.id, s.href]));
    expect(byId.get('github')).toBe('https://github.com/snugpenguin968');
    expect(byId.get('linkedin')).toBe('https://www.linkedin.com/in/jt42/');
    expect(byId.get('x')).toBe('https://x.com/snugpenguin42');
    expect(byId.get('rss')).toBe('/rss.xml');
  });
});
