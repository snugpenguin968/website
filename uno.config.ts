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
          'border-bottom': '1px solid rgba(125, 125, 125, 0.3)',
          transition: 'border-color 0.25s ease',
        },
        'a:hover': {
          'border-bottom-color': 'currentColor',
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
        light: '#222222',
        dark: '#e5e5e5',
      },
      surface: {
        light: '#ffffff',
        dark: '#050505',
      },
    },
  },
  shortcuts: {
    'bg-base': 'bg-surface-light dark:bg-surface-dark',
    'text-base-ink': 'text-ink-light dark:text-ink-dark',
    'text-muted': 'text-[#555555] dark:text-[#bbbbbb]',
    'text-subtle': 'text-[#777777] dark:text-[#888888]',
    'border-base': 'border-[#888888]/20 dark:border-[#888888]/25',
    'nav-link':
      'opacity-65 hover:opacity-100 transition-opacity duration-200 cursor-pointer select-none',
    'icon-btn':
      'inline-flex items-center justify-center opacity-65 hover:opacity-100 transition-opacity duration-200 cursor-pointer select-none',
    'prose-link':
      'border-b border-[#888888]/30 hover:border-current transition-colors duration-200',
    'card-minimal':
      'block rounded-md px-4 py-3 -mx-4 transition-colors duration-200 hover:bg-[#888888]/8 dark:hover:bg-[#888888]/10',
  },
  content: {
    pipeline: {
      include: [/\.(astro|mdx?|tsx?|html)($|\?)/],
    },
  },
});
