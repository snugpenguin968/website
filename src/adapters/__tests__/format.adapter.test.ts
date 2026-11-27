import { describe, expect, it } from 'vitest';
import {
  extractHostLabel,
  formatCopyrightRange,
  formatFullDate,
  formatReadingTime,
  formatShortDate,
  normalizePathname,
} from '../format.adapter';

describe('format.adapter', () => {
  it('formats dates consistently in UTC', () => {
    const date = new Date('2026-11-27T00:00:00Z');
    expect(formatShortDate(date)).toBe('Nov 27');
    expect(formatFullDate(date)).toBe('Nov 27, 2026');
  });

  it('formats reading time concisely', () => {
    expect(formatReadingTime({ words: 440, minutes: 2 })).toBe('2 min');
  });

  it('normalizes trailing slashes and leading slashes', () => {
    expect(normalizePathname('/')).toBe('/');
    expect(normalizePathname('/blog/')).toBe('/blog');
    expect(normalizePathname('projects/')).toBe('/projects');
  });

  it('extracts clean host labels without www prefix', () => {
    expect(extractHostLabel('https://www.linkedin.com/in/jt42/')).toBe('linkedin.com');
    expect(extractHostLabel('https://github.com/snugpenguin968')).toBe('github.com');
  });

  it('formats single-year and multi-year copyright ranges', () => {
    expect(formatCopyrightRange(2026, 2026)).toBe('2026');
    expect(formatCopyrightRange(2026, 2028)).toBe('2026–2028');
  });
});
