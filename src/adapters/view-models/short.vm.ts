import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import type { ShellViewModel } from './layout.vm';

export interface RenderedShortViewModel {
  readonly slug: string;
  readonly title: string | undefined;
  readonly dateLabel: string;
  readonly isoDate: string;
  readonly tags: readonly string[];
  readonly Content: AstroComponentFactory;
}

export interface ShortsPageViewModel {
  readonly shell: ShellViewModel;
  readonly heading: string;
  readonly subtitle: string;
  readonly shorts: readonly RenderedShortViewModel[];
}
