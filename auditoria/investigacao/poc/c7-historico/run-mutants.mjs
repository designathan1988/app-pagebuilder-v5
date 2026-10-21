// Runs the history proof of concept without a mutant and with each mutant from mutants.ts, one Vitest process per
// round, and writes the detection rate and the time to resultados/resumo.txt.
// Usage: node auditoria/investigacao/poc/c7-historico/run-mutants.mjs [runs]
import console from 'node:console';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const FOLDER = 'auditoria/investigacao/poc/c7-historico';
const runs = process.argv[2] ?? '300';
const source = fs.readFileSync(`${FOLDER}/mutants.ts`, 'utf8');
const ids = [...source.matchAll(/id: '(M\d+)'/g)].map((m) => m[1]);
const lines = [];
const runRound = (mutant) => {
  const start = Date.now();
  const r = spawnSync(process.execPath, ['node_modules/vitest/vitest.mjs', 'run', '--config', 'auditoria/investigacao/poc/vitest.poc.config.ts'], {
    env: { ...process.env, POC_MUTANT: mutant, POC_RUNS: runs },
    encoding: 'utf8',
  });
  const total = Date.now() - start;
  const file = `${FOLDER}/resultados/${mutant || 'original'}.txt`;
  const result = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
  return { mutant: mutant || 'original', exit: r.status, total, result };
};

for (const id of ['', ...ids]) {
  const file = `${FOLDER}/resultados/${id || 'original'}.txt`;
  if (fs.existsSync(file)) fs.rmSync(file);
  const { mutant, exit, total, result } = runRound(id);
  const applied = result?.applied ?? null;
  const detected = result?.detected ?? null;
  const reason = (result?.failure ?? '').split('\n').find((l) => l.startsWith('Cause:')) ?? '';
  lines.push({ mutant, exit, total, applied, detected, testMs: result?.ms ?? null, reason: reason.replace('Cause: ', '').slice(0, 160) });
  console.log(mutant, 'exit', exit, 'applied', applied, 'detected', detected, `${total} ms`);
}
const mutants = lines.filter((l) => l.mutant !== 'original');
const applied = mutants.filter((l) => l.applied === l.mutant);
const detected = applied.filter((l) => l.detected === true);
const text = [
  `runs per round: ${runs}`,
  `mutants: ${mutants.length}; loaded with the swap: ${applied.length}; detected: ${detected.length}`,
  '',
  'mutant | Vitest exit code | swap loaded | detected | test ms | process ms | first rule broken',
  ...lines.map((l) => `${l.mutant} | ${l.exit} | ${l.applied ?? '-'} | ${l.detected} | ${l.testMs} | ${l.total} | ${l.reason}`),
].join('\n');
fs.writeFileSync(`${FOLDER}/resultados/resumo.txt`, `${text}\n`);
console.log(text);
