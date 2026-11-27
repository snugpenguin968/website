import type { CollectionEntry } from 'astro:content';

export interface ShortEntity {
  readonly slug: string;
  readonly title: string | undefined;
  readonly publishedAt: Date;
  readonly tags: readonly string[];
  readonly draft: boolean;
  readonly entry: CollectionEntry<'shorts'>;
}
