import type { ImageMetadata } from 'astro';
import type { DitherAlgorithm } from '@models/entities';

export interface DitherPortraitViewModel {
  readonly lightBgDataUri: string;
  readonly darkBgDataUri: string;
  readonly originalImage: ImageMetadata | undefined;
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: string;
  readonly alt: string;
  readonly algorithm: DitherAlgorithm;
  readonly revealOnHover: boolean;
}
