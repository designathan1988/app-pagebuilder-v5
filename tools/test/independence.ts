// npm run test:independence: the browser tests pass whatever ran before them. Each test opens a new browser context
// (a fresh profile: storage, cookies, permissions); what could still reach it from another test is what outlives a
// context — the browser process (its clipboard), the worker's modules, the machine's files and ports — or an order the
// tests need without saying so. The check plays the tests under conditions that change what comes before each:
//   reverse   every scope declared in reverse (E2E_ORDER=reverse, tools/runner/order.ts), 4 workers
//   shuffle   every scope in a seeded random order (E2E_ORDER=shuffle:<seed>), 3 workers
//   repeat    each test twice in one run (--repeat-each 2), 4 workers: the second time after other tests, in a warm
//             worker
//   one       one worker: every test right after the one before it
//   alone     each test of a sample in a run of its own: a new worker and a new browser for it alone
// The build is made and served once (E2E_SERVER=running: every run of the check uses it). A test failing under a
// condition is named with the condition; the check fails if any did.
//   npm run test:independence -- [--seed N] [--files S] [--one S] [--alone N] [--only reverse,shuffle,repeat,one,alone]
// --files takes a seeded share of the spec files and of the scenario runner's features for reverse, shuffle and repeat
// (a quarter by default; 1 for every test), --one the share played by one worker (a twentieth by default), --alone the
// number of tests run alone (20 by default). The seed is the day's unless given, so each day draws other files.
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { arrange } from '../runner/order.ts';

const args = process.argv.slice(2);
const option = (name: string): string | undefined => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? undefined : args[at + 1];
};
const seed = Number(option('seed') ?? Math.floor(Date.now() / 86_400_000));
const share = Number(option('files') ?? 0.25);
const oneShare = Number(option('one') ?? 0.05);
const aloneCount = Number(option('alone') ?? 20);
const only = option('only')?.split(',');
const isShare = (n: number) => n > 0 && n <= 1;
if (!Number.isInteger(seed) || !isShare(share) || !isShare(oneShare) || !Number.isInteger(aloneCount) || aloneCount < 0) {
  throw new Error('usage: --seed <whole number> --files <share, 0 to 1> --one <share, 0 to 1> --alone <count>');
}

const PORT = '5330';
const OUT = path.join('.cache', 'independence');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const cli = path.join('node_modules', '@playwright', 'test', 'cli.js');
const env = { ...process.env, E2E_PORT: PORT, E2E_SERVER: 'running' };

// ---- the tests, as Playwright lists them
interface Listed {
  readonly file: string;
  readonly titles: readonly string[];
  readonly feature: string | undefined;
}
interface ListedSuite {
  title: string;
  specs?: { title: string; tests: { annotations: { type: string; description?: string }[] }[] }[];
  suites?: ListedSuite[];
}
const listing = spawnSync(process.execPath, [cli, 'test', '--list', '--reporter=json'], { encoding: 'utf8', maxBuffer: 1 << 28, env });
if (listing.status !== 0) throw new Error(`playwright could not list the tests:\n${listing.stderr}`);
const listed: Listed[] = [];
const walk = (suite: ListedSuite, titles: string[], file: string) => {
  for (const spec of suite.specs ?? []) listed.push({ file, titles: [...titles, spec.title], feature: spec.tests[0]?.annotations.find((a) => a.type === 'feature')?.description });
  for (const child of suite.suites ?? []) walk(child, [...titles, child.title], file);
};
for (const suite of (JSON.parse(listing.stdout) as { suites: ListedSuite[] }).suites) walk(suite, [], suite.title);

// ---- a share: spec files, and the scenario runner's features, as Playwright's arguments
const specFiles = [...new Set(listed.filter((t) => t.feature === undefined).map((t) => t.file))].sort();
const features = [...new Set(listed.flatMap((t) => (t.feature === undefined ? [] : [t.feature])))].sort();
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function selection(part: number, salt: number): { readonly args: readonly string[]; readonly said: string } {
  if (part === 1) return { args: [], said: 'every test' };
  const take = <T>(items: readonly T[]) => arrange(items, { kind: 'shuffle', seed: seed + salt }).slice(0, Math.max(1, Math.round(items.length * part)));
  const files = take(specFiles);
  const chosen = take(features);
  // the chosen spec files and the scenario runner's file, its tests narrowed to the chosen features by their tags
  const args = [...files.map((file) => `tests/e2e/${file}`), 'tests/e2e/scenarios.spec.ts', '--grep', `@feature:(${chosen.map(escape).join('|')})(\\s|$)|^(?!.*@feature:)`];
  return { args, said: `${files.length} of ${specFiles.length} spec files, ${chosen.length} of ${features.length} features` };
}

// ---- the build, served once, as playwright.config.ts's web server makes it
const npm = (script: string, extra: NodeJS.ProcessEnv = {}) => spawnSync('npm', ['run', script], { stdio: 'inherit', shell: true, env: { ...env, ...extra } }).status === 0;
if (!npm('build', { E2E_BUILD: '1', TOOTH_COMMANDS: '', TOOTH_MODULE: '' }) || !npm('build:proofs')) process.exit(1);
const server = spawn('npm', ['run', 'preview'], { shell: true, env: { ...env, PORT }, stdio: 'ignore' });
const stop = () => {
  if (server.pid === undefined) return;
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore' });
  else server.kill();
};

interface Result {
  readonly condition: string;
  readonly failed: readonly string[];
  readonly seconds: number;
}
interface ReportSuite {
  title: string;
  specs?: { title: string; tests: { results: { status: string }[] }[] }[];
  suites?: ReportSuite[];
}
// one Playwright run under a condition: the tests that failed in it, by their title path
function play(condition: string, chosen: { readonly args: readonly string[]; readonly said: string }, extra: readonly string[], conditionEnv: NodeJS.ProcessEnv = {}): Result {
  const report = path.join(OUT, `${condition}.json`);
  const at = Date.now();
  console.log(`\nindependence: ${condition} (${chosen.said})`);
  spawnSync(process.execPath, [cli, 'test', ...chosen.args, ...extra, '--reporter=dot,json'], { stdio: ['ignore', 'inherit', 'inherit'], env: { ...env, ...conditionEnv, PLAYWRIGHT_JSON_OUTPUT_NAME: report } });
  const failed: string[] = [];
  const visit = (suite: ReportSuite, titles: string[]) => {
    for (const spec of suite.specs ?? []) {
      if (spec.tests.some((one) => one.results.some((r) => ['failed', 'timedOut', 'interrupted'].includes(r.status)))) failed.push([...titles, spec.title].join(' › '));
    }
    for (const child of suite.suites ?? []) visit(child, [...titles, child.title]);
  };
  if (fs.existsSync(report)) for (const suite of (JSON.parse(fs.readFileSync(report, 'utf8')) as { suites: ReportSuite[] }).suites) visit(suite, [suite.title]);
  else failed.push('(the run made no report)');
  return { condition, failed: [...new Set(failed)], seconds: Math.round((Date.now() - at) / 1000) };
}

// each test of a seeded sample in a run of its own, named as a list of tests names it (tools/impact/run.ts): a
// scenario test by the runner's file that declares it, beside the spec file that loads it
function alone(): Result {
  const sample = arrange(listed, { kind: 'shuffle', seed }).slice(0, aloneCount);
  const failed: string[] = [];
  const at = Date.now();
  console.log(`\nindependence: alone (${sample.length} tests, each in a run of its own)`);
  for (const one of sample) {
    const list = path.join(OUT, 'alone.txt');
    const line = one.feature === undefined ? [one.file, ...one.titles].join(' › ') : ['../../tools/runner/scenarios.ts', ...one.titles].join(' › ');
    fs.writeFileSync(list, `${one.feature === undefined ? '' : 'scenarios.spec.ts\n'}${line}\n`);
    const status = spawnSync(process.execPath, [cli, 'test', '--test-list', list, '--workers=1', '--reporter=dot'], { stdio: ['ignore', 'inherit', 'inherit'], env }).status;
    if (status !== 0) failed.push([one.file, ...one.titles].join(' › '));
  }
  return { condition: `alone (${sample.length} tests)`, failed, seconds: Math.round((Date.now() - at) / 1000) };
}

const results: Result[] = [];
try {
  for (let i = 0; ; i += 1) {
    try {
      if ((await fetch(`http://localhost:${PORT}/`)).ok) break;
    } catch {
      // not serving yet
    }
    if (i === 300) throw new Error('the preview server did not start');
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const conditions: Record<string, () => Result> = {
    reverse: () => play('reverse', selection(share, 1), ['--workers=4'], { E2E_ORDER: 'reverse' }),
    shuffle: () => play('shuffle', selection(share, 2), ['--workers=3'], { E2E_ORDER: `shuffle:${seed}` }),
    repeat: () => play('repeat', selection(share, 3), ['--workers=4', '--repeat-each=2']),
    one: () => play('one', selection(oneShare, 4), ['--workers=1']),
    alone,
  };
  for (const [name, run] of Object.entries(conditions)) {
    if (only !== undefined && !only.includes(name)) continue;
    const result = run();
    results.push(result);
    console.log(`independence: ${result.condition}: ${result.failed.length === 0 ? 'every test passed' : `${result.failed.length} failed`} (${result.seconds} s)`);
  }
} finally {
  stop();
}

console.log(`\nindependence (seed ${seed}):`);
for (const r of results) console.log(`  ${r.failed.length === 0 ? '✓' : '✗'} ${r.condition}: ${r.seconds} s`);
for (const r of results) for (const one of r.failed) console.log(`    ${r.condition}: ${one}`);
process.exit(results.every((r) => r.failed.length === 0) ? 0 : 1);
