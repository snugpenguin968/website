import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

type Layer = 'models' | 'view' | 'adapters' | 'pages' | 'other';

interface BoundaryViolation {
  readonly file: string;
  readonly line: number;
  readonly importTarget: string;
  readonly rule: string;
}

interface ResolvedTarget {
  readonly layer: Layer;
  readonly srcRelative: string | undefined;
  readonly isAstroContent: boolean;
}

const SRC_ROOT = join(process.cwd(), 'src');
const IMPORT_REGEX =
  /(?:^|[\n;])\s*(import|export)\s+(type\s+)?(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/gu;

const ALIAS_MAP: readonly (readonly [string, string])[] = [
  ['@models', 'models'],
  ['@adapters', 'adapters'],
  ['@views', 'views'],
  ['@components', 'components'],
  ['@layouts', 'layouts'],
  ['@pages', 'pages'],
  ['@styles', 'styles'],
  ['@assets', 'assets'],
];

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

function classifySrcPath(srcRelative: string): Layer {
  if (srcRelative === 'models' || srcRelative.startsWith('models/')) return 'models';
  if (
    srcRelative === 'views' ||
    srcRelative.startsWith('views/') ||
    srcRelative === 'components' ||
    srcRelative.startsWith('components/') ||
    srcRelative === 'layouts' ||
    srcRelative.startsWith('layouts/')
  ) {
    return 'view';
  }
  if (srcRelative === 'adapters' || srcRelative.startsWith('adapters/')) return 'adapters';
  if (srcRelative === 'pages' || srcRelative.startsWith('pages/')) return 'pages';
  return 'other';
}

function resolveImportTarget(filePath: string, specifier: string): ResolvedTarget {
  if (specifier === 'astro:content') {
    return { layer: 'other', srcRelative: undefined, isAstroContent: true };
  }

  for (const [alias, dir] of ALIAS_MAP) {
    if (specifier === alias || specifier.startsWith(`${alias}/`)) {
      const srcRelative = specifier.replace(alias, dir);
      return {
        layer: classifySrcPath(srcRelative),
        srcRelative,
        isAstroContent: false,
      };
    }
  }

  if (specifier.startsWith('.')) {
    const absoluteTarget = resolve(dirname(filePath), specifier);
    const rel = relative(SRC_ROOT, absoluteTarget).replace(/\\/gu, '/');
    if (!rel.startsWith('..')) {
      return {
        layer: classifySrcPath(rel),
        srcRelative: rel,
        isAstroContent: false,
      };
    }
  }

  return { layer: 'other', srcRelative: undefined, isAstroContent: false };
}

function checkFile(filePath: string): BoundaryViolation[] {
  const rel = relative(SRC_ROOT, filePath).replace(/\\/gu, '/');
  const sourceLayer = classifySrcPath(rel);
  const content = readFileSync(filePath, 'utf8');
  const violations: BoundaryViolation[] = [];

  for (const match of content.matchAll(IMPORT_REGEX)) {
    const isTypeOnly = match[2] !== undefined;
    const specifier = match[3];
    if (specifier === undefined) continue;

    const line = getLineNumber(content, match.index ?? 0);
    const target = resolveImportTarget(filePath, specifier);

    if (sourceLayer === 'models') {
      if (target.layer === 'view' || target.layer === 'adapters' || target.layer === 'pages') {
        violations.push({
          file: `src/${rel}`,
          line,
          importTarget: specifier,
          rule: 'Model layer must never import from views, adapters, or pages.',
        });
      }
    }

    if (sourceLayer === 'view') {
      if (target.layer === 'models' || target.isAstroContent) {
        violations.push({
          file: `src/${rel}`,
          line,
          importTarget: specifier,
          rule: 'View layer (views/components/layouts) must never import from models or astro:content.',
        });
      }
      if (target.layer === 'adapters') {
        violations.push({
          file: `src/${rel}`,
          line,
          importTarget: specifier,
          rule: 'View layer (views/components/layouts) must never import from adapters.',
        });
      }
      if (target.layer === 'pages') {
        violations.push({
          file: `src/${rel}`,
          line,
          importTarget: specifier,
          rule: 'View layer must never import from pages.',
        });
      }
    }

    if (sourceLayer === 'adapters') {
      if (target.layer === 'pages') {
        violations.push({
          file: `src/${rel}`,
          line,
          importTarget: specifier,
          rule: 'Adapter layer must never import from pages.',
        });
      }
      if (target.layer === 'view' && !isTypeOnly) {
        violations.push({
          file: `src/${rel}`,
          line,
          importTarget: specifier,
          rule: 'Adapter imports from the view layer should be type-only (`import type`) so views remain purely presentational.',
        });
      }
    }

    if (sourceLayer === 'pages') {
      if (target.layer === 'models' || target.isAstroContent) {
        violations.push({
          file: `src/${rel}`,
          line,
          importTarget: specifier,
          rule: 'Route pages must delegate data loading through @adapters/* rather than importing models or astro:content.',
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
