import type { ImageMetadata } from 'astro';
import type { BackgroundStyle } from '@models/entities';

export type { BackgroundStyle };

export interface ThemeLogoViewModel {
  readonly lightModeSrc: ImageMetadata;
  readonly darkModeSrc: ImageMetadata;
  readonly alt: string;
}

export interface NavItemViewModel {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly active: boolean;
}

export interface SocialLinkViewModel {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly icon: string;
  readonly external: boolean;
}

export interface HeadMetaViewModel {
  readonly pageTitle: string;
  readonly siteTitle: string;
  readonly description: string;
  readonly canonicalUrl: string;
  readonly lang: string;
}

export interface ShellViewModel {
  readonly head: HeadMetaViewModel;
  readonly logo: ThemeLogoViewModel;
  readonly navItems: readonly NavItemViewModel[];
  readonly socials: readonly SocialLinkViewModel[];
  readonly rssHref: string | undefined;
  readonly background: BackgroundStyle;
  readonly copyrightText: string;
  readonly authorName: string;
}
