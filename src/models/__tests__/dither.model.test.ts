import { describe, expect, it } from 'vitest';
import { applyToneCurve, ditherGrayscaleBitmap, renderMaskToRgba } from '../dither.model';
import type { DitherAlgorithm, DitherOptions, GrayscaleBitmap } from '../entities';

function makeSolidBitmap(width: number, height: number, value: number): GrayscaleBitmap {
  const pixels = new Uint8Array(width * height);
  pixels.fill(value);
  return { width, height, pixels };
}

const BASE_OPTIONS: Omit<DitherOptions, 'algorithm'> = {
  contrast: 1,
  gamma: 1,
  brightness: 0,
  threshold: 128,
};

describe('dither.model', () => {
  const algorithms: readonly DitherAlgorithm[] = ['atkinson', 'floyd-steinberg', 'bayer4x4'];

  it.each(algorithms)('%s produces all-shadow mask for pure black input', (algorithm) => {
    const bitmap = makeSolidBitmap(8, 8, 0);
    const mask = ditherGrayscaleBitmap(bitmap, { ...BASE_OPTIONS, algorithm });

    expect(mask.width).toBe(8);
    expect(mask.height).toBe(8);
    expect(mask.algorithm).toBe(algorithm);
    expect(mask.brightMask.every((v) => v === 0)).toBe(true);
  });

  it.each(algorithms)('%s produces all-highlight mask for pure white input', (algorithm) => {
    const bitmap = makeSolidBitmap(8, 8, 255);
    const mask = ditherGrayscaleBitmap(bitmap, { ...BASE_OPTIONS, algorithm });

    expect(mask.brightMask.every((v) => v === 1)).toBe(true);
  });

  it.each(algorithms)('%s approximates 50% ink density on 50% mid-gray input', (algorithm) => {
    const bitmap = makeSolidBitmap(32, 32, 128);
    const mask = ditherGrayscaleBitmap(bitmap, { ...BASE_OPTIONS, algorithm });
    const brightCount = mask.brightMask.reduce((acc, v) => acc + v, 0);
    const ratio = brightCount / mask.brightMask.length;

    expect(ratio).toBeGreaterThan(0.35);
    expect(ratio).toBeLessThan(0.65);
  });

  it('rejects mismatched pixel buffer length in applyToneCurve', () => {
    expect(() =>
      applyToneCurve(
        { width: 4, height: 4, pixels: new Uint8Array(10) },
        { brightness: 0, contrast: 1, gamma: 1 },
      ),
    ).toThrow(RangeError);
  });

  it('renders true-positive RGBA polarity for light-bg vs dark-bg', () => {
    const mask = {
      width: 2,
      height: 1,
      algorithm: 'atkinson' as const,
      // pixel 0 = shadow (0), pixel 1 = highlight (1)
      brightMask: new Uint8Array([0, 1]),
    };

    const lightBg = renderMaskToRgba(mask, {
      ink: { r: 20, g: 20, b: 20 },
      mode: 'light-bg',
    });
    // Light background: shadow pixel gets dark ink (alpha 255), highlight stays transparent (alpha 0)
    expect(Array.from(lightBg.slice(0, 4))).toEqual([20, 20, 20, 255]);
    expect(Array.from(lightBg.slice(4, 8))).toEqual([0, 0, 0, 0]);

    const darkBg = renderMaskToRgba(mask, {
      ink: { r: 235, g: 235, b: 235 },
      mode: 'dark-bg',
    });
    // Dark background: shadow pixel stays transparent (alpha 0), highlight gets light ink (alpha 255)
    expect(Array.from(darkBg.slice(0, 4))).toEqual([0, 0, 0, 0]);
    expect(Array.from(darkBg.slice(4, 8))).toEqual([235, 235, 235, 255]);
  });
});
