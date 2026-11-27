import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

export default defineConfig({
  presets: [
    presetWind3({
      dark: 'class',
    }),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTypography({
      cssExtend: {
        'h1, h2, h3, h4': {
          'font-weight': '700',
          'letter-spacing': '-0.02em',
        },
        a: {
          'font-weight': 'inherit',
          'text-decoration': 'none',
          'border-bottom': '1px solid var(--c-border)',
          transition: 'border-color 0.25s ease, color 0.25s ease',
        },
        'a:hover': {
          'border-bottom-color': 'var(--c-accent)',
        },
        code: {
          'font-family': 'var(--font-mono)',
          'font-size': '0.9em',
        },
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    fontFamily: {
      sans: 'var(--font-sans)',
      mono: 'var(--font-mono)',
      condensed: 'var(--font-condensed)',
    },
    colors: {
      ink: {
        light: '#23201c',
        dark: '#dfd9ce',
      },
      surface: {
        light: '#f6f3eb',
        dark: '#181715',
      },
      elevated: {
        light: '#ede8dc',
        dark: '#211f1c',
      },
    },
  },
  shortcuts: {
    'bg-base': 'bg-surface-light dark:bg-surface-dark',
    'bg-elevated': 'bg-elevated-light dark:bg-elevated-dark',
    'text-base-ink': 'text-ink-light dark:text-ink-dark',
    'text-muted': 'text-[#544f47] dark:text-[#b5aea2]',
    'text-subtle': 'text-[#686258] dark:text-[#8e887d]',
    'border-base': 'border-[rgba(35,32,28,0.12)] dark:border-[rgba(223,217,206,0.12)]',
    'nav-link':
      'opacity-65 hover:opacity-100 hover:text-[var(--c-accent)] transition-all duration-200 cursor-pointer select-none',
    'icon-btn':
      'inline-flex items-center justify-center opacity-65 hover:opacity-100 hover:text-[var(--c-accent)] transition-all duration-200 cursor-pointer select-none',
    'prose-link':
      'border-b border-[color-mix(in_srgb,var(--c-accent)_65%,transparent)] hover:border-[var(--c-accent)] hover:text-[var(--c-accent)] transition-colors duration-200',
    'card-minimal':
      'block rounded-md px-3 py-3 -mx-3 sm:px-4 sm:-mx-4 transition-colors duration-200 hover:bg-[#ede8dc]/75 dark:hover:bg-[#211f1c]/85',
  },
  content: {
    filesystem: ['src/content/**/*.{json,md,mdx}'],
    pipeline: {
      include: [/\.(astro|mdx?|tsx?|json|html)($|\?)/],
    },
  },
});
