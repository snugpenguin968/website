import { render } from 'astro:content';
import { BlogRepository } from '@models/repositories';
import { extractUniqueTags, groupBlogPostsByYear, toBlogListItem } from './blog.presenter';
import { formatFullDate, formatReadingTime } from './format.adapter';
import { ShellAdapter } from './shell.adapter';
import type {
  BlogDetailViewModel,
  BlogIndexViewModel,
  TocItemViewModel,
} from './view-models';

export { extractUniqueTags, groupBlogPostsByYear, toBlogListItem };

export class BlogPageAdapter {
  static async resolveIndex(currentPath: string = '/blog'): Promise<BlogIndexViewModel> {
    const [posts, shell] = await Promise.all([
      BlogRepository.findAll(),
      ShellAdapter.resolve({
        currentPath,
        pageTitle: 'Blog',
        description: 'Essays, engineering notes, and thoughts on software design.',
      }),
    ]);

    return {
      shell,
      heading: 'Blog',
      subtitle: 'Writing about engineering, type systems, developer tools, and design.',
      totalCount: posts.length,
      allTags: extractUniqueTags(posts),
      yearGroups: groupBlogPostsByYear(posts),
    };
  }

  static async resolveStaticPaths(): Promise<readonly { readonly params: { readonly slug: string } }[]> {
    const posts = await BlogRepository.findAll();
    return posts.map((post) => ({
      params: { slug: post.slug },
    }));
  }

  static async resolveDetail(
    slug: string,
    currentPath: string,
  ): Promise<BlogDetailViewModel | undefined> {
    const posts = await BlogRepository.findAll();
    const index = posts.findIndex((p) => p.slug === slug);
    const post = index >= 0 ? posts[index] : undefined;

    if (post === undefined) {
      return undefined;
    }

    const [{ Content, headings }, shell] = await Promise.all([
      render(post.entry),
      ShellAdapter.resolve({
        currentPath,
        pageTitle: post.title,
        description: post.description,
      }),
    ]);

    const tocHeadings: readonly TocItemViewModel[] = headings
      .filter((h) => h.depth >= 2 && h.depth <= 3)
      .map((h) => ({
        depth: h.depth,
        slug: h.slug,
        text: h.text,
      }));

    const newerPost = index > 0 ? posts[index - 1] : undefined;
    const olderPost = index + 1 < posts.length ? posts[index + 1] : undefined;

    return {
      shell,
      slug: post.slug,
      title: post.title,
      description: post.description,
      dateLabel: formatFullDate(post.publishedAt),
      updatedDateLabel:
        post.updatedAt !== undefined ? formatFullDate(post.updatedAt) : undefined,
      isoDate: post.publishedAt.toISOString(),
      readingTimeLabel: formatReadingTime(post.readingTime),
      wordCount: post.readingTime.words,
      tags: post.tags,
      headings: tocHeadings,
      Content,
      nextPost:
        newerPost !== undefined
          ? { title: newerPost.title, href: `/blog/${newerPost.slug}` }
          : undefined,
      previousPost:
        olderPost !== undefined
          ? { title: olderPost.title, href: `/blog/${olderPost.slug}` }
          : undefined,
    };
  }
}
