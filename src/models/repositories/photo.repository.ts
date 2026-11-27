import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { PhotoEntity } from '../entities/photo.entity';

function toPhotoEntity(entry: CollectionEntry<'photos'>): PhotoEntity {
  return {
    id: entry.id,
    title: entry.data.title,
    src: entry.data.src,
    alt: entry.data.alt,
    caption: entry.data.caption,
    takenAt: entry.data.takenAt,
    location: entry.data.location,
    order: entry.data.order,
    draft: entry.data.draft,
  };
}

export class PhotoRepository {
  static async findAll(includeDrafts: boolean = false): Promise<readonly PhotoEntity[]> {
    const entries = await getCollection('photos', (entry) =>
      includeDrafts ? true : !entry.data.draft,
    );
    return entries.map(toPhotoEntity).sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      const timeA = a.takenAt?.getTime() ?? 0;
      const timeB = b.takenAt?.getTime() ?? 0;
      return timeB - timeA || a.title.localeCompare(b.title);
    });
  }
}
