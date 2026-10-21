// Proof of concept: instrumentation behind import.meta.env.DEV and behind a build constant (define) disappears from the
// production build. Builds in memory (write: false) in production mode, development mode and with the constant on (the
// test build), and looks for the probe's marker in each output. Usage: node auditoria/investigacao/poc/c-producao/build.mjs
import console from 'node:console';
import { performance } from 'node:perf_hooks';
import fs from 'node:fs';
import { build } from 'vite';

const ROOT = 'auditoria/investigacao/poc/c-producao/fonte';
const lines = [];
for (const [name, mode, probe] of [['production', 'production', false], ['development', 'development', false], ['test', 'production', true]]) {
  const start = performance.now();
  const output = await build({
    configFile: false,
    logLevel: 'silent',
    root: ROOT,
    mode,
    define: { __PROBE__: JSON.stringify(probe), 'import.meta.env.DEV': JSON.stringify(mode === 'development') },
    build: { write: false, minify: true, lib: { entry: 'entry.ts', formats: ['es'], fileName: 'output' } },
  });
  const chunks = (Array.isArray(output) ? output : [output]).flatMap((s) => s.output).filter((o) => o.type === 'chunk');
  const code = chunks.map((p) => p.code).join('\n');
  lines.push(`${name}: ${chunks.length} chunk(s), ${code.length} bytes, probe marker ${code.includes('VERIFICATION_PROBE_MARKER') ? 'PRESENT' : 'absent'}, ${(performance.now() - start).toFixed(0)} ms`);
}
fs.writeFileSync('auditoria/investigacao/poc/c-producao/resultados.txt', `${lines.join('\n')}\n`);
console.log(lines.join('\n'));
