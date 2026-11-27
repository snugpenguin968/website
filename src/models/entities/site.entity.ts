export type DitherAlgorithm = 'atkinson' | 'floyd-steinberg' | 'bayer4x4';

export type BackgroundStyle = 'plum' | 'dot' | 'rose' | 'particle' | 'none';

export type AccentStyle = 'vermilion' | 'moss' | 'sumi';

export interface RgbColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

export interface PortraitDitherConfig {
  readonly algorithm: DitherAlgorithm;
  readonly levels: number;
  readonly targetWidth: number;
  readonly contrast: number;
  readonly gamma: number;
  readonly brightness: number;
  readonly threshold: number;
  readonly inkOpacity: number;
  readonly revealOnHover: boolean;
  readonly lightInk: RgbColor;
  readonly darkInk: RgbColor;
}

export interface SocialLinkEntity {
  readonly id: 'github' | 'linkedin' | 'x' | 'email' | 'rss';
  readonly label: string;
  readonly href: string;
  readonly icon: string;
  readonly external: boolean;
}

export type NavRouteId = 'experiences' | 'blog' | 'highlights' | 'photos' | 'shorts' | 'notes';

export interface NavRouteEntity {
  readonly id: NavRouteId;
  readonly label: string;
  readonly path: string;
  readonly alwaysVisible: boolean;
}

export interface AuthorProfileEntity {
  readonly name: string;
  readonly handle: string;
  readonly tagline: string;
  readonly bioParagraphs: readonly string[];
  readonly location: string;
}

export interface SiteConfigEntity {
  readonly title: string;
  readonly description: string;
  readonly siteUrl: string;
  readonly lang: string;
  readonly author: AuthorProfileEntity;
  readonly navigation: readonly NavRouteEntity[];
  readonly socials: readonly SocialLinkEntity[];
  readonly background: BackgroundStyle;
  readonly accent: AccentStyle;
  readonly paperTexture: boolean;
  readonly portraitDither: PortraitDitherConfig;
  readonly copyrightStartYear: number;
}
