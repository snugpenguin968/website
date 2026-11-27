import { beforeEach, describe, expect, it } from 'vitest';
import { DitherImageAdapter, ditherImageFile } from '../dither-image.adapter';

describe('DitherImageAdapter', () => {
  beforeEach(() => {
    DitherImageAdapter.clearCache();
  });

  it('dithers an arbitrary image path with custom options', async () => {
    const vm = await ditherImageFile({
      filePath: 'src/assets/images/me.png',
      alt: 'Custom photo',
      config: {
        algorithm: 'bayer4x4',
        levels: 4,
        targetWidth: 80,
        inkOpacity: 0.75,
        revealOnHover: false,
      },
    });

    expect(vm.alt).toBe('Custom photo');
    expect(vm.algorithm).toBe('bayer4x4');
    expect(vm.width).toBe(80);
    expect(vm.revealOnHover).toBe(false);
    expect(vm.originalImage).toBeUndefined();
    expect(vm.lightBgDataUri.startsWith('data:image/png;base64,')).toBe(true);
    expect(vm.darkBgDataUri.startsWith('data:image/png;base64,')).toBe(true);
  });
});
