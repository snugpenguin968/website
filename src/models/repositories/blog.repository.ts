import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { BlogPostEntity } from '../entities/blog.entity';
import { estimateReadingTime } from '../reading-time.model';

function toBlogPostEntity(entry: CollectionEntry<'blog'>): BlogPostEntity {
  const rawBody = entry.body ?? '';
  const readingTime = estimateReadingTime(
    rawBody,
    undefined,
    entry.data.durationOverrideMinutes,
  );

  return {
    slug: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    publishedAt: entry.data.publishedAt,
    updatedAt: entry.data.updatedAt,
    tags: entry.data.tags,
    draft: entry.data.draft,
    lang: entry.data.lang,
    readingTime,
    entry,
  };
}

export class BlogRepository {
  static async findAll(includeDrafts: boolean = false): Promise<readonly BlogPostEntity[]> {
    const entries = await getCollection('blog', (entry) =>
      includeDrafts ? true : !entry.data.draft,
    );

    return entries
      .map(toBlogPostEntity)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  static async findBySlug(
    slug: string,
    includeDrafts: boolean = false,
  ): Promise<BlogPostEntity | undefined> {
    const posts = await BlogRepository.findAll(includeDrafts);
    return posts.find((post) => post.slug === slug);
  }
}
