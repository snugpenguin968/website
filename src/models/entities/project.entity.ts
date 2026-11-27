export interface ProjectEntity {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly link: string;
  readonly repo: string | undefined;
  readonly icon: string;
  readonly category: string;
  readonly order: number;
  readonly featured: boolean;
}

export interface ProjectCategoryGroupEntity {
  readonly category: string;
  readonly projects: readonly ProjectEntity[];
}
