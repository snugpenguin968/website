import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { ProjectCategoryGroupEntity, ProjectEntity } from '../entities/project.entity';

function toProjectEntity(entry: CollectionEntry<'projects'>): ProjectEntity {
  return {
    id: entry.id,
    name: entry.data.name,
    description: entry.data.description,
    link: entry.data.link,
    repo: entry.data.repo,
    icon: entry.data.icon,
    category: entry.data.category,
    order: entry.data.order,
    featured: entry.data.featured,
  };
}

export function groupProjectsByCategory(
  projects: readonly ProjectEntity[],
): readonly ProjectCategoryGroupEntity[] {
  const map = new Map<string, ProjectEntity[]>();

  for (const project of projects) {
    const list = map.get(project.category);
    if (list !== undefined) {
      list.push(project);
    } else {
      map.set(project.category, [project]);
    }
  }

  return Array.from(map.entries()).map(([category, items]) => ({
    category,
    projects: items.slice().sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
  }));
}

export class ProjectRepository {
  static async findAll(): Promise<readonly ProjectEntity[]> {
    const entries = await getCollection('projects');
    return entries
      .map(toProjectEntity)
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  }

  static async findGroupedByCategory(): Promise<readonly ProjectCategoryGroupEntity[]> {
    const all = await ProjectRepository.findAll();
    return groupProjectsByCategory(all);
  }
}
