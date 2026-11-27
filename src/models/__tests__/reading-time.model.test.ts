import { describe, expect, it } from 'vitest';
import { estimateReadingTime } from '../reading-time.model';

describe('reading-time.model', () => {
  it('returns minimum 1 minute for empty content', () => {
    const result = estimateReadingTime('');
    expect(result).toEqual({ words: 0, minutes: 1 });
  });

  it('strips frontmatter, fenced code blocks, and markdown formatting', () => {
    const md = `---
title: Hello
---

# Heading

Here is a [link](https://example.com) with \`inlineCode\` and **bold** text.

\`\`\`ts
const ignored = 'this code block should not inflate word count';
\`\`\`
`;
    const result = estimateReadingTime(md);
    expect(result.words).toBe(9);
    expect(result.minutes).toBe(1);
  });

  it('scales reading minutes linearly by word count', () => {
    const prose = Array.from({ length: 441 }, () => 'word').join(' ');
    const result = estimateReadingTime(prose, 220);
    expect(result.words).toBe(441);
    expect(result.minutes).toBe(3);
  });

  it('honors explicit overrideMinutes when provided', () => {
    const result = estimateReadingTime('short post', 220, 7);
    expect(result.minutes).toBe(7);
  });
});
