import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { NoteEntity } from '../entities/note.entity';

function toNoteEntity(entry: CollectionEntry<'notes'>): NoteEntity {
  return {
    slug: entry.id,
    title: entry.data.title,
    publishedAt: entry.data.publishedAt,
    tags: entry.data.tags,
    draft: entry.data.draft,
    entry,
  };
}

export class NoteRepository {
  static async findAll(includeDrafts: boolean = false): Promise<readonly NoteEntity[]> {
    const entries = await getCollection('notes', (entry) =>
      includeDrafts ? true : !entry.data.draft,
    );

    return entries
      .map(toNoteEntity)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
}
