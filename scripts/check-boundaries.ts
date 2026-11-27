import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

interface BoundaryViolation {
  readonly file: string;
  readonly line: number;
  readonly importTarget: string;
  readonly rule: string;
}

const SRC_ROOT = join(process.cwd(), 'src');
const IMPORT_REGEX = /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/gu;

function walkFiles(dir: string): string[] {
  const results: string[] = [];
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return results;
  }

  for (const name of entries) {
    const fullPath = join(dir, name);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      results.push(...walkFiles(fullPath));
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.astro')) {
      results.push(fullPath);
    }
  }
  return results;
}

function getLineNumber(content: string, index: number): number {
  return content.slice(0, index).split('\n').length;
}

function checkFile(filePath: string): BoundaryViolation[] {
  const rel = relative(SRC_ROOT, filePath).replace(/\\/gu, '/');
  const content = readFileSync(filePath, 'utf8');
  const violations: BoundaryViolation[] = [];

  for (const match of content.matchAll(IMPORT_REGEX)) {
    const target = match[1];
    if (target === undefined) continue;
    const line = getLineNumber(content, match.index ?? 0);

    const isViewLayer =
      rel.startsWith('views/') ||
      rel.startsWith('components/') ||
      rel.startsWith('layouts/');
    const isPageLayer = rel.startsWith('pages/');
    const isModelLayer = rel.startsWith('models/');

    if (isViewLayer) {
      if (
        target.startsWith('@models') ||
        target.includes('/models/') ||
        target.endsWith('/models') ||
        target === 'astro:content'
      ) {
        violations.push({
          file: `src/${rel}`,
          line,
          importTarget: target,
          rule: 'View layer (views/components/layouts) must not import models or astro:content directly; route through an adapter view model.',
        });
      }
    }

    if (isPageLayer) {
      if (
        target.startsWith('@models') ||
        target.includes('/models/') ||
        target === 'astro:content'
      ) {
        violations.push({
          file: `src/${rel}`,
          line,
          importTarget: target,
          rule: 'Route pages must delegate data loading through @adapters/* rather than importing models or astro:content.',
        });
      }
    }

    if (isModelLayer) {
      if (
        target.startsWith('@adapters') ||
        target.startsWith('@views') ||
        target.startsWith('@components') ||
        target.startsWith('@layouts') ||
        target.includes('/adapters/') ||
        target.includes('/views/')
      ) {
        violations.push({
          file: `src/${rel}`,
          line,
          importTarget: target,
          rule: 'Model layer must remain independent of adapters and views.',
        });
      }
    }
  }

  return violations;
}

const files = walkFiles(SRC_ROOT);
const allViolations = files.flatMap(checkFile);

if (allViolations.length > 0) {
  console.error(`\nArchitecture Boundary Check FAILED (${allViolations.length} violation(s)):\n`);
  for (const v of allViolations) {
    console.error(`  ${v.file}:${v.line} -> "${v.importTarget}"\n    ${v.rule}\n`);
  }
  process.exit(1);
}

console.log(`Architecture Boundary Check PASSED (${files.length} source files verified).`);
