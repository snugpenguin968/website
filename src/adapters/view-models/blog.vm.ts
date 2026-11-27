import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import type { ShellViewModel } from './layout.vm';

export interface BlogListItemViewModel {
  readonly slug: string;
  readonly href: string;
  readonly title: string;
  readonly description: string;
  readonly dateLabel: string;
  readonly isoDate: string;
  readonly readingTimeLabel: string;
  readonly tags: readonly string[];
  readonly lang: string;
}

export interface BlogYearGroupViewModel {
  readonly year: number;
  readonly posts: readonly BlogListItemViewModel[];
}

export interface BlogIndexViewModel {
  readonly shell: ShellViewModel;
  readonly heading: string;
  readonly subtitle: string;
  readonly totalCount: number;
  readonly allTags: readonly string[];
  readonly yearGroups: readonly BlogYearGroupViewModel[];
}

export interface TocItemViewModel {
  readonly depth: number;
  readonly slug: string;
  readonly text: string;
}

export interface BlogNeighborViewModel {
  readonly title: string;
  readonly href: string;
}

export interface BlogDetailViewModel {
  readonly shell: ShellViewModel;
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly dateLabel: string;
  readonly updatedDateLabel: string | undefined;
  readonly isoDate: string;
  readonly readingTimeLabel: string;
  readonly wordCount: number;
  readonly tags: readonly string[];
  readonly headings: readonly TocItemViewModel[];
  readonly Content: AstroComponentFactory;
  readonly previousPost: BlogNeighborViewModel | undefined;
  readonly nextPost: BlogNeighborViewModel | undefined;
}
