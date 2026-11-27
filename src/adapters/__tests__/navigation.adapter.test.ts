import { describe, expect, it } from 'vitest';
import { NavigationAdapter, isNavRouteActive } from '../navigation.adapter';

describe('NavigationAdapter', () => {
  it('matches active routes for exact and nested paths', () => {
    expect(isNavRouteActive('/', '/')).toBe(true);
    expect(isNavRouteActive('/blog', '/')).toBe(false);
    expect(isNavRouteActive('/blog', '/blog')).toBe(true);
    expect(isNavRouteActive('/blog/hello-world', '/blog')).toBe(true);
    expect(isNavRouteActive('/experiences', '/experiences')).toBe(true);
    expect(isNavRouteActive('/blogger', '/blog')).toBe(false);
  });

  it('only shows experiences and blog in nav when optional sections are empty', () => {
    const shell = NavigationAdapter.buildShell({
      currentPath: '/blog/type-systems',
      pageTitle: 'Type Systems',
      currentYear: 2026,
    });

    expect(shell.head.pageTitle).toBe('Type Systems — John Tian');
    expect(shell.head.canonicalUrl).toBe('https://johntian.dev/blog/type-systems');
    expect(shell.head.ogImageUrl).toBe('https://johntian.dev/og-image.png');
    expect(shell.copyrightText).toBe('2026 © John Tian');
    expect(shell.navItems.map((n) => n.id)).toEqual(['experiences', 'blog']);
    expect(shell.socials.map((s) => s.id)).toEqual(['github', 'linkedin', 'x', 'email']);
    expect(shell.rssHref).toBe('/rss.xml');

    const blogNav = shell.navItems.find((n) => n.id === 'blog');
    const expNav = shell.navItems.find((n) => n.id === 'experiences');
    expect(blogNav?.active).toBe(true);
    expect(expNav?.active).toBe(false);

    expect(String(shell.logo.lightModeSrc)).toContain('darklogo');
    expect(String(shell.logo.darkModeSrc)).toContain('logo');
  });

  it('reveals optional nav items once they have published content', () => {
    const shell = NavigationAdapter.buildShell({
      currentPath: '/photos',
      populatedRouteIds: new Set(['highlights', 'photos', 'shorts', 'notes']),
    });

    expect(shell.navItems.map((n) => n.id)).toEqual([
      'experiences',
      'blog',
      'highlights',
      'photos',
      'shorts',
      'notes',
    ]);
    expect(shell.navItems.find((n) => n.id === 'photos')?.active).toBe(true);
  });
});
