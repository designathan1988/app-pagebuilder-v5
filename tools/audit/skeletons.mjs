/* global process, console */
// Phase 7: creates the skeletons of a state item's pairs in auditoria/interacoes/:
// title, ids, group members and section titles. Never content.
// The skeleton text is the Portuguese record format that check.mjs and renumber.mjs parse.
// Usage: node tools/audit/skeletons.mjs <EST-x>
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, computeMatrix } from './lib.mjs';

const est = process.argv[2];
if (!est) {
  console.error('usage: node tools/audit/skeletons.mjs <EST-x>');
  process.exit(1);
}
const mat = computeMatrix();
const e = mat.get(est);
if (!e) {
  console.error(`${est} does not appear in any flow or snippet.`);
  process.exit(1);
}
const wFns = [...e.writers.keys()].sort();
const rFns = [...e.readers.keys()].sort();
const wUnits = wFns.map((fn, i) => ({ id: `GRE-${est}-${String(i + 1).padStart(2, '0')}`, fn, ids: [...e.writers.get(fn)].sort() }));
const rUnits = rFns.map((fn, i) => ({ id: `GRL-${est}-${String(i + 1).padStart(2, '0')}`, fn, ids: [...e.readers.get(fn)].sort() }));

const dir = path.join(ROOT, 'auditoria', 'interacoes');
fs.mkdirSync(dir, { recursive: true });
let n = 0;
for (const w of wUnits) {
  for (const r of rUnits) {
    const name = `${est}__${w.id}__${r.id}.md`;
    const p = path.join(dir, name);
    if (fs.existsSync(p)) continue;
    const writer = `${w.id} (${w.fn}): ${w.ids.join(', ')}`;
    const reader = `${r.id} (${r.fn}): ${r.ids.join(', ')}`;
    const text = [
      `# ${est} × ${w.id} → ${r.id}`,
      `- **Estado:** ${est}`,
      `- **Escritor:** ${writer}`,
      `- **Leitor:** ${reader}`,
      '## Estados deixados por A',
      '## Casos',
      '### C1 final',
      '### C2 intermediário',
      '### C3 em curso',
      '### C4 desmontagem',
      '## Resultado',
      '',
    ].join('\n');
    fs.writeFileSync(p, text);
    n++;
  }
}
console.log(`${est}: ${n} skeletons created in auditoria/interacoes/`);
