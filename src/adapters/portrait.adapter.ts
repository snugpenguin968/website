import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import mePortraitImage from '@assets/images/me.png';
import { SITE_CONFIG } from '@models/site.model';
import type { PortraitDitherConfig } from '@models/entities';
import { DitherImageAdapter } from './dither-image.adapter';
import type { DitherPortraitData } from '@components/DitherPortrait.astro';

function resolvePortraitAssetPath(): string {
  const fromProjectRoot = resolve(process.cwd(), 'src/assets/images/me.png');
  if (existsSync(fromProjectRoot)) {
    return fromProjectRoot;
  }
  return fileURLToPath(new URL('../assets/images/me.png', import.meta.url));
}

const PORTRAIT_ASSET_PATH = resolvePortraitAssetPath();

export class PortraitAdapter {
  static resolve(
    overrides?: Partial<PortraitDitherConfig>,
  ): Promise<DitherPortraitData> {
    return DitherImageAdapter.ditherFile({
      filePath: PORTRAIT_ASSET_PATH,
      alt: `Dithered portrait of ${SITE_CONFIG.author.name}`,
      originalImage: mePortraitImage,
      ...(overrides !== undefined ? { config: overrides } : {}),
    });
  }

  static clearCache(): void {
    DitherImageAdapter.clearCache();
  }
}
