import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { RssAdapter } from '@adapters/rss.adapter';

export async function GET(context: APIContext): Promise<Response> {
  const feed = await RssAdapter.resolve(context.site);

  return rss({
    title: feed.title,
    description: feed.description,
    site: feed.site,
    items: feed.items.map((item) => ({
      title: item.title,
      description: item.description,
      pubDate: item.pubDate,
      link: item.link,
      categories: [...item.categories],
    })),
  });
}
