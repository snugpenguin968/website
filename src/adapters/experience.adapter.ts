import { ExperienceRepository } from '@models/repositories';
import { extractHostLabel } from './format.adapter';
import { ShellAdapter } from './shell.adapter';
import type {
  ExperienceGroup,
  Props as ExperiencesViewProps,
} from '@views/ExperiencesView.astro';

export class ExperiencesPageAdapter {
  static async resolve(currentPath: string = '/experiences'): Promise<ExperiencesViewProps> {
    const [groupedEntities, shell] = await Promise.all([
      ExperienceRepository.findGroupedByCategory(),
      ShellAdapter.resolve({
        currentPath,
        pageTitle: 'Experiences',
        description: "Things I've done.",
      }),
    ]);

    const groups: readonly ExperienceGroup[] = groupedEntities.map((group) => ({
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

    return {
      shell,
      heading: 'Experiences',
      subtitle: "Things I've done.",
      groups,
    };
  }
}
