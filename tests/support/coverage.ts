// What each browser test executed of the editor: with E2E_COVERAGE=1 a test records Chrome's coverage of the page — the
// source lines its scripts ran, read back through the e2e build's source maps, the selectors of the stylesheet rules the
// page used, and the message keys the editor translated — into .cache/e2e-coverage/tests/<hash>.json, named as
// Playwright's list names the test ("<spec file> › <titles>"). The impact selector reads them (tools/impact/) to run
// only the tests whose executed lines, selectors or messages a change touches. Over-approximate on purpose: a function
// that ran counts as a whole, so a test is never missed for a line it ran.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { CDPSession, Page, TestInfo } from '@playwright/test';
import { SourceMapConsumer, type RawSourceMap } from 'source-map-js';

export const COVERAGE = process.env.E2E_COVERAGE === '1';
// the browser tests' own folder, never the unit tests' report (vitest.config.ts), which Vitest empties at every run
export const COVERAGE_ROOT = path.join('.cache', 'e2e-coverage');
export const COVERAGE_DIR = path.join(COVERAGE_ROOT, 'tests');
const BUILD = 'dist';

interface TestCoverage {
  // the test as Playwright's list names it: its spec file and its titles
  readonly test: string;
  // each source file of src/ by its path, the lines executed as [from, to] intervals, merged and sorted
  readonly lines: Readonly<Record<string, readonly (readonly [number, number])[]>>;
  // the selectors of the rules the page's stylesheets used, as written
  readonly selectors: readonly string[];
  // the message keys the editor translated
  readonly keys: readonly string[];
}

// A script or stylesheet of the build, read once per worker from the build itself (never transferred from the page at
// every test): its text, and for a script the source line of each generated line, found through its map the first
// time a test runs that line.
interface Built {
  readonly text: string;
  readonly lineOf: (offset: number) => number;
  readonly sourceOf: (line: number) => readonly [string, number] | null;
}
const built = new Map<string, Built | null>();
function builtOf(url: string): Built | null {
  const file = path.join(BUILD, new URL(url).pathname);
  if (built.has(file)) return built.get(file) ?? null;
  let found: Built | null;
  try {
    const text = fs.readFileSync(file, 'utf8');
    const starts = [0];
    for (let i = 0; i < text.length; i += 1) if (text.charCodeAt(i) === 10) starts.push(i + 1);
    const lineOf = (offset: number): number => {
      let low = 0;
      let high = starts.length - 1;
      while (low < high) {
        const mid = (low + high + 1) >> 1;
        if ((starts[mid] as number) <= offset) low = mid;
        else high = mid - 1;
      }
      return low + 1;
    };
    const consumer = file.endsWith('.js') ? new SourceMapConsumer(JSON.parse(fs.readFileSync(`${file}.map`, 'utf8')) as RawSourceMap) : null;
    const sources = new Map<number, readonly [string, number] | null>();
    const sourceOf = (line: number): readonly [string, number] | null => {
      if (consumer === null) return null;
      let mapped = sources.get(line);
      if (mapped === undefined) {
        const at = consumer.originalPositionFor({ line, column: 0, bias: SourceMapConsumer.LEAST_UPPER_BOUND });
        const source = at.source === null ? null : sourcePath(at.source);
        mapped = source === null || at.line === null ? null : [source, at.line];
        sources.set(line, mapped);
      }
      return mapped;
    };
    found = { text, lineOf, sourceOf };
  } catch {
    found = null;
  }
  built.set(file, found);
  return found;
}

const sourcePath = (source: string): string | null => {
  const at = source.replaceAll('\\', '/').lastIndexOf('/src/');
  return at < 0 ? null : source.replaceAll('\\', '/').slice(at + 1);
};

function merged(intervals: (readonly [number, number])[]): (readonly [number, number])[] {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const out: [number, number][] = [];
  for (const [from, to] of sorted) {
    const last = out.at(-1);
    if (last !== undefined && from <= last[1] + 1) last[1] = Math.max(last[1], to);
    else out.push([from, to]);
  }
  return out;
}

// The stretches of a script that ran: V8's ranges nest (a function, its blocks, the functions inside it), and the
// innermost range holding an offset says whether it ran, so an inner function that never ran is left out
// of the function around it.
interface Range {
  readonly startOffset: number;
  readonly endOffset: number;
  readonly count: number;
}
function executed(ranges: readonly Range[]): readonly Range[] {
  const sorted = [...ranges].sort((a, b) => a.startOffset - b.startOffset || b.endOffset - a.endOffset);
  const out: Range[] = [];
  const stack: Range[] = [];
  let cursor = 0;
  const emit = (to: number) => {
    const top = stack.at(-1);
    if (top !== undefined && top.count > 0 && to > cursor) out.push({ startOffset: cursor, endOffset: to, count: top.count });
    cursor = Math.max(cursor, to);
  };
  for (const range of sorted) {
    while (stack.length > 0 && (stack.at(-1) as Range).endOffset <= range.startOffset) {
      emit((stack.at(-1) as Range).endOffset);
      stack.pop();
    }
    emit(range.startOffset);
    stack.push(range);
  }
  while (stack.length > 0) {
    emit((stack.at(-1) as Range).endOffset);
    stack.pop();
  }
  return out;
}

// Chrome's own coverage of the page, through a DevTools session of the test's page (Playwright's coverage API would
// hand the whole build's text back at every test and keep the debugger on): the script ranges that ran, and the
// stylesheet rules the page used.
interface Recording {
  readonly cdp: CDPSession;
  // each stylesheet's address, by its id
  readonly sheets: Map<string, string>;
}
const recordings = new WeakMap<Page, Recording>();

export async function startCoverage(page: Page): Promise<void> {
  const cdp = await page.context().newCDPSession(page);
  const sheets = new Map<string, string>();
  cdp.on('CSS.styleSheetAdded', ({ header }) => sheets.set(header.styleSheetId, header.sourceURL));
  await cdp.send('Profiler.enable');
  // by function, not by block: a function that ran counts whole (a wider map, never a narrower one), and the page runs
  // at its own speed (block counting slowed every test by a fifth)
  await cdp.send('Profiler.startPreciseCoverage', { callCount: false, detailed: false });
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  await cdp.send('CSS.startRuleUsageTracking');
  recordings.set(page, { cdp, sheets });
}

export async function stopCoverage(page: Page, info: TestInfo): Promise<void> {
  const recording = recordings.get(page);
  if (recording === undefined) return;
  const { cdp, sheets } = recording;
  const [{ result: scripts }, { ruleUsage }] = await Promise.all([cdp.send('Profiler.takePreciseCoverage'), cdp.send('CSS.stopRuleUsageTracking')]);
  const lines = new Map<string, (readonly [number, number])[]>();
  for (const script of scripts) {
    if (!/^https?:/.test(script.url) || !/\/assets\/.*\.js$/.test(new URL(script.url).pathname)) continue;
    const bundle = builtOf(script.url);
    if (bundle === null) continue;
    for (const range of executed(script.functions.flatMap((fn) => fn.ranges))) {
      // every generated line of the stretch read back to its source line (a stretch may cross the bundle's modules)
      const last = bundle.lineOf(Math.max(range.startOffset, range.endOffset - 1));
      for (let line = bundle.lineOf(range.startOffset); line <= last; line += 1) {
        const found = bundle.sourceOf(line);
        if (found === null) continue;
        const held = lines.get(found[0]) ?? [];
        held.push([found[1], found[1]]);
        lines.set(found[0], held);
      }
    }
  }
  const selectors = new Set<string>();
  for (const rule of ruleUsage) {
    const url = sheets.get(rule.styleSheetId);
    if (!rule.used || url === undefined || !/^https?:/.test(url) || !/\/assets\/.*\.css$/.test(new URL(url).pathname)) continue;
    const css = builtOf(url)?.text ?? '';
    // a used range starts at its rule's selector, or at its body: the selector is then the text before the brace
    const text = css.slice(rule.startOffset, rule.endOffset);
    const brace = text.indexOf('{');
    const close = text.indexOf('}');
    let header = brace > 0 && (close < 0 || brace < close) ? text.slice(0, brace) : '';
    if (header === '') {
      let i = rule.startOffset - 1;
      while (i >= 0 && /\s/.test(css[i] as string)) i -= 1;
      if (css[i] === '{') header = css.slice(Math.max(css.lastIndexOf('}', i), css.lastIndexOf('{', i - 1), css.lastIndexOf(';', i)) + 1, i);
    }
    for (const one of header.split(',')) selectors.add(one.replace(/\s+/g, ' ').trim());
  }
  await cdp.detach().catch(() => undefined);
  const keys = await page.evaluate(() => (window as unknown as { __builderTestPort?: { keys: () => string[] } }).__builderTestPort?.keys() ?? []).catch(() => [] as string[]);
  const test = info.titlePath.join(' › ');
  const record: TestCoverage = { test, lines: Object.fromEntries([...lines].map(([file, held]) => [file, merged(held)])), selectors: [...selectors].filter((one) => one !== '').sort(), keys };
  fs.mkdirSync(COVERAGE_DIR, { recursive: true });
  fs.writeFileSync(path.join(COVERAGE_DIR, `${crypto.createHash('sha1').update(test).digest('hex')}.json`), JSON.stringify(record));
}
