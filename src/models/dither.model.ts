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

/**
 * Applies brightness, contrast, and gamma adjustment to an 8-bit grayscale bitmap,
 * returning a working Float32Array in [0, 255].
 */
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

      // Atkinson distributes 6/8 of quantization error (1/8 to each of 6 neighbors),
      // preserving crisp highlights and deep shadows.
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
      // Scale Bayer value [0..15] into (0..255) centered at 128
      const cellThreshold = ((cell + 0.5) / 16) * 255 + thresholdBias;
      brightMask[idx] = val >= cellThreshold ? 1 : 0;
    }
  }

  return brightMask;
}

/**
 * Pure domain dithering engine.
 * Converts an 8-bit grayscale bitmap into a 1-bit binary luminance mask
 * (`1` = bright highlight, `0` = dark shadow) using the configured algorithm.
 */
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

/**
 * Renders a 1-bit luminance mask into an RGBA byte buffer with true-positive
 * luminance polarity for either a light background or dark background:
 * - `light-bg`: dark ink dots mark shadow pixels (`brightMask === 0`); highlights are transparent.
 * - `dark-bg`: light ink dots mark highlight pixels (`brightMask === 1`); shadows are transparent.
 */
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
