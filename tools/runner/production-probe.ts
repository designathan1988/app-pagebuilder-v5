// The proof that what development alone carries leaves the build (the investigation's proof P5, grown from
// auditoria/investigacao/poc/c-producao/construir.mjs): it builds the app in memory twice, with import.meta.env.DEV
// replaced by false (every real build) and by true, and looks for each development-only mark in the chunks. The mark
// must be absent from the first and present in the second: the second shows the search sees the code it looks for, so
// the check vite.config.ts makes on every build (development-only) is not blind.
// Usage: node tools/runner/production-probe.ts
import { performance } from 'node:perf_hooks';
import process from 'node:process';
import react from '@vitejs/plugin-react';
import { build, type Rollup } from 'vite';
import { HISTORY_RULES_MARK } from '../../src/core/history/invariants.ts';

const MARKS = [HISTORY_RULES_MARK];
let failed = false;
for (const dev of [false, true]) {
  const start = performance.now();
  const out = (await build({
    configFile: false,
    logLevel: 'silent',
    plugins: [react()],
    define: { __BUILDER_TEST_PORT__: 'false', 'import.meta.env.DEV': JSON.stringify(dev) },
    build: { write: false, minify: true },
  })) as Rollup.RollupOutput | Rollup.RollupOutput[];
  const chunks = (Array.isArray(out) ? out : [out]).flatMap((o) => o.output).filter((o): o is Rollup.OutputChunk => o.type === 'chunk');
  const code = chunks.map((c) => c.code).join('\n');
  for (const mark of MARKS) {
    const present = code.includes(mark);
    const right = present === dev;
    if (!right) failed = true;
    console.log(`DEV=${String(dev)}: ${chunks.length} pedaços, ${code.length} bytes; marca ${mark} ${present ? 'PRESENTE' : 'ausente'} (${right ? 'como deve' : 'ERRADO'}); ${(performance.now() - start).toFixed(0)} ms`);
  }
}
process.exitCode = failed ? 1 : 0;
