# Personal Website

Personal website built with Astro, UnoCSS, and strict TypeScript, inspired by [Astro AntfuStyle Theme](https://github.com/lin-stephanie/astro-antfustyle-theme).

## Development

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — Start local development server
- `npm run build` — Build static output to `dist/`
- `npm run preview` — Preview production build locally
- `npm run check` — Run `astro check` and strict `tsc --noEmit`
- `npm run check:arch` — Verify layer import boundaries
- `npm test` — Run Vitest unit tests

## Customization

Edit `src/models/site.model.ts`:

- **Background effect**: Set `background` to `'plum'`, `'rose'`, `'dot'`, or `'none'`.
- **Portrait dithering**: Adjust `portraitDither.algorithm` (`'atkinson'`, `'floyd-steinberg'`, or `'bayer4x4'`), `levels` (`2` for classic 1-bit, `4`–`8` for softer multi-level dithering), `inkOpacity` (`0`–`1`), `targetWidth`, `contrast`, and `revealOnHover`.

### Dithering Any Arbitrary Image

Call `ditherImageFile` from `@adapters/dither-image.adapter` on the server and pass the returned view model into `<DitherPortrait />`:

```astro
---
import { ditherImageFile } from '@adapters/dither-image.adapter';
import DitherPortrait from '@components/DitherPortrait.astro';
import myPhoto from '@assets/images/my-photo.png';

const dithered = await ditherImageFile({
  filePath: 'src/assets/images/my-photo.png',
  alt: 'My photo',
  originalImage: myPhoto,
  config: {
    algorithm: 'atkinson',
    levels: 5,
    targetWidth: 480,
    inkOpacity: 0.88,
    revealOnHover: true,
  },
});
---

<DitherPortrait portrait={dithered} />
```

## Adding Content

Every collection supports `draft: true` to keep unfinished entries hidden from the live site.

- **Experiences** (always visible in nav): Add `.json` files under `src/content/experiences/` with any `category` subsection (e.g., `"Work Experience"`, `"Projects"`, `"Research"`), plus optional `role`, `period`, `location`, `link`, and `draft`.
- **Blog** (always visible in nav): Add `.md` or `.mdx` files under `src/content/blog/`.
- **Highlights** (shown in nav once at least 1 published entry exists): Add `.json` files under `src/content/highlights/`.
- **Photos** (shown in nav once at least 1 published entry exists): Add `.json` files under `src/content/photos/`.
- **Shorts** (shown in nav once at least 1 published entry exists): Add `.md` or `.mdx` files under `src/content/shorts/`.
- **Notes** (shown in nav once at least 1 published entry exists): Add `.md` or `.mdx` files under `src/content/notes/`.

## Deploying with Cloudflare Pages

Connect this GitHub repository in the Cloudflare Pages dashboard with:

- **Framework preset**: Astro
- **Build command**: `npm run build`
- **Build output directory**: `dist`
