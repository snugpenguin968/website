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
- **Portrait dithering**: Adjust `portraitDither.algorithm` (`'atkinson'`, `'floyd-steinberg'`, or `'bayer4x4'`), `targetWidth`, `contrast`, and `revealOnHover`.

## Adding Content

- **Blog posts**: Add `.md` or `.mdx` files under `src/content/blog/`.
- **Experiences**: Add `.json` files under `src/content/experiences/` with any `category` subsection (e.g., `"Work Experience"`, `"Projects"`, `"Research"`), plus optional `role`, `period`, `location`, and `link` fields.
- **Notes**: Add `.md` or `.mdx` files under `src/content/notes/`.

## Deploying with Cloudflare Pages

Connect this GitHub repository in the Cloudflare Pages dashboard with:

- **Framework preset**: Astro
- **Build command**: `npm run build`
- **Build output directory**: `dist`
