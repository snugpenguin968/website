import { describe, expect, it } from 'vitest';
import { NavigationAdapter, isNavRouteActive } from '../navigation.adapter';

describe('NavigationAdapter', () => {
  it('matches active routes for exact and nested paths', () => {
    expect(isNavRouteActive('/', '/')).toBe(true);
    expect(isNavRouteActive('/blog', '/')).toBe(false);
    expect(isNavRouteActive('/blog', '/blog')).toBe(true);
    expect(isNavRouteActive('/blog/hello-world', '/blog')).toBe(true);
    expect(isNavRouteActive('/blogger', '/blog')).toBe(false);
  });

  it('builds shell view model with active nav state, canonical URL, and logo polarity', () => {
    const shell = NavigationAdapter.buildShell({
      currentPath: '/blog/mva-architecture',
      pageTitle: 'MVA Architecture',
      currentYear: 2026,
    });

    expect(shell.head.pageTitle).toBe('MVA Architecture — John Tian');
    expect(shell.head.canonicalUrl).toBe('https://snugpenguin.dev/blog/mva-architecture');
    expect(shell.copyrightText).toBe('2026 © John Tian');

    const blogNav = shell.navItems.find((n) => n.id === 'blog');
    const projectsNav = shell.navItems.find((n) => n.id === 'projects');
    expect(blogNav?.active).toBe(true);
    expect(projectsNav?.active).toBe(false);

    // Light mode uses darklogo.png; dark mode uses logo.png
    expect(String(shell.logo.lightModeSrc)).toContain('darklogo');
    expect(String(shell.logo.darkModeSrc)).toContain('logo');
  });
});
