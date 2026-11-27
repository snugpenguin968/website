import type { ShellViewModel } from './layout.vm';

export interface ExperienceCardViewModel {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly role: string | undefined;
  readonly period: string | undefined;
  readonly location: string | undefined;
  readonly link: string | undefined;
  readonly repo: string | undefined;
  readonly icon: string;
  readonly hostLabel: string | undefined;
}

export interface ExperienceGroupViewModel {
  readonly category: string;
  readonly experiences: readonly ExperienceCardViewModel[];
}

export interface ExperiencesPageViewModel {
  readonly shell: ShellViewModel;
  readonly heading: string;
  readonly subtitle: string;
  readonly groups: readonly ExperienceGroupViewModel[];
}
