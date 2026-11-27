import type { ShellViewModel } from './layout.vm';

export interface ProjectCardViewModel {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly link: string;
  readonly repo: string | undefined;
  readonly icon: string;
  readonly hostLabel: string;
}

export interface ProjectGroupViewModel {
  readonly category: string;
  readonly projects: readonly ProjectCardViewModel[];
}

export interface ProjectsPageViewModel {
  readonly shell: ShellViewModel;
  readonly heading: string;
  readonly subtitle: string;
  readonly groups: readonly ProjectGroupViewModel[];
}
