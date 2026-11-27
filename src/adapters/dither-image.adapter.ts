import { existsSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import sharp from 'sharp';
import type { ImageMetadata } from 'astro';
import { ditherGrayscaleBitmap, renderMaskToRgba } from '@models/dither.model';
import { SITE_CONFIG } from '@models/site.model';
import type { PortraitDitherConfig } from '@models/entities';
import type { DitherPortraitViewModel } from './view-models';

export interface DitherImageInput {
  readonly filePath: string;
  readonly alt: string;
  readonly originalImage?: ImageMetadata;
  readonly config?: Partial<PortraitDitherConfig>;
}

const cache = new Map<string, DitherPortraitViewModel>();

function resolveFilePath(filePath: string): string {
  if (isAbsolute(filePath) && existsSync(filePath)) {
    return filePath;
  }
  return resolve(process.cwd(), filePath);
}

function buildCacheKey(resolvedPath: string, alt: string, config: PortraitDitherConfig): string {
  return JSON.stringify({ resolvedPath, alt, config });
}

async function encodeRgbaToPngDataUri(
  rgba: Uint8Array,
  width: number,
  height: number,
): Promise<string> {
  const pngBuffer = await sharp(rgba, {
    raw: { width, height, channels: 4 },
  })
    .png({
      compressionLevel: 9,
    })
    .toBuffer();

  return `data:image/png;base64,${pngBuffer.toString('base64')}`;
}

export class DitherImageAdapter {
  static async ditherFile(input: DitherImageInput): Promise<DitherPortraitViewModel> {
    const resolvedPath = resolveFilePath(input.filePath);
    const config: PortraitDitherConfig = {
      ...SITE_CONFIG.portraitDither,
      ...input.config,
    };

    const key = buildCacheKey(resolvedPath, input.alt, config);
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const { data, info } = await sharp(resolvedPath)
      .resize({ width: config.targetWidth, withoutEnlargement: true })
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const mask = ditherGrayscaleBitmap(
      {
        width: info.width,
        height: info.height,
        pixels: new Uint8Array(data.buffer, data.byteOffset, data.byteLength),
      },
      {
        algorithm: config.algorithm,
        levels: config.levels,
        contrast: config.contrast,
        gamma: config.gamma,
        brightness: config.brightness,
        threshold: config.threshold,
      },
    );

    const lightRgba = renderMaskToRgba(mask, {
      ink: config.lightInk,
      mode: 'light-bg',
      opacity: config.inkOpacity,
    });
    const darkRgba = renderMaskToRgba(mask, {
      ink: config.darkInk,
      mode: 'dark-bg',
      opacity: config.inkOpacity,
    });

    const [lightBgDataUri, darkBgDataUri] = await Promise.all([
      encodeRgbaToPngDataUri(lightRgba, mask.width, mask.height),
      encodeRgbaToPngDataUri(darkRgba, mask.width, mask.height),
    ]);

    const viewModel: DitherPortraitViewModel = {
      lightBgDataUri,
      darkBgDataUri,
      originalImage: config.revealOnHover ? input.originalImage : undefined,
      width: mask.width,
      height: mask.height,
      aspectRatio: `${mask.width} / ${mask.height}`,
      alt: input.alt,
      algorithm: config.algorithm,
      revealOnHover: config.revealOnHover,
    };

    cache.set(key, viewModel);
    return viewModel;
  }

  static clearCache(): void {
    cache.clear();
  }
}

export function ditherImageFile(input: DitherImageInput): Promise<DitherPortraitViewModel> {
  return DitherImageAdapter.ditherFile(input);
}
