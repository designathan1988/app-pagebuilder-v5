// The impact selector's rules: from the files a change touched, what each layer of the tests must run, and why. Pure:
// the caller (tools/impact/run.ts) reads the disk, the coverage map and the suite's list; this decides.
//
// - Static checks: the type check and the dependency check run whole (a change's types reach every module that imports
//   it; both are incremental and take seconds); the lint runs on the files changed; the manifest check when the
//   manifest or its checker changed; the generator check when what it generates from changed.
// - Unit tests: the tests whose module graph reaches a changed file (Vitest's `related`), and every unit test when what
//   all of them stand on changed (their configuration and setup, the packages).
// - Browser tests: by what each test executed (the coverage map, tools/impact/map.ts): a test runs when it ran a line a
//   change touched, used a stylesheet rule a change touched, showed a message whose words changed, presses a door whose
//   definition changed, or plays a scenario that changed; a spec file that changed runs whole. What every browser test
//   stands on (the test support, the harness, the build) runs the whole suite, and so does a change the map cannot
//   place — always with its reason, never silently.
// - Detectors without a browser: the groups of the model of the store and the mutants of the catalogue the change
//   reaches (tools/impact/detectors.ts), when the caller hands the choice.
import type { DetectorChoice } from './detectors.ts';
import { meets, type Lines } from './diff.ts';

export interface Change {
  readonly file: string;
  readonly status: 'changed' | 'added' | 'removed';
  // the older and the newer text, for the files whose lines matter (sources, stylesheets, catalogues, manifest)
  readonly older?: string;
  readonly newer?: string;
  // the older lines a change touched (sources and stylesheets: tools/impact/diff.ts)
  readonly lines?: Lines;
}

export interface BrowserTest {
  // the test as Playwright's list names it: "<spec file> › <titles>"
  readonly id: string;
  readonly file: string;
  readonly doors: readonly string[];
  // the scenario a scenario run plays: "<feature> › <scenario>", and the fixtures it opens
  readonly scenario?: string;
  readonly fixtures?: readonly string[];
  readonly render: boolean;
}

export interface Executed {
  readonly lines: Readonly<Record<string, Lines>>;
  readonly selectors: readonly string[];
  readonly keys: readonly string[];
}

export interface ImpactInput {
  readonly changes: readonly Change[];
  readonly tests: readonly BrowserTest[];
  // what each test executed, by test id; null when there is no map
  readonly map: ReadonlyMap<string, Executed> | null;
  // the stylesheet selectors on a set of a stylesheet's lines (css-tree), and the scenarios and doors that differ
  // between two texts of a manifest file (the caller parses)
  readonly selectorsOn: (css: string, lines: Lines) => ReadonlySet<string>;
  readonly changedScenarios: (older: string, newer: string) => ReadonlySet<string>;
  readonly changedDoors: (older: string, newer: string) => ReadonlySet<string>;
  readonly changedKeys: (older: string, newer: string) => ReadonlySet<string>;
  // the spec files that use a file: import it (statically, transitively), or name it (a fixture, a data file)
  readonly usersOf: (file: string) => readonly string[];
  // the detectors without a browser a set of changed files reaches (tools/impact/detectors.ts); none when absent
  readonly detectors?: (files: readonly string[]) => DetectorChoice;
}

export interface Impact {
  readonly unit: { readonly all: readonly string[]; readonly related: readonly string[] };
  readonly lint: readonly string[];
  readonly manifestCheck: readonly string[];
  readonly genCheck: readonly string[];
  // why every browser test runs; empty when the selection below decides
  readonly browserAll: readonly string[];
  // the browser tests selected, each with why
  readonly browser: ReadonlyMap<string, readonly string[]>;
  // the groups of the model of the store and the mutants of the catalogue the change reaches, each with why
  readonly detectors: DetectorChoice;
  readonly notes: readonly string[];
}

const posix = (file: string) => file.replaceAll('\\', '/');
// what every browser test stands on: the test support, the scenario runner and its harness, the door helpers, the
// configuration and the build
const BROWSER_HARNESS = [/^tests\/support\//, /^tests\/e2e\/door\.ts$/, /^tools\/runner\/(scenarios|balance|run-inputs|companion|layout-composer|unzip|environment|status)\.ts$/, /^playwright\.config\.ts$/, /^vite(\.proofs)?\.config\.ts$/, /^index\.html$/, /^package(-lock)?\.json$/, /^tsconfig(\.app)?\.json$/, /^src\/main\.tsx$/, /^src\/ui\/tokens\.css$/, /^manifest\/environment\.json$/];
// the manifest tables every surface of the editor reads: a change to one reaches the whole editor
const WHOLE_EDITOR_TABLES = [/^manifest\/(properties|elements|interactions|layout|references|consumers|checks|css-exclusions)\.json$/, /^manifest\/generated\//];
// what every unit test stands on
const UNIT_HARNESS = [/^vitest\.config\.ts$/, /^tools\/test\//, /^package(-lock)?\.json$/, /^tsconfig/];
const SOURCE = /^(src|tools|tests)\/.*\.(ts|tsx|mjs)$/;
const GEN_INPUTS = [/^tools\/gen\//, /^manifest\/(?!generated\/|features\/fixtures\/)[^/]+\.json$/, /^manifest\/commands\//, /^package(-lock)?\.json$/];

export function selectImpact(input: ImpactInput): Impact {
  const unitAll: string[] = [];
  const related = new Set<string>();
  const lint = new Set<string>();
  const manifestCheck: string[] = [];
  const genCheck: string[] = [];
  const browserAll: string[] = [];
  const browser = new Map<string, string[]>();
  const notes: string[] = [];
  const pick = (id: string, why: string) => {
    const held = browser.get(id) ?? [];
    if (!held.includes(why)) held.push(why);
    browser.set(id, held);
  };
  const testsOfFile = (file: string) => input.tests.filter((test) => test.file === file);
  const renderTests = input.tests.filter((test) => test.render);

  for (const raw of input.changes) {
    const change = { ...raw, file: posix(raw.file) };
    const { file } = change;
    if (/\.(ts|tsx|mjs|cjs|js|css)$/.test(file) && change.status !== 'removed') lint.add(file);
    if (UNIT_HARNESS.some((p) => p.test(file))) unitAll.push(`${file}: what every unit test stands on`);
    else if (SOURCE.test(file) || /^(src|manifest)\/.*\.json$/.test(file) || /\.css$/.test(file)) related.add(file);
    if (file.startsWith('manifest/') || file.startsWith('src/manifest/')) manifestCheck.push(file);
    if (GEN_INPUTS.some((p) => p.test(file))) genCheck.push(file);

    // ---- browser tests
    if (BROWSER_HARNESS.some((p) => p.test(file))) {
      browserAll.push(`${file}: what every browser test stands on`);
      continue;
    }
    if (WHOLE_EDITOR_TABLES.some((p) => p.test(file))) {
      browserAll.push(`${file}: a table of the manifest the whole editor reads`);
      continue;
    }
    if (/^tests\/e2e\/.*\.spec\.ts$/.test(file)) {
      for (const test of testsOfFile(file)) pick(test.id, `${file} changed`);
      continue;
    }
    if (/^manifest\/features\/fixtures\//.test(file)) {
      const name = file.slice('manifest/features/fixtures/'.length).replace(/\.json$/, '');
      for (const spec of input.usersOf(file)) for (const test of testsOfFile(spec)) pick(test.id, `it opens ${name}, which changed`);
      for (const test of input.tests) if (test.fixtures?.includes(name) === true) pick(test.id, `its scenario opens ${name}, which changed`);
      continue;
    }
    if (/^manifest\/features\/\d\d-.*\.json$/.test(file)) {
      const scenarios = input.changedScenarios(change.older ?? '{"features":[]}', change.newer ?? '{"features":[]}');
      for (const test of input.tests) if (test.scenario !== undefined && scenarios.has(test.scenario)) pick(test.id, `its scenario changed in ${file}`);
      if (scenarios.size === 0) notes.push(`${file}: no scenario changed`);
      continue;
    }
    if (/^manifest\/commands\//.test(file)) {
      const doors = input.changedDoors(change.older ?? '{"commands":[]}', change.newer ?? '{"commands":[]}');
      for (const test of input.tests) for (const door of test.doors) if (doors.has(door)) pick(test.id, `it presses ${door}, whose definition changed`);
      if (doors.size === 0) notes.push(`${file}: no door changed`);
      continue;
    }
    if (/^src\/i18n\/locales\/[^/]+\.json$/.test(file)) {
      if (input.map === null) {
        browserAll.push(`${file}: no coverage map says which tests show its messages`);
        continue;
      }
      const keys = input.changedKeys(change.older ?? '{}', change.newer ?? '{}');
      for (const [id, ran] of input.map) if (ran.keys.some((key) => keys.has(key))) pick(id, `it shows a message whose words changed (${[...keys].filter((key) => ran.keys.includes(key)).slice(0, 3).join(', ')})`);
      // the words' length reaches every screen in that language: the sweeps check them
      for (const test of renderTests) pick(test.id, `${file} changed the words its screens show`);
      continue;
    }
    if (file.startsWith('src/') && file.endsWith('.css')) {
      if (input.map === null || change.older === undefined || change.newer === undefined) {
        browserAll.push(`${file}: ${input.map === null ? 'no coverage map says which tests use its rules' : 'a stylesheet the map never saw'}`);
        continue;
      }
      const touched = input.selectorsOn(change.older, change.lines ?? []);
      const added = [...input.selectorsOn(change.newer, [[1, Number.MAX_SAFE_INTEGER]])].filter((one) => !input.selectorsOn(change.older ?? '', [[1, Number.MAX_SAFE_INTEGER]]).has(one));
      if (added.length > 0) {
        browserAll.push(`${file}: rules the coverage map never saw (${added.slice(0, 3).join(', ')})`);
        continue;
      }
      const normal = (one: string) => one.replace(/\s*([>+~])\s*/g, '$1').replace(/\s+/g, ' ').trim();
      const wanted = new Set([...touched].map(normal));
      for (const [id, ran] of input.map) if (ran.selectors.some((one) => wanted.has(normal(one)))) pick(id, `it used a rule ${file} changed`);
      for (const test of renderTests) pick(test.id, `${file} changed how the editor is drawn`);
      continue;
    }
    if (file.startsWith('src/') && /\.(ts|tsx)$/.test(file) && !/\.test\.tsx?$/.test(file)) {
      if (input.map === null) {
        browserAll.push(`${file}: no coverage map says which browser tests run it`);
        continue;
      }
      if (change.status === 'added') {
        notes.push(`${file} is new: a browser test runs it only through a module that imports it, whose change places the tests`);
        continue;
      }
      if (change.status === 'removed') {
        notes.push(`${file} was removed: the modules that imported it changed too, and place the tests`);
        continue;
      }
      let reached = 0;
      for (const [id, ran] of input.map) {
        if (meets(ran.lines[file], change.lines ?? [])) {
          pick(id, `it ran ${file}:${(change.lines ?? []).map(([a, b]) => (a === b ? a : `${a}-${b}`)).join(',')}`);
          reached += 1;
        }
      }
      if (reached === 0) notes.push(`${file}: no browser test runs the lines changed`);
      continue;
    }
    // a tool or a test helper outside the harness: the spec files that import it
    if (/^(tools|tests)\//.test(file)) {
      const users = input.usersOf(file);
      for (const spec of users) for (const test of testsOfFile(spec)) pick(test.id, `it uses ${file}`);
      if (users.length === 0) notes.push(`${file}: no browser test imports it`);
      continue;
    }
    notes.push(`${file}: nothing a test runs`);
  }
  // a test the map does not know (added since it was recorded) runs whenever its own file is not otherwise selected
  if (input.map !== null) {
    const unknown = input.tests.filter((test) => !input.map?.has(test.id) && !test.scenario);
    if (unknown.length > 0 && browserAll.length === 0 && input.changes.length > 0) {
      for (const test of unknown) pick(test.id, 'the coverage map does not know it yet');
    }
  }
  return {
    unit: { all: unitAll, related: [...related] },
    lint: [...lint],
    manifestCheck,
    genCheck,
    browserAll,
    browser: browserAll.length > 0 ? new Map() : browser,
    detectors: input.detectors?.(input.changes.map((change) => posix(change.file))) ?? { models: new Map(), mutants: new Map() },
    notes,
  };
}
