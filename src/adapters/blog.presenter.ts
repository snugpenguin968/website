import type { BlogPostEntity } from '@models/entities';
import { formatReadingTime, formatShortDate } from './format.adapter';
import type { BlogListItemViewModel, BlogYearGroupViewModel } from './view-models';

export function toBlogListItem(post: BlogPostEntity): BlogListItemViewModel {
  return {
    slug: post.slug,
    href: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    dateLabel: formatShortDate(post.publishedAt),
    isoDate: post.publishedAt.toISOString(),
    readingTimeLabel: formatReadingTime(post.readingTime),
    tags: post.tags,
    lang: post.lang,
  };
}

export function groupBlogPostsByYear(
  posts: readonly BlogPostEntity[],
): readonly BlogYearGroupViewModel[] {
  const byYear = new Map<number, BlogListItemViewModel[]>();

  for (const post of posts) {
    const year = post.publishedAt.getUTCFullYear();
    const item = toBlogListItem(post);
    const group = byYear.get(year);
    if (group !== undefined) {
      group.push(item);
    } else {
      byYear.set(year, [item]);
    }
  }

  return Array.from(byYear.entries())
    .sort(([yearA], [yearB]) => yearB - yearA)
    .map(([year, items]) => ({ year, posts: items }));
}

export function extractUniqueTags(posts: readonly BlogPostEntity[]): readonly string[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}
