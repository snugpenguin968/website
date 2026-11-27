import type { DitherAlgorithm, RgbColor } from './site.entity';

export interface GrayscaleBitmap {
  readonly width: number;
  readonly height: number;
  /** Row-major 8-bit luminance values in [0, 255]. */
  readonly pixels: Uint8Array;
}

export interface DitherOptions {
  readonly algorithm: DitherAlgorithm;
  readonly contrast: number;
  readonly gamma: number;
  readonly brightness: number;
  readonly threshold: number;
}

export interface DitheredLuminanceMask {
  readonly width: number;
  readonly height: number;
  readonly algorithm: DitherAlgorithm;
  /**
   * Row-major binary luminance mask:
   * - `1` = bright / highlight pixel
   * - `0` = dark / shadow pixel
   */
  readonly brightMask: Uint8Array;
}

export type PolarityMode = 'light-bg' | 'dark-bg';

export interface RgbaRasterOptions {
  readonly ink: RgbColor;
  readonly mode: PolarityMode;
}
