import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string().min(1)).default([]),
    draft: z.boolean().default(false),
    lang: z.string().default('en'),
    durationOverrideMinutes: z.number().int().positive().optional(),
  }),
});

const experiences = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/experiences' }),
  schema: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    category: z.string().min(1),
    role: z.string().min(1).optional(),
    period: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    link: z.string().url().optional(),
    repo: z.string().url().optional(),
    icon: z.string().min(1).default('i-ri-sparkling-line'),
    order: z.number().int().default(0),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const highlights = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/highlights' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date().optional(),
    category: z.string().min(1).optional(),
    link: z.string().url().optional(),
    icon: z.string().min(1).default('i-ri-star-line'),
    order: z.number().int().default(0),
    draft: z.boolean().default(false),
  }),
});

const photos = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/photos' }),
  schema: z.object({
    title: z.string().min(1),
    src: z.string().min(1),
    alt: z.string().min(1),
    caption: z.string().min(1).optional(),
    takenAt: z.coerce.date().optional(),
    location: z.string().min(1).optional(),
    order: z.number().int().default(0),
    draft: z.boolean().default(false),
  }),
});

const shorts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/shorts' }),
  schema: z.object({
    title: z.string().min(1).optional(),
    publishedAt: z.coerce.date(),
    tags: z.array(z.string().min(1)).default([]),
    draft: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string().min(1),
    publishedAt: z.coerce.date(),
    tags: z.array(z.string().min(1)).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog,
  experiences,
  highlights,
  photos,
  shorts,
  notes,
};
