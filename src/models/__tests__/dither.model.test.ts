import { describe, expect, it } from 'vitest';
import { applyToneCurve, ditherGrayscaleBitmap, renderMaskToRgba } from '../dither.model';
import type { DitherAlgorithm, DitherOptions, GrayscaleBitmap } from '../entities';

function makeSolidBitmap(width: number, height: number, value: number): GrayscaleBitmap {
  const pixels = new Uint8Array(width * height);
  pixels.fill(value);
  return { width, height, pixels };
}

const BASE_OPTIONS: Omit<DitherOptions, 'algorithm'> = {
  levels: 2,
  contrast: 1,
  gamma: 1,
  brightness: 0,
  threshold: 128,
};

describe('dither.model', () => {
  const algorithms: readonly DitherAlgorithm[] = ['atkinson', 'floyd-steinberg', 'bayer4x4'];

  it.each(algorithms)('%s produces all-shadow luminance for pure black input', (algorithm) => {
    const bitmap = makeSolidBitmap(8, 8, 0);
    const mask = ditherGrayscaleBitmap(bitmap, { ...BASE_OPTIONS, algorithm });

    expect(mask.width).toBe(8);
    expect(mask.height).toBe(8);
    expect(mask.algorithm).toBe(algorithm);
    expect(mask.luminance.every((v) => v === 0)).toBe(true);
  });

  it.each(algorithms)('%s produces all-highlight luminance for pure white input', (algorithm) => {
    const bitmap = makeSolidBitmap(8, 8, 255);
    const mask = ditherGrayscaleBitmap(bitmap, { ...BASE_OPTIONS, algorithm });

    expect(mask.luminance.every((v) => v === 255)).toBe(true);
  });

  it.each(algorithms)('%s approximates 50% ink density on 50% mid-gray input', (algorithm) => {
    const bitmap = makeSolidBitmap(32, 32, 128);
    const mask = ditherGrayscaleBitmap(bitmap, { ...BASE_OPTIONS, algorithm });
    const mean = mask.luminance.reduce((acc, v) => acc + v, 0) / (mask.luminance.length * 255);

    expect(mean).toBeGreaterThan(0.35);
    expect(mean).toBeLessThan(0.65);
  });

  it('supports multi-level quantization for softer dithering', () => {
    const bitmap = makeSolidBitmap(16, 16, 128);
    const mask = ditherGrayscaleBitmap(bitmap, {
      ...BASE_OPTIONS,
      algorithm: 'atkinson',
      levels: 5,
    });

    expect(mask.levels).toBe(5);
    expect(mask.luminance.every((v) => v === 128)).toBe(true);
  });

  it('rejects mismatched pixel buffer length in applyToneCurve', () => {
    expect(() =>
      applyToneCurve(
        { width: 4, height: 4, pixels: new Uint8Array(10) },
        { brightness: 0, contrast: 1, gamma: 1 },
      ),
    ).toThrow(RangeError);
  });

  it('renders true-positive RGBA polarity and ink opacity for light-bg vs dark-bg', () => {
    const mask = {
      width: 2,
      height: 1,
      algorithm: 'atkinson' as const,
      levels: 2,
      luminance: new Uint8Array([0, 255]),
    };

    const lightBg = renderMaskToRgba(mask, {
      ink: { r: 20, g: 20, b: 20 },
      mode: 'light-bg',
      opacity: 1,
    });
    expect(Array.from(lightBg.slice(0, 4))).toEqual([20, 20, 20, 255]);
    expect(Array.from(lightBg.slice(4, 8))).toEqual([0, 0, 0, 0]);

    const darkBg = renderMaskToRgba(mask, {
      ink: { r: 235, g: 235, b: 235 },
      mode: 'dark-bg',
      opacity: 0.5,
    });
    expect(Array.from(darkBg.slice(0, 4))).toEqual([0, 0, 0, 0]);
    expect(Array.from(darkBg.slice(4, 8))).toEqual([235, 235, 235, 128]);
  });
});
