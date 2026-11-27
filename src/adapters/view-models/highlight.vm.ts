import type { ShellViewModel } from './layout.vm';

export interface HighlightItemViewModel {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly dateLabel: string | undefined;
  readonly category: string | undefined;
  readonly link: string | undefined;
  readonly hostLabel: string | undefined;
  readonly icon: string;
}

export interface HighlightsPageViewModel {
  readonly shell: ShellViewModel;
  readonly heading: string;
  readonly subtitle: string;
  readonly items: readonly HighlightItemViewModel[];
}
