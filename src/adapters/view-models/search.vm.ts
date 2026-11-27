export interface SearchIndexItemViewModel {
  readonly id: string;
  readonly type: 'Page' | 'Blog' | 'Experience' | 'Highlight' | 'Note' | 'Short' | 'Photo';
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly tags: readonly string[];
  readonly external: boolean;
}
