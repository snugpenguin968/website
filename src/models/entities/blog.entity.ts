import type { CollectionEntry } from 'astro:content';

export interface ReadingTimeEntity {
  readonly words: number;
  readonly minutes: number;
}

export interface MarkdownHeadingEntity {
  readonly depth: number;
  readonly slug: string;
  readonly text: string;
}

export interface BlogPostEntity {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly publishedAt: Date;
  readonly updatedAt: Date | undefined;
  readonly tags: readonly string[];
  readonly draft: boolean;
  readonly lang: string;
  readonly readingTime: ReadingTimeEntity;
  readonly entry: CollectionEntry<'blog'>;
}
