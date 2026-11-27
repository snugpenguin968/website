import type { CollectionEntry } from 'astro:content';

export interface NoteEntity {
  readonly slug: string;
  readonly title: string;
  readonly publishedAt: Date;
  readonly tags: readonly string[];
  readonly draft: boolean;
  readonly entry: CollectionEntry<'notes'>;
}
