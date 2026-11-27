import darkLogoImage from '@assets/images/darklogo.png';
import lightLogoImage from '@assets/images/logo.png';
import { SITE_CONFIG } from '@models/site.model';
import type { NavRouteId, SiteConfigEntity } from '@models/entities';
import { formatCopyrightRange, normalizePathname } from './format.adapter';
import type { NavItemViewModel, ShellViewModel } from './view-models';

export interface ResolveShellInput {
  readonly currentPath: string;
  readonly pageTitle?: string;
  readonly description?: string;
  readonly config?: SiteConfigEntity;
  readonly currentYear?: number;
  readonly populatedRouteIds?: ReadonlySet<NavRouteId>;
}

export function isNavRouteActive(currentPath: string, navPath: string): boolean {
  const current = normalizePathname(currentPath);
  const target = normalizePathname(navPath);

  if (target === '/') {
    return current === '/';
  }
  return current === target || current.startsWith(`${target}/`);
}

export class NavigationAdapter {
  static buildShell(input: ResolveShellInput): ShellViewModel {
    const config = input.config ?? SITE_CONFIG;
    const normalizedPath = normalizePathname(input.currentPath);
    const fullTitle =
      input.pageTitle !== undefined && input.pageTitle.length > 0
        ? `${input.pageTitle} — ${config.title}`
        : config.title;

    const canonicalUrl = new URL(normalizedPath, config.siteUrl).toString();
    const year = input.currentYear ?? new Date().getUTCFullYear();
    const populated = input.populatedRouteIds ?? new Set<NavRouteId>();

    const navItems: readonly NavItemViewModel[] = config.navigation
      .filter((route) => route.alwaysVisible || populated.has(route.id))
      .map((route) => ({
        id: route.id,
        label: route.label,
        href: route.path,
        active: isNavRouteActive(normalizedPath, route.path),
      }));

    const rssLink = config.socials.find((s) => s.id === 'rss');
    const personalSocials = config.socials.filter((s) => s.id !== 'rss');

    return {
      head: {
        pageTitle: fullTitle,
        siteTitle: config.title,
        description: input.description ?? config.description,
        canonicalUrl,
        lang: config.lang,
      },
      logo: {
        lightModeSrc: darkLogoImage,
        darkModeSrc: lightLogoImage,
        alt: `${config.author.name} logo`,
      },
      navItems,
      socials: personalSocials,
      rssHref: rssLink?.href,
      background: config.background,
      accent: config.accent,
      texture: config.texture,
      copyrightText: `${formatCopyrightRange(config.copyrightStartYear, year)} © ${config.author.name}`,
      authorName: config.author.name,
    };
  }
}
