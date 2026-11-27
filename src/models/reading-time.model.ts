import type { ReadingTimeEntity } from './entities/blog.entity';

const DEFAULT_WORDS_PER_MINUTE = 220;

/**
 * Strips frontmatter, fenced code blocks, inline code, HTML/MDX tags,
 * and markdown punctuation to estimate natural reading time.
 */
export function estimateReadingTime(
  rawBody: string,
  wordsPerMinute: number = DEFAULT_WORDS_PER_MINUTE,
  overrideMinutes?: number,
): ReadingTimeEntity {
  const cleaned = rawBody
    .replace(/^---[\s\S]*?---\s*/u, '')
    .replace(/```[\s\S]*?```/gu, ' ')
    .replace(/`[^`]*`/gu, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/gu, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/[#>*_~|]/gu, ' ')
    .trim();

  const words = cleaned.length === 0 ? 0 : cleaned.split(/\s+/u).filter(Boolean).length;
  const computedMinutes = words === 0 ? 1 : Math.max(1, Math.ceil(words / wordsPerMinute));

  return {
    words,
    minutes: overrideMinutes !== undefined ? Math.max(1, Math.round(overrideMinutes)) : computedMinutes,
  };
}
