// The selectors of a stylesheet's rules that stand on some of its lines (css-tree), written as the browser's coverage
// writes them: what a change to those lines reaches is every test that used one of them (tests/support/coverage.ts).
import { parse as parseCss, walk as walkCss, generate as generateCss } from 'css-tree';
import type { Lines } from './diff.ts';

export function selectorsOn(css: string, lines: Lines): ReadonlySet<string> {
  const found = new Set<string>();
  let ast;
  try {
    ast = parseCss(css, { positions: true });
  } catch {
    return found;
  }
  walkCss(ast, (node) => {
    if (node.type !== 'Rule' || node.loc === null || node.loc === undefined) return;
    const from = node.loc.start.line;
    const to = node.loc.end.line;
    if (!lines.some(([a, b]) => a <= to && b >= from)) return;
    for (const one of generateCss(node.prelude).split(',')) found.add(one.replace(/\s+/g, ' ').trim());
  });
  return found;
}
