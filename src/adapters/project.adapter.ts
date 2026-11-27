import { ProjectRepository } from '@models/repositories';
import { extractHostLabel } from './format.adapter';
import { NavigationAdapter } from './navigation.adapter';
import type { ProjectGroupViewModel, ProjectsPageViewModel } from './view-models';

export class ProjectsPageAdapter {
  static async resolve(currentPath: string = '/projects'): Promise<ProjectsPageViewModel> {
    const groupedEntities = await ProjectRepository.findGroupedByCategory();

    const groups: readonly ProjectGroupViewModel[] = groupedEntities.map((group) => ({
      category: group.category,
      projects: group.projects.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        link: project.link,
        repo: project.repo,
        icon: project.icon,
        hostLabel: extractHostLabel(project.link),
      })),
    }));

    const shell = NavigationAdapter.buildShell({
      currentPath,
      pageTitle: 'Projects',
      description: 'Selected software projects, experiments, and open-source work.',
    });

    return {
      shell,
      heading: 'Projects',
      subtitle: 'Tools, experiments, and systems I have built or contributed to.',
      groups,
    };
  }
}
