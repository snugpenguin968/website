import { HighlightRepository } from '@models/repositories';
import { extractHostLabel, formatFullDate } from './format.adapter';
import { ShellAdapter } from './shell.adapter';
import type {
  HighlightItem,
  Props as HighlightsViewProps,
} from '@views/HighlightsView.astro';

export class HighlightsPageAdapter {
  static async resolve(currentPath: string = '/highlights'): Promise<HighlightsViewProps> {
    const [entities, shell] = await Promise.all([
      HighlightRepository.findAll(),
      ShellAdapter.resolve({
        currentPath,
        pageTitle: 'Highlights',
        description: 'Selected highlights, talks, and featured moments.',
      }),
    ]);

    const items: readonly HighlightItem[] = entities.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      dateLabel: item.date !== undefined ? formatFullDate(item.date) : undefined,
      category: item.category,
      link: item.link,
      hostLabel: item.link !== undefined ? extractHostLabel(item.link) : undefined,
      icon: item.icon,
    }));

    return {
      shell,
      heading: 'Highlights',
      subtitle: 'Selected work, milestones, and notable moments.',
      items,
    };
  }
}
