export interface PhotoEntity {
  readonly id: string;
  readonly title: string;
  readonly src: string;
  readonly alt: string;
  readonly caption: string | undefined;
  readonly takenAt: Date | undefined;
  readonly location: string | undefined;
  readonly order: number;
  readonly draft: boolean;
}
