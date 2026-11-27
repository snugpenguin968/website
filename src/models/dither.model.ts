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
  threshold: number,
): Uint8Array {
  const brightMask = new Uint8Array(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = y * width + x;
      const oldVal = buffer[idx] ?? 0;
      const isBright = oldVal >= threshold;
      const newVal = isBright ? 255 : 0;
      brightMask[idx] = isBright ? 1 : 0;

      const err = (oldVal - newVal) / 8;
      diffuseError(buffer, width, height, x + 1, y, err);
      diffuseError(buffer, width, height, x + 2, y, err);
      diffuseError(buffer, width, height, x - 1, y + 1, err);
      diffuseError(buffer, width, height, x, y + 1, err);
      diffuseError(buffer, width, height, x + 1, y + 1, err);
      diffuseError(buffer, width, height, x, y + 2, err);
    }
  }

  return brightMask;
}

function runFloydSteinberg(
  buffer: Float32Array,
  width: number,
  height: number,
  threshold: number,
): Uint8Array {
  const brightMask = new Uint8Array(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = y * width + x;
      const oldVal = buffer[idx] ?? 0;
      const isBright = oldVal >= threshold;
      const newVal = isBright ? 255 : 0;
      brightMask[idx] = isBright ? 1 : 0;

      const err = oldVal - newVal;
      diffuseError(buffer, width, height, x + 1, y, (err * 7) / 16);
      diffuseError(buffer, width, height, x - 1, y + 1, (err * 3) / 16);
      diffuseError(buffer, width, height, x, y + 1, (err * 5) / 16);
      diffuseError(buffer, width, height, x + 1, y + 1, (err * 1) / 16);
    }
  }

  return brightMask;
}

function runBayer4x4(
  buffer: Float32Array,
  width: number,
  height: number,
  threshold: number,
): Uint8Array {
  const brightMask = new Uint8Array(width * height);
  const thresholdBias = threshold - 128;

  for (let y = 0; y < height; y += 1) {
    const matrixRow = BAYER_4X4[y & 3];
    for (let x = 0; x < width; x += 1) {
      const idx = y * width + x;
      const val = buffer[idx] ?? 0;
      const cell = matrixRow?.[x & 3] ?? 0;
      const cellThreshold = ((cell + 0.5) / 16) * 255 + thresholdBias;
      brightMask[idx] = val >= cellThreshold ? 1 : 0;
    }
  }

  return brightMask;
}

export function ditherGrayscaleBitmap(
  bitmap: GrayscaleBitmap,
  options: DitherOptions,
): DitheredLuminanceMask {
  if (bitmap.width <= 0 || bitmap.height <= 0) {
    throw new RangeError('GrayscaleBitmap dimensions must be positive integers.');
  }

  const adjusted = applyToneCurve(bitmap, options);
  let brightMask: Uint8Array;

  switch (options.algorithm) {
    case 'atkinson':
      brightMask = runAtkinson(adjusted, bitmap.width, bitmap.height, options.threshold);
      break;
    case 'floyd-steinberg':
      brightMask = runFloydSteinberg(adjusted, bitmap.width, bitmap.height, options.threshold);
      break;
    case 'bayer4x4':
      brightMask = runBayer4x4(adjusted, bitmap.width, bitmap.height, options.threshold);
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
    brightMask,
  };
}

export function renderMaskToRgba(
  mask: DitheredLuminanceMask,
  options: RgbaRasterOptions,
): Uint8Array {
  const pixelCount = mask.width * mask.height;
  const rgba = new Uint8Array(pixelCount * 4);
  const { r, g, b } = options.ink;
  const drawWhenBright = options.mode === 'dark-bg';

  for (let i = 0; i < pixelCount; i += 1) {
    const isBright = mask.brightMask[i] === 1;
    const shouldDrawInk = drawWhenBright ? isBright : !isBright;

    if (shouldDrawInk) {
      const offset = i * 4;
      rgba[offset] = r;
      rgba[offset + 1] = g;
      rgba[offset + 2] = b;
      rgba[offset + 3] = 255;
    }
  }

  return rgba;
}
