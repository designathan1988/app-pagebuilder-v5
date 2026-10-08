// The run of the catalogue of mutants (tools/runner/mutants.ts): the baseline without a mutant must pass, then each
// mutant runs in a Vitest process of its own (the swap happens when a module loads, so one process holds one mutant),
// four at a time and at a low priority, over the detectors that reach it. It measures the rate of mutants detected and
// fails when the baseline fails, when a mutant's passage did not load (no detector loaded its file, or the passage is
// gone from the file), or when a mutant survives with no reason written in the catalogue.
// Usage: node tools/runner/mutants-run.ts [--only M01,M02] [--detector history]
// The summary (at most 30 lines) goes to the terminal; the whole of it to .cache/mutants/summary.json.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import process from 'node:process';
import { MUTANTS, ALL_DETECTORS, type Detector, type Mutant } from './mutants.ts';

const OUT = '.cache/mutants';
const option = (name: string): string | null => {
  const at = process.argv.indexOf(name);
  return at < 0 ? null : (process.argv[at + 1] ?? null);
};
const only = option('--only')?.split(',') ?? null;
const detector = option('--detector') as Detector | null;
const chosen = MUTANTS.filter((m) => (only === null || only.includes(m.id)) && (detector === null || m.detectors.includes(detector)));

interface Run {
  readonly mutant: string;
  readonly exit: number | null;
  readonly ms: number;
  readonly applied: boolean;
  readonly detected: boolean;
  readonly rule: string;
}

const testFiles = (detectors: readonly Detector[]): string[] => detectors.map((d) => `tools/runner/model/${d}.test.ts`);

// the first rule a failing run names: the model's cause (.cache/model/<mutant>/<group>.json), else the first failure
// message of the JSON report
function firstRule(report: string, id: string, detectors: readonly Detector[]): string {
  for (const group of detectors) {
    const file = `.cache/model/${id}/${group}.json`;
    if (!fs.existsSync(file)) continue;
    const failure = (JSON.parse(fs.readFileSync(file, 'utf8')) as { failure: string | null }).failure;
    if (failure === null) continue;
    const cause = /Causa: (.+)/.exec(failure)?.[1];
    return `${group}: ${cause ?? failure.split('\n')[0] ?? ''}`;
  }
  try {
    const json = JSON.parse(fs.readFileSync(report, 'utf8')) as { testResults?: { assertionResults?: { failureMessages?: string[] }[]; message?: string }[] };
    for (const file of json.testResults ?? []) {
      if (file.message) return file.message.split('\n')[0] ?? '';
      for (const test of file.assertionResults ?? []) {
        const text = (test.failureMessages ?? []).join('\n');
        const cause = /Causa: ([^\n"\\]+)/.exec(text)?.[1];
        if (cause !== undefined) return cause;
        const line = text.split('\n').find((l) => l.trim() !== '');
        if (line !== undefined) return line.trim();
      }
    }
  } catch {
    return 'sem relatório do Vitest';
  }
  return '';
}

function run(mutant: Mutant | null): Promise<Run> {
  const id = mutant?.id ?? 'baseline';
  const report = `${OUT}/${id}.report.json`;
  fs.rmSync(report, { force: true });
  fs.rmSync(`${OUT}/${id}.applied`, { force: true });
  fs.rmSync(`.cache/model/${id}`, { recursive: true, force: true });
  const start = Date.now();
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ['node_modules/vitest/vitest.mjs', 'run', '--config', 'tools/runner/model/vitest.config.ts', '--reporter=json', `--outputFile=${report}`, ...testFiles(mutant?.detectors ?? ALL_DETECTORS)], {
      env: { ...process.env, BUILDER_MUTANT: mutant?.id ?? '' },
      stdio: 'ignore',
    });
    if (child.pid !== undefined) os.setPriority(child.pid, os.constants.priority.PRIORITY_BELOW_NORMAL);
    const timer = setTimeout(() => child.kill(), 300_000);
    child.on('exit', (exit) => {
      clearTimeout(timer);
      const applied = mutant === null || fs.existsSync(`${OUT}/${mutant.id}.applied`);
      resolve({ mutant: id, exit, ms: Date.now() - start, applied, detected: exit !== 0, rule: exit === 0 ? '' : firstRule(report, id, mutant?.detectors ?? ALL_DETECTORS) });
    });
  });
}

async function pool<T, R>(items: readonly T[], size: number, work: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array<R>(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (next < items.length) {
      const at = next++;
      out[at] = await work(items[at] as T);
    }
  }));
  return out;
}

fs.mkdirSync(OUT, { recursive: true });
const started = Date.now();
const baseline = await run(null);
const lines: string[] = [];
let failed = false;
if (baseline.exit !== 0) {
  lines.push(`linha de base FALHOU (${baseline.ms} ms): ${baseline.rule}`);
  failed = true;
}
const runs = failed ? [] : await pool(chosen, 4, run);
const results = runs.map((r) => {
  const mutant = MUTANTS.find((m) => m.id === r.mutant) as Mutant;
  const verdict = !r.applied ? 'TROCA NÃO CARREGADA' : r.detected ? 'acusado' : mutant.equivalent !== undefined ? 'sobrevive (equivalente)' : 'SOBREVIVEU';
  return { ...r, verdict, breaks: mutant.breaks, source: mutant.source, detectors: mutant.detectors, equivalent: mutant.equivalent ?? null };
});
const detected = results.filter((r) => r.verdict === 'acusado').length;
const equivalent = results.filter((r) => r.verdict === 'sobrevive (equivalente)').length;
const bad = results.filter((r) => r.verdict === 'SOBREVIVEU' || r.verdict === 'TROCA NÃO CARREGADA');
if (bad.length > 0) failed = true;
const total = Date.now() - started;
fs.writeFileSync(`${OUT}/summary.json`, `${JSON.stringify({ baseline, results, detected, equivalent, total }, null, 2)}\n`);

lines.unshift(`mutantes: ${results.length}; acusados: ${detected}; equivalentes com motivo: ${equivalent}; taxa de acusação dos não equivalentes: ${results.length - equivalent === 0 ? '-' : `${((100 * detected) / (results.length - equivalent)).toFixed(1)}%`}; linha de base ${baseline.ms} ms; total ${(total / 1000).toFixed(1)} s`);
for (const r of results.filter((x) => x.verdict !== 'acusado').slice(0, 20)) lines.push(`${r.mutant} ${r.verdict}: ${r.breaks}`);
const slowest = [...results].sort((a, b) => b.ms - a.ms)[0];
if (slowest !== undefined) lines.push(`processo mais lento: ${slowest.mutant} ${slowest.ms} ms`);
lines.push(`completo em ${OUT}/summary.json`);
console.log(lines.slice(0, 30).join('\n'));
process.exitCode = failed ? 1 : 0;
