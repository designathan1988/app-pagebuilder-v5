// npm run test:changed [-- --files <file>... | --list | --since-snapshot]: the checks a change needs, chosen by the
// impact selector (select.ts) and run in order — the static checks, the unit tests the change reaches (and the fast
// scenario runner, whose record the browser runner reads), then the browser tests it reaches. What changed is the
// difference between the run's inputs now and those of the last recorded run (map.ts: npm run test records it), read
// on the disk; --files names the changed files instead. Every choice prints its reason, and every escalation to a whole
// layer says why. --list prints the choice and runs nothing.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { kindOf } from '../../tests/support/groups.ts';
import { inputHashes } from '../runner/run-inputs.ts';
import { changedOldLines } from './diff.ts';
import { selectorsOn } from './css.ts';
import { graphReaches, selectDetectors } from './detectors.ts';
import { IMPACT_DIR, readMap, readSnapshot } from './map.ts';
import { selectImpact, type BrowserTest, type Change } from './select.ts';
import { changedDoors, changedKeys, changedScenarios, usersOf } from './sources.ts';

const args = process.argv.slice(2);
const listOnly = args.includes('--list');
const named = args.includes('--files') ? args.slice(args.indexOf('--files') + 1).filter((one) => !one.startsWith('--')) : null;
const posix = (file: string) => file.split(path.sep).join('/');

const snapshot = readSnapshot();
if (snapshot === null && named === null) {
  console.log('impact: no recorded run to compare with (npm test records one): every check runs');
  process.exit(run('npm', ['test']));
}

// ---- what changed
const now = inputHashes();
const before = new Map(Object.entries(snapshot?.hashes ?? {}));
const files =
  named?.map(posix) ??
  [...new Set([...now.keys(), ...before.keys()])].filter((file) => before.get(file) !== now.get(file)).sort();
const changes: Change[] = files.map((file) => {
  const exists = fs.existsSync(file);
  const older = snapshot?.texts[file];
  const newer = exists && /\.(ts|tsx|mjs|css|json|html)$/.test(file) ? fs.readFileSync(file, 'utf8') : undefined;
  const status = !exists ? 'removed' : older === undefined && !before.has(file) ? 'added' : 'changed';
  return { file, status, ...(older === undefined ? {} : { older }), ...(newer === undefined ? {} : { newer }), ...(older !== undefined && newer !== undefined ? { lines: changedOldLines(older, newer) } : {}) };
});
console.log(`impact: ${changes.length} changed file${changes.length === 1 ? '' : 's'}${snapshot === null ? '' : ` since the run recorded ${snapshot.at}`}`);
for (const change of changes) console.log(`  ${change.status.padEnd(7)} ${change.file}`);
if (changes.length === 0) {
  console.log('impact: nothing changed since the recorded run');
  process.exit(0);
}

// ---- the browser suite as Playwright lists it
const listed = spawnSync(process.execPath, [path.join('node_modules', '@playwright', 'test', 'cli.js'), 'test', '--list', '--reporter=json'], { encoding: 'utf8', maxBuffer: 1 << 28 });
interface Suite {
  title: string;
  file?: string;
  specs?: { title: string; tests: { annotations: { type: string; description?: string }[] }[] }[];
  suites?: Suite[];
}
const tests: BrowserTest[] = [];
const walk = (suite: Suite, titles: string[], file: string) => {
  for (const spec of suite.specs ?? []) {
    const id = [file, ...titles, spec.title].join(' › ');
    const annotations = spec.tests[0]?.annotations ?? [];
    const doors = annotations.filter((a) => a.type === 'door').map((a) => a.description ?? '');
    const feature = annotations.find((a) => a.type === 'feature')?.description;
    const scenario = feature === undefined ? undefined : `${titles[0] ?? ''} › ${titles[1] ?? ''}`;
    const fixture = annotations.find((a) => a.type === 'fixture')?.description;
    tests.push({ id, file: `tests/e2e/${file}`, doors, ...(scenario === undefined ? {} : { scenario }), ...(fixture === undefined ? {} : { fixtures: [fixture] }), render: kindOf(file) === 'render' });
  }
  for (const child of suite.suites ?? []) walk(child, [...titles, child.title], file);
};
for (const suite of (JSON.parse(listed.stdout) as { suites: Suite[] }).suites) walk(suite, [], suite.title);

const map = readMap(snapshot);
const impact = selectImpact({ changes, tests, map, selectorsOn, changedScenarios, changedDoors, changedKeys, usersOf, detectors: (changed) => selectDetectors(changed, graphReaches) });

// ---- the choice, said
console.log(`\nstatic: type check and dependency check whole; lint ${impact.lint.length} file(s)${impact.manifestCheck.length > 0 ? '; manifest check' : ''}${impact.genCheck.length > 0 ? '; generator check' : ''}`);
console.log(impact.unit.all.length > 0 ? `unit: every test (${impact.unit.all.join('; ')})` : `unit: the tests related to ${impact.unit.related.length} file(s), and the fast scenario runner`);
if (map === null) console.log('browser: no coverage map was recorded with the last run (npm test records it)');
if (impact.browserAll.length > 0) console.log(`browser: the whole suite, because:\n${impact.browserAll.map((why) => `  - ${why}`).join('\n')}`);
else {
  console.log(`browser: ${impact.browser.size} of ${tests.length} tests`);
  for (const [id, why] of impact.browser) console.log(`  ${id}\n      ${why.slice(0, 3).join('; ')}${why.length > 3 ? ` (and ${why.length - 3} more)` : ''}`);
}
console.log(`detectors: ${impact.detectors.models.size} model group(s), ${impact.detectors.mutants.size} mutant(s)`);
for (const [group, why] of impact.detectors.models) console.log(`  model ${group}: ${why.slice(0, 2).join('; ')}${why.length > 2 ? ` (and ${why.length - 2} more)` : ''}`);
if (impact.detectors.mutants.size > 0) console.log(`  mutants: ${[...impact.detectors.mutants.keys()].join(', ')}`);
for (const note of impact.notes) console.log(`note: ${note}`);
if (listOnly) process.exit(0);

// ---- the run
let status = 0;
const step = (label: string, code: number) => {
  console.log(`${code === 0 ? '✓' : '✗'} ${label}`);
  status = Math.max(status, code);
};
step('type check', run('npm', ['run', '-s', 'typecheck']));
step('dependency check', run('npm', ['run', '-s', 'deps:check']));
if (impact.lint.length > 0) step('lint', run('npx', ['eslint', '--cache', '--cache-location', '.cache/eslint/', '--max-warnings', '0', ...impact.lint]));
if (impact.manifestCheck.length > 0) step('manifest check', run('npm', ['run', '-s', 'manifest:check']));
if (impact.genCheck.length > 0) step('generator check', run('npm', ['run', '-s', 'gen:check']));
const vitest = path.join('node_modules', 'vitest', 'vitest.mjs');
if (impact.unit.all.length > 0) step('unit tests', run(process.execPath, [vitest, 'run']));
else {
  const related = impact.unit.related.filter((file) => fs.existsSync(file));
  if (related.length > 0) step('unit tests related', run(process.execPath, [vitest, 'related', '--run', '--passWithNoTests', ...related]));
  step('fast scenario runner', run(process.execPath, [vitest, 'run', 'tools/runner/headless.test.ts']));
}
if (impact.detectors.models.size > 0) step(`model of the store (${[...impact.detectors.models.keys()].join(', ')})`, run(process.execPath, [vitest, 'run', '--config', 'tools/runner/model/vitest.config.ts', ...[...impact.detectors.models.keys()].map((group) => `tools/runner/model/${group}.test.ts`)]));
if (impact.detectors.mutants.size > 0) step(`catalogue of mutants (${impact.detectors.mutants.size})`, run(process.execPath, ['tools/runner/mutants-run.ts', '--only', [...impact.detectors.mutants.keys()].join(',')]));
const cli = path.join('node_modules', '@playwright', 'test', 'cli.js');
if (impact.browserAll.length > 0) step('browser suite', run(process.execPath, [cli, 'test']));
else if (impact.browser.size > 0) {
  const list = path.join(IMPACT_DIR, 'selected.txt');
  fs.mkdirSync(IMPACT_DIR, { recursive: true });
  // Playwright's list matches a test by the file its test() is written in: a scenario run's is the scenario runner,
  // which scenarios.spec.ts loads (the file line lets that spec file be loaded at all)
  const SCENARIOS = 'scenarios.spec.ts › ';
  const lines = [...impact.browser.keys()].map((id) => (id.startsWith(SCENARIOS) ? `../../tools/runner/scenarios.ts › ${id.slice(SCENARIOS.length)}` : id));
  fs.writeFileSync(list, `${[...(lines.some((line) => line.startsWith('../../tools/')) ? ['scenarios.spec.ts'] : []), ...lines].join('\n')}\n`);
  step(`browser tests selected (${impact.browser.size})`, run(process.execPath, [cli, 'test', '--test-list', list]));
} else console.log('browser: no test reaches the change');
process.exit(status);

function run(command: string, rest: readonly string[]): number {
  const result = spawnSync(command, rest, { stdio: 'inherit', shell: command === 'npm' || command === 'npx' });
  return result.status ?? 1;
}
