import {
  BlogRepository,
  ExperienceRepository,
  HighlightRepository,
  NoteRepository,
  PhotoRepository,
  ShortRepository,
} from '@models/repositories';
import { formatFullDate } from './format.adapter';

export interface SearchIndexItem {
  readonly id: string;
  readonly type: 'Page' | 'Blog' | 'Experience' | 'Highlight' | 'Note' | 'Short' | 'Photo';
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly tags: readonly string[];
  readonly external: boolean;
}

export class SearchAdapter {
  static async resolveIndex(): Promise<readonly SearchIndexItem[]> {
    const [posts, experiences, highlights, notes, shorts, photos] = await Promise.all([
      BlogRepository.findAll(),
      ExperienceRepository.findAll(),
      HighlightRepository.findAll(),
      NoteRepository.findAll(),
      ShortRepository.findAll(),
      PhotoRepository.findAll(),
    ]);

    const items: SearchIndexItem[] = [
      {
        id: 'page:home',
        type: 'Page',
        title: 'Home',
        description: 'Introduction and links',
        href: '/',
        tags: [],
        external: false,
      },
      {
        id: 'page:experiences',
        type: 'Page',
        title: 'Experiences',
        description: 'Work experiences, projects, and other work',
        href: '/experiences',
        tags: [],
        external: false,
      },
      {
        id: 'page:blog',
        type: 'Page',
        title: 'Blog',
        description: 'Articles and engineering notes',
        href: '/blog',
        tags: [],
        external: false,
      },
    ];

    for (const post of posts) {
      items.push({
        id: `blog:${post.slug}`,
        type: 'Blog',
        title: post.title,
        description: post.description,
        href: `/blog/${post.slug}`,
        tags: post.tags,
        external: false,
      });
    }

    for (const exp of experiences) {
      const tags: string[] = [exp.category];
      if (exp.role !== undefined) tags.push(exp.role);
      items.push({
        id: `experience:${exp.id}`,
        type: 'Experience',
        title: exp.name,
        description: exp.description,
        href: exp.link ?? '/experiences',
        tags,
        external: exp.link !== undefined,
      });
    }

    for (const hl of highlights) {
      items.push({
        id: `highlight:${hl.id}`,
        type: 'Highlight',
        title: hl.title,
        description: hl.description,
        href: hl.link ?? '/highlights',
        tags: hl.category !== undefined ? [hl.category] : [],
        external: hl.link !== undefined,
      });
    }

    for (const note of notes) {
      items.push({
        id: `note:${note.slug}`,
        type: 'Note',
        title: note.title,
        description: formatFullDate(note.publishedAt),
        href: '/notes',
        tags: note.tags,
        external: false,
      });
    }

    for (const item of shorts) {
      items.push({
        id: `short:${item.slug}`,
        type: 'Short',
        title: item.title ?? formatFullDate(item.publishedAt),
        description: formatFullDate(item.publishedAt),
        href: '/shorts',
        tags: item.tags,
        external: false,
      });
    }

    for (const photo of photos) {
      items.push({
        id: `photo:${photo.id}`,
        type: 'Photo',
        title: photo.title,
        description: photo.caption ?? photo.location ?? '',
        href: '/photos',
        tags: photo.location !== undefined ? [photo.location] : [],
        external: false,
      });
    }

    return items;
  }
}
