import { beforeEach, describe, expect, it } from 'vitest';
import { PortraitAdapter } from '../portrait.adapter';
import type { DitherAlgorithm } from '@models/entities';

describe('PortraitAdapter', () => {
  beforeEach(() => {
    PortraitAdapter.clearCache();
  });

  it.each<DitherAlgorithm>(['atkinson', 'floyd-steinberg', 'bayer4x4'])(
    'generates distinct light-mode and dark-mode PNG data URIs for %s',
    async (algorithm) => {
      const vm = await PortraitAdapter.resolve({
        algorithm,
        targetWidth: 96,
      });

      expect(vm.algorithm).toBe(algorithm);
      expect(vm.width).toBe(96);
      expect(vm.height).toBeGreaterThan(96);
      expect(vm.lightBgDataUri.startsWith('data:image/png;base64,')).toBe(true);
      expect(vm.darkBgDataUri.startsWith('data:image/png;base64,')).toBe(true);
      expect(vm.lightBgDataUri).not.toBe(vm.darkBgDataUri);
    },
  );

  it('memoizes identical config calls', async () => {
    const first = await PortraitAdapter.resolve({ targetWidth: 80 });
    const second = await PortraitAdapter.resolve({ targetWidth: 80 });
    expect(second).toBe(first);
  });
});
