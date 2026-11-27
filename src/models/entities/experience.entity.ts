export interface ExperienceEntity {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly role: string | undefined;
  readonly period: string | undefined;
  readonly location: string | undefined;
  readonly link: string | undefined;
  readonly repo: string | undefined;
  readonly icon: string;
  readonly order: number;
  readonly featured: boolean;
}

export interface ExperienceCategoryGroupEntity {
  readonly category: string;
  readonly experiences: readonly ExperienceEntity[];
}
