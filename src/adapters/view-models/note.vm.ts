import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import type { ShellViewModel } from './layout.vm';

export interface RenderedNoteViewModel {
  readonly slug: string;
  readonly title: string;
  readonly dateLabel: string;
  readonly isoDate: string;
  readonly tags: readonly string[];
  readonly Content: AstroComponentFactory;
}

export interface NotesPageViewModel {
  readonly shell: ShellViewModel;
  readonly heading: string;
  readonly subtitle: string;
  readonly notes: readonly RenderedNoteViewModel[];
}
