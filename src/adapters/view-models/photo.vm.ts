import type { ShellViewModel } from './layout.vm';

export interface PhotoItemViewModel {
  readonly id: string;
  readonly title: string;
  readonly src: string;
  readonly alt: string;
  readonly caption: string | undefined;
  readonly dateLabel: string | undefined;
  readonly location: string | undefined;
}

export interface PhotosPageViewModel {
  readonly shell: ShellViewModel;
  readonly heading: string;
  readonly subtitle: string;
  readonly photos: readonly PhotoItemViewModel[];
}
