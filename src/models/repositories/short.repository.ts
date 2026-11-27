import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { ShortEntity } from '../entities/short.entity';

function toShortEntity(entry: CollectionEntry<'shorts'>): ShortEntity {
  return {
    slug: entry.id,
    title: entry.data.title,
    publishedAt: entry.data.publishedAt,
    tags: entry.data.tags,
    draft: entry.data.draft,
    entry,
  };
}

export class ShortRepository {
  static async findAll(includeDrafts: boolean = false): Promise<readonly ShortEntity[]> {
    const entries = await getCollection('shorts', (entry) =>
      includeDrafts ? true : !entry.data.draft,
    );
    return entries
      .map(toShortEntity)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
}
