// npm test: every check of the project, in the shortest time the machine allows without loading it beyond what the
// browser suite's four workers take. The browser suite needs two things only: the build of the app it opens, served
// once it is made, and the fast scenario runner's record (tools/runner/balance.ts), which takes seconds. Those come
// first, side by side; then the browser suite runs, recording what each of its tests executes (tests/support/
// coverage.ts) for the impact selector, while the static checks (the generated files, the manifest, the types, the
// dependency graph, the lint) and the unit tests (two workers: the browser suite holds four) run beside it. Once every
// stage passed on inputs that did not change while it ran, the run's inputs are recorded (tools/impact/map.ts): npm run
// test:changed compares a later tree with them. --no-map runs the browser suite without recording its coverage. Each
// stage's time is said, and each stage's output is printed whole when it ends.
import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { inputsFingerprint } from '../runner/run-inputs.ts';
import { takeSnapshot, writeSnapshot } from '../impact/map.ts';
import { COVERAGE_DIR } from '../../tests/support/coverage.ts';

const map = !process.argv.includes('--no-map');
const node = process.execPath;
const bin = (pkg: string, file: string) => path.join('node_modules', pkg, file);
const vitest = bin('vitest', 'vitest.mjs');
// the server the browser suite opens: this run's own build, on a port of its own (playwright.config.ts E2E_SERVER)
const PORT = process.env.E2E_PORT ?? '5320';

interface Stage {
  readonly label: string;
  // a program and its arguments, or an npm script
  readonly command: readonly string[] | { readonly npm: string };
  readonly env?: Readonly<Record<string, string>>;
}
const STATIC: readonly Stage[] = [
  { label: 'generated files', command: [node, 'tools/gen/check.ts'] },
  { label: 'manifest', command: [node, 'tools/manifest/check.ts'] },
  { label: 'type check', command: { npm: 'typecheck' } },
  { label: 'dependency graph', command: { npm: 'deps:check' } },
  { label: 'lint', command: { npm: 'lint' } },
];
const RECORD: Stage = { label: "the fast scenario runner's record", command: [node, vitest, 'run', 'tools/runner/headless.test.ts', '--coverage.enabled=false'] };
const UNIT: Stage = { label: 'unit tests and the fast scenario runner, with their coverage', command: [node, vitest, 'run', '--coverage', '--maxWorkers=2'] };
const BUILD: readonly Stage[] = [
  { label: 'build of the app', command: { npm: 'build' }, env: { E2E_BUILD: '1', TOOTH_COMMANDS: '', TOOTH_MODULE: '' } },
  { label: 'build of the browser proofs', command: { npm: 'build:proofs' } },
];
const BROWSER: Stage = {
  label: `browser suite${map ? ', recording what each test runs' : ''}`,
  command: [node, bin('@playwright/test', 'cli.js'), 'test'],
  env: { E2E_PORT: PORT, E2E_SERVER: 'running', ...(map ? { E2E_COVERAGE: '1' } : {}) },
};

const times: string[] = [];
// a stage's output, kept whole and printed when it ends (`quiet`), so stages running side by side never interleave
function run(stage: Stage, quiet: boolean): Promise<boolean> {
  const at = Date.now();
  // an npm script runs through the shell as one command line (no arguments of the run's own reach it)
  const [command, args, shell] = 'npm' in stage.command ? [`npm run -s ${stage.command.npm}`, [], true] : [stage.command[0] ?? '', stage.command.slice(1), false];
  return new Promise((resolve) => {
    const child = spawn(command, args, { shell, env: { ...process.env, ...stage.env }, stdio: quiet ? ['ignore', 'pipe', 'pipe'] : 'inherit' });
    let said = '';
    child.stdout?.on('data', (chunk: Buffer) => (said += chunk.toString()));
    child.stderr?.on('data', (chunk: Buffer) => (said += chunk.toString()));
    child.on('close', (status) => {
      const seconds = Math.round((Date.now() - at) / 1000);
      times.push(`  ${status === 0 ? '✓' : '✗'} ${stage.label}: ${Math.floor(seconds / 60)} min ${seconds % 60} s`);
      if (quiet) console.log(`\n▶ ${stage.label}\n${said.trimEnd()}`);
      resolve(status === 0);
    });
  });
}
async function lane(stages: readonly Stage[]): Promise<boolean> {
  for (const stage of stages) if (!(await run(stage, true))) return false;
  return true;
}

const started = inputsFingerprint();
const snapshot = takeSnapshot();
let server: ChildProcess | null = null;
// the server and what it started, stopped before this run ends (waited for: a server left behind would answer the next
// run's port)
const stop = () => {
  if (server?.pid === undefined) return;
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore' });
  else server.kill();
};
const answers = async (): Promise<boolean> => {
  try {
    return (await fetch(`http://localhost:${PORT}/`)).ok;
  } catch {
    return false;
  }
};
const serving = async (): Promise<boolean> => {
  if (!(await lane(BUILD))) return false;
  // a server already on the port is another run's, serving another build: never the one the suite opens
  if (await answers()) {
    console.log(`\nport ${PORT} already answers: stop the server there, or give this run another port (E2E_PORT)`);
    return false;
  }
  server = spawn(`npm run preview`, [], { shell: true, env: { ...process.env, PORT }, stdio: 'ignore' });
  for (let i = 0; i < 300; i += 1) {
    if (await answers()) return true;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return false;
};

let failed: boolean;
try {
  console.log("▶ the build and the fast scenario runner's record, side by side");
  const [built, recorded] = await Promise.all([serving(), run(RECORD, true)]);
  failed = !built || !recorded;
  // the browser suite plans from the record and opens the build: it runs only on both
  const browser = async (): Promise<boolean> => {
    if (!built || !recorded) return true;
    console.log(`\n▶ ${BROWSER.label}, the static checks and the unit tests beside it`);
    // the map is the whole suite's or none: the records of an earlier run never mix with this one's
    if (map) fs.rmSync(COVERAGE_DIR, { recursive: true, force: true });
    return run(BROWSER, false);
  };
  const [browsed, statics, unit] = await Promise.all([browser(), lane(STATIC), run(UNIT, true)]);
  failed = failed || !browsed || !statics || !unit;
} finally {
  stop();
}
console.log(`\n${times.join('\n')}`);
if (failed) {
  console.log('\nnpm test FAILED');
  process.exit(1);
}
if (inputsFingerprint() !== started) {
  console.log('\nthe run inputs changed while the tests ran: nothing recorded for the impact selector');
  process.exit(1);
}
writeSnapshot(snapshot, map);
console.log(`\nnpm test passed; the inputs are recorded for npm run test:changed${map ? ', with the coverage of every browser test' : ''}`);
