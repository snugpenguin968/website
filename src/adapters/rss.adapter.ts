import { BlogRepository } from '@models/repositories';
import { SITE_CONFIG } from '@models/site.model';

export interface RssFeedItemViewModel {
  readonly title: string;
  readonly description: string;
  readonly pubDate: Date;
  readonly link: string;
  readonly categories: readonly string[];
}

export interface RssFeedViewModel {
  readonly title: string;
  readonly description: string;
  readonly site: string;
  readonly items: readonly RssFeedItemViewModel[];
}

export class RssAdapter {
  static async resolve(siteFallback?: URL): Promise<RssFeedViewModel> {
    const posts = await BlogRepository.findAll();

    return {
      title: SITE_CONFIG.title,
      description: SITE_CONFIG.description,
      site: siteFallback?.toString() ?? SITE_CONFIG.siteUrl,
      items: posts.map((post) => ({
        title: post.title,
        description: post.description,
        pubDate: post.publishedAt,
        link: `/blog/${post.slug}/`,
        categories: post.tags,
      })),
    };
  }
}
