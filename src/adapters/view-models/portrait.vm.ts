import type { ImageMetadata } from 'astro';
import type { DitherAlgorithm } from '@models/entities';

export interface DitherPortraitViewModel {
  /** Base64 PNG data URI with dark ink dots on transparent background (for light mode). */
  readonly lightBgDataUri: string;
  /** Base64 PNG data URI with light ink dots on transparent background (for dark mode). */
  readonly darkBgDataUri: string;
  /** Original portrait image metadata when revealOnHover is enabled. */
  readonly originalImage: ImageMetadata | undefined;
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: string;
  readonly alt: string;
  readonly algorithm: DitherAlgorithm;
  readonly revealOnHover: boolean;
}
