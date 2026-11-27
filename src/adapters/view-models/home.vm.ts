import type { ShellViewModel } from './layout.vm';
import type { DitherPortraitViewModel } from './portrait.vm';

export interface HomePostPreviewViewModel {
  readonly slug: string;
  readonly href: string;
  readonly title: string;
  readonly dateLabel: string;
  readonly isoDate: string;
  readonly readingTimeLabel: string;
}

export interface HomeExperiencePreviewViewModel {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly role: string | undefined;
  readonly period: string | undefined;
  readonly link: string | undefined;
  readonly icon: string;
}

export interface HomePageViewModel {
  readonly shell: ShellViewModel;
  readonly authorName: string;
  readonly tagline: string;
  readonly bioParagraphs: readonly string[];
  readonly portrait: DitherPortraitViewModel;
  readonly recentPosts: readonly HomePostPreviewViewModel[];
  readonly featuredExperiences: readonly HomeExperiencePreviewViewModel[];
}
