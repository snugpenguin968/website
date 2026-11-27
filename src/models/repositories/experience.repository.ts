import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type {
  ExperienceCategoryGroupEntity,
  ExperienceEntity,
} from '../entities/experience.entity';

function toExperienceEntity(entry: CollectionEntry<'experiences'>): ExperienceEntity {
  return {
    id: entry.id,
    name: entry.data.name,
    description: entry.data.description,
    category: entry.data.category,
    role: entry.data.role,
    period: entry.data.period,
    location: entry.data.location,
    link: entry.data.link,
    repo: entry.data.repo,
    icon: entry.data.icon,
    order: entry.data.order,
    featured: entry.data.featured,
    draft: entry.data.draft,
  };
}

export function groupExperiencesByCategory(
  experiences: readonly ExperienceEntity[],
): readonly ExperienceCategoryGroupEntity[] {
  const map = new Map<string, ExperienceEntity[]>();

  for (const item of experiences) {
    const list = map.get(item.category);
    if (list !== undefined) {
      list.push(item);
    } else {
      map.set(item.category, [item]);
    }
  }

  return Array.from(map.entries()).map(([category, items]) => ({
    category,
    experiences: items
      .slice()
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
  }));
}

export class ExperienceRepository {
  static async findAll(includeDrafts: boolean = false): Promise<readonly ExperienceEntity[]> {
    const entries = await getCollection('experiences', (entry) =>
      includeDrafts ? true : !entry.data.draft,
    );
    return entries
      .map(toExperienceEntity)
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  }

  static async findGroupedByCategory(
    includeDrafts: boolean = false,
  ): Promise<readonly ExperienceCategoryGroupEntity[]> {
    const all = await ExperienceRepository.findAll(includeDrafts);
    return groupExperiencesByCategory(all);
  }
}
