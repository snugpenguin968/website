import type { ReadingTimeEntity } from '@models/entities';

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

const FULL_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatShortDate(date: Date): string {
  return SHORT_DATE_FORMATTER.format(date);
}

export function formatFullDate(date: Date): string {
  return FULL_DATE_FORMATTER.format(date);
}

export function formatReadingTime(readingTime: ReadingTimeEntity): string {
  return `${readingTime.minutes} min`;
}

export function normalizePathname(pathname: string): string {
  if (pathname === '/' || pathname.length === 0) {
    return '/';
  }
  const trimmed = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

export function extractHostLabel(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./u, '');
  } catch {
    return url;
  }
}

export function formatCopyrightRange(startYear: number, currentYear: number): string {
  if (currentYear <= startYear) {
    return `${startYear}`;
  }
  return `${startYear}–${currentYear}`;
}
