export interface HighlightEntity {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly date: Date | undefined;
  readonly category: string | undefined;
  readonly link: string | undefined;
  readonly icon: string;
  readonly order: number;
  readonly draft: boolean;
}
