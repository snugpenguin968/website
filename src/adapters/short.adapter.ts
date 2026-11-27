import { render } from 'astro:content';
import { ShortRepository } from '@models/repositories';
import { formatFullDate } from './format.adapter';
import { ShellAdapter } from './shell.adapter';
import type { RenderedShortViewModel, ShortsPageViewModel } from './view-models';

export class ShortsPageAdapter {
  static async resolve(currentPath: string = '/shorts'): Promise<ShortsPageViewModel> {
    const [entities, shell] = await Promise.all([
      ShortRepository.findAll(),
      ShellAdapter.resolve({
        currentPath,
        pageTitle: 'Shorts',
        description: 'Quick thoughts and brief updates.',
      }),
    ]);

    const shorts: readonly RenderedShortViewModel[] = await Promise.all(
      entities.map(async (item) => {
        const { Content } = await render(item.entry);
        return {
          slug: item.slug,
          title: item.title,
          dateLabel: formatFullDate(item.publishedAt),
          isoDate: item.publishedAt.toISOString(),
          tags: item.tags,
          Content,
        };
      }),
    );

    return {
      shell,
      heading: 'Shorts',
      subtitle: 'Brief thoughts, snippets, and quick updates.',
      shorts,
    };
  }
}
