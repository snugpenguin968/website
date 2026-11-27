import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import mePortraitImage from '@assets/images/me.png';
import { ditherGrayscaleBitmap, renderMaskToRgba } from '@models/dither.model';
import { SITE_CONFIG } from '@models/site.model';
import type { PortraitDitherConfig } from '@models/entities';
import type { DitherPortraitViewModel } from './view-models';

function resolvePortraitAssetPath(): string {
  const fromProjectRoot = resolve(process.cwd(), 'src/assets/images/me.png');
  if (existsSync(fromProjectRoot)) {
    return fromProjectRoot;
  }
  return fileURLToPath(new URL('../assets/images/me.png', import.meta.url));
}

const PORTRAIT_ASSET_PATH = resolvePortraitAssetPath();

const cache = new Map<string, DitherPortraitViewModel>();

function buildCacheKey(config: PortraitDitherConfig): string {
  return JSON.stringify(config);
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
      palette: true,
      colors: 4,
      compressionLevel: 9,
    })
    .toBuffer();

  return `data:image/png;base64,${pngBuffer.toString('base64')}`;
}

export class PortraitAdapter {
  static async resolve(
    overrides?: Partial<PortraitDitherConfig>,
  ): Promise<DitherPortraitViewModel> {
    const config: PortraitDitherConfig = {
      ...SITE_CONFIG.portraitDither,
      ...overrides,
    };

    const key = buildCacheKey(config);
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const { data, info } = await sharp(PORTRAIT_ASSET_PATH)
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
        contrast: config.contrast,
        gamma: config.gamma,
        brightness: config.brightness,
        threshold: config.threshold,
      },
    );

    const lightRgba = renderMaskToRgba(mask, {
      ink: config.lightInk,
      mode: 'light-bg',
    });
    const darkRgba = renderMaskToRgba(mask, {
      ink: config.darkInk,
      mode: 'dark-bg',
    });

    const [lightBgDataUri, darkBgDataUri] = await Promise.all([
      encodeRgbaToPngDataUri(lightRgba, mask.width, mask.height),
      encodeRgbaToPngDataUri(darkRgba, mask.width, mask.height),
    ]);

    const viewModel: DitherPortraitViewModel = {
      lightBgDataUri,
      darkBgDataUri,
      originalImage: config.revealOnHover ? mePortraitImage : undefined,
      width: mask.width,
      height: mask.height,
      aspectRatio: `${mask.width} / ${mask.height}`,
      alt: `Dithered portrait of ${SITE_CONFIG.author.name}`,
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
