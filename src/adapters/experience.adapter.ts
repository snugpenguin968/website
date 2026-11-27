import { ExperienceRepository } from '@models/repositories';
import { extractHostLabel } from './format.adapter';
import { NavigationAdapter } from './navigation.adapter';
import type { ExperienceGroupViewModel, ExperiencesPageViewModel } from './view-models';

export class ExperiencesPageAdapter {
  static async resolve(currentPath: string = '/experiences'): Promise<ExperiencesPageViewModel> {
    const groupedEntities = await ExperienceRepository.findGroupedByCategory();

    const groups: readonly ExperienceGroupViewModel[] = groupedEntities.map((group) => ({
      category: group.category,
      experiences: group.experiences.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        role: item.role,
        period: item.period,
        location: item.location,
        link: item.link,
        repo: item.repo,
        icon: item.icon,
        hostLabel: item.link !== undefined ? extractHostLabel(item.link) : undefined,
      })),
    }));

    const shell = NavigationAdapter.buildShell({
      currentPath,
      pageTitle: 'Experiences',
      description: 'Work experiences, software projects, and other work.',
    });

    return {
      shell,
      heading: 'Experiences',
      subtitle: 'Work, projects, and things I have built along the way.',
      groups,
    };
  }
}
