import type {
  DitheredLuminanceMask,
  DitherOptions,
  GrayscaleBitmap,
  RgbaRasterOptions,
} from './entities/dither.entity';

const BAYER_4X4: readonly (readonly [number, number, number, number])[] = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function clampByte(value: number): number {
  if (value <= 0) return 0;
  if (value >= 255) return 255;
  return value;
}

function clampUnit(value: number): number {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

function normalizeLevels(levels: number): number {
  return Math.max(2, Math.round(levels));
}

function quantizeValue(value: number, levels: number, threshold: number): number {
  if (levels <= 2) {
    return value >= threshold ? 255 : 0;
  }
  const shifted = clampByte(value + (128 - threshold));
  const step = 255 / (levels - 1);
  return clampByte(Math.round(Math.round(shifted / step) * step));
}

export function applyToneCurve(
  bitmap: GrayscaleBitmap,
  options: Pick<DitherOptions, 'brightness' | 'contrast' | 'gamma'>,
): Float32Array {
  const { width, height, pixels } = bitmap;
  const expectedLength = width * height;
  if (pixels.length !== expectedLength) {
    throw new RangeError(
      `GrayscaleBitmap pixel buffer length (${pixels.length}) does not match ${width}x${height} (${expectedLength}).`,
    );
  }

  const out = new Float32Array(expectedLength);
  const safeGamma = options.gamma > 0 ? options.gamma : 1;
  const invGamma = 1 / safeGamma;

  for (let i = 0; i < expectedLength; i += 1) {
    const raw = pixels[i] ?? 0;
    const shifted = raw + options.brightness;
    const contrasted = (shifted - 128) * options.contrast + 128;
    const clamped = clampByte(contrasted);
    const gammaAdjusted = 255 * Math.pow(clamped / 255, invGamma);
    out[i] = clampByte(gammaAdjusted);
  }

  return out;
}

function diffuseError(
  buffer: Float32Array,
  width: number,
  height: number,
  x: number,
  y: number,
  delta: number,
): void {
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return;
  }
  const idx = y * width + x;
  const current = buffer[idx];
  if (current !== undefined) {
    buffer[idx] = current + delta;
  }
}

function runAtkinson(
  buffer: Float32Array,
  width: number,
  height: number,
  levels: number,
  threshold: number,
): Uint8Array {
  const luminance = new Uint8Array(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = y * width + x;
      const oldVal = buffer[idx] ?? 0;
      const newVal = quantizeValue(oldVal, levels, threshold);
      luminance[idx] = newVal;

      const err = (oldVal - newVal) / 8;
      diffuseError(buffer, width, height, x + 1, y, err);
      diffuseError(buffer, width, height, x + 2, y, err);
      diffuseError(buffer, width, height, x - 1, y + 1, err);
      diffuseError(buffer, width, height, x, y + 1, err);
      diffuseError(buffer, width, height, x + 1, y + 1, err);
      diffuseError(buffer, width, height, x, y + 2, err);
    }
  }

  return luminance;
}

function runFloydSteinberg(
  buffer: Float32Array,
  width: number,
  height: number,
  levels: number,
  threshold: number,
): Uint8Array {
  const luminance = new Uint8Array(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = y * width + x;
      const oldVal = buffer[idx] ?? 0;
      const newVal = quantizeValue(oldVal, levels, threshold);
      luminance[idx] = newVal;

      const err = oldVal - newVal;
      diffuseError(buffer, width, height, x + 1, y, (err * 7) / 16);
      diffuseError(buffer, width, height, x - 1, y + 1, (err * 3) / 16);
      diffuseError(buffer, width, height, x, y + 1, (err * 5) / 16);
      diffuseError(buffer, width, height, x + 1, y + 1, (err * 1) / 16);
    }
  }

  return luminance;
}

function runBayer4x4(
  buffer: Float32Array,
  width: number,
  height: number,
  levels: number,
  threshold: number,
): Uint8Array {
  const luminance = new Uint8Array(width * height);
  const step = 255 / (levels - 1);

  for (let y = 0; y < height; y += 1) {
    const matrixRow = BAYER_4X4[y & 3];
    for (let x = 0; x < width; x += 1) {
      const idx = y * width + x;
      const val = buffer[idx] ?? 0;
      const cell = matrixRow?.[x & 3] ?? 0;
      const normalizedBias = (cell + 0.5) / 16 - 0.5;
      const ditheredVal = val + normalizedBias * step;
      luminance[idx] = quantizeValue(ditheredVal, levels, threshold);
    }
  }

  return luminance;
}

export function ditherGrayscaleBitmap(
  bitmap: GrayscaleBitmap,
  options: DitherOptions,
): DitheredLuminanceMask {
  if (bitmap.width <= 0 || bitmap.height <= 0) {
    throw new RangeError('GrayscaleBitmap dimensions must be positive integers.');
  }

  const levels = normalizeLevels(options.levels);
  const adjusted = applyToneCurve(bitmap, options);
  let luminance: Uint8Array;

  switch (options.algorithm) {
    case 'atkinson':
      luminance = runAtkinson(adjusted, bitmap.width, bitmap.height, levels, options.threshold);
      break;
    case 'floyd-steinberg':
      luminance = runFloydSteinberg(
        adjusted,
        bitmap.width,
        bitmap.height,
        levels,
        options.threshold,
      );
      break;
    case 'bayer4x4':
      luminance = runBayer4x4(adjusted, bitmap.width, bitmap.height, levels, options.threshold);
      break;
    default: {
      const exhaustive: never = options.algorithm;
      throw new Error(`Unsupported dither algorithm: ${String(exhaustive)}`);
    }
  }

  return {
    width: bitmap.width,
    height: bitmap.height,
    algorithm: options.algorithm,
    levels,
    luminance,
  };
}

export function renderMaskToRgba(
  mask: DitheredLuminanceMask,
  options: RgbaRasterOptions,
): Uint8Array {
  const pixelCount = mask.width * mask.height;
  const rgba = new Uint8Array(pixelCount * 4);
  const { r, g, b } = options.ink;
  const opacityScale = clampUnit(options.opacity);
  const isDarkBg = options.mode === 'dark-bg';

  for (let i = 0; i < pixelCount; i += 1) {
    const lum = mask.luminance[i] ?? 0;
    const rawIntensity = isDarkBg ? lum : 255 - lum;
    const alpha = Math.round(rawIntensity * opacityScale);

    if (alpha > 0) {
      const offset = i * 4;
      rgba[offset] = r;
      rgba[offset + 1] = g;
      rgba[offset + 2] = b;
      rgba[offset + 3] = alpha;
    }
  }

  return rgba;
}
