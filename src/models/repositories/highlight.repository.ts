import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { HighlightEntity } from '../entities/highlight.entity';

function toHighlightEntity(entry: CollectionEntry<'highlights'>): HighlightEntity {
  return {
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    date: entry.data.date,
    category: entry.data.category,
    link: entry.data.link,
    icon: entry.data.icon,
    order: entry.data.order,
    draft: entry.data.draft,
  };
}

export class HighlightRepository {
  static async findAll(includeDrafts: boolean = false): Promise<readonly HighlightEntity[]> {
    const entries = await getCollection('highlights', (entry) =>
      includeDrafts ? true : !entry.data.draft,
    );
    return entries.map(toHighlightEntity).sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      const timeA = a.date?.getTime() ?? 0;
      const timeB = b.date?.getTime() ?? 0;
      return timeB - timeA || a.title.localeCompare(b.title);
    });
  }
}
