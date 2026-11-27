import { describe, expect, it } from 'vitest';
import { extractUniqueTags, groupBlogPostsByYear } from '../blog.presenter';
import type { BlogPostEntity } from '@models/entities';

function makePost(overrides: Partial<BlogPostEntity> & { slug: string; publishedAt: Date }): BlogPostEntity {
  return {
    title: overrides.title ?? overrides.slug,
    description: overrides.description ?? 'Description',
    updatedAt: overrides.updatedAt,
    tags: overrides.tags ?? [],
    draft: overrides.draft ?? false,
    lang: overrides.lang ?? 'en',
    readingTime: overrides.readingTime ?? { words: 220, minutes: 1 },
    entry: {} as BlogPostEntity['entry'],
    slug: overrides.slug,
    publishedAt: overrides.publishedAt,
  };
}

describe('blog.adapter pure transformations', () => {
  it('groups posts descending by UTC year', () => {
    const posts: readonly BlogPostEntity[] = [
      makePost({ slug: 'p1', publishedAt: new Date('2026-11-20T00:00:00Z'), tags: ['astro', 'ts'] }),
      makePost({ slug: 'p2', publishedAt: new Date('2025-05-01T00:00:00Z'), tags: ['ts'] }),
      makePost({ slug: 'p3', publishedAt: new Date('2026-02-10T00:00:00Z'), tags: ['design'] }),
    ];

    const groups = groupBlogPostsByYear(posts);
    expect(groups.map((g) => g.year)).toEqual([2026, 2025]);
    expect(groups[0]?.posts.map((p) => p.slug)).toEqual(['p1', 'p3']);
    expect(groups[1]?.posts.map((p) => p.slug)).toEqual(['p2']);
  });

  it('ranks unique tags by frequency then alphabetically', () => {
    const posts: readonly BlogPostEntity[] = [
      makePost({ slug: 'p1', publishedAt: new Date('2026-01-01T00:00:00Z'), tags: ['zeta', 'ts'] }),
      makePost({ slug: 'p2', publishedAt: new Date('2026-01-02T00:00:00Z'), tags: ['astro', 'ts'] }),
    ];

    expect(extractUniqueTags(posts)).toEqual(['ts', 'astro', 'zeta']);
  });
});
