/* global console */
// Phase 7: forms the writer and reader groups from the marks in the flows and the
// snippet citations, and freezes auditoria/matriz.md. Usage: node tools/audit/matrix.mjs
// The generated record keeps the Portuguese field labels that check.mjs parses.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, computeMatrix } from './lib.mjs';

const mat = computeMatrix();
const ests = [...mat.keys()].sort();
let out = '# Matriz\n\n';
let pairCount = 0;
for (const est of ests) {
  const e = mat.get(est);
  const wFns = [...e.writers.keys()].sort();
  const rFns = [...e.readers.keys()].sort();
  const wUnits = wFns.map((fn, i) => ({ id: `GRE-${est}-${String(i + 1).padStart(2, '0')}`, fn, ids: [...e.writers.get(fn)].sort() }));
  const rUnits = rFns.map((fn, i) => ({ id: `GRL-${est}-${String(i + 1).padStart(2, '0')}`, fn, ids: [...e.readers.get(fn)].sort() }));
  out += `## ${est}\n`;
  out += `- **Escritores:** ${wUnits.map((u) => u.ids.join(', ')).flat().join(', ') || 'nenhum'}\n`;
  out += `- **Leitores:** ${rUnits.map((u) => u.ids.join(', ')).flat().join(', ') || 'nenhum'}\n`;
  if (wUnits.length) {
    out += '- **Grupos de escritores:**\n';
    for (const u of wUnits) out += `  - ${u.id}: ${u.fn} — cobre ${u.ids.join(', ')}\n`;
  } else out += '- **Grupos de escritores:** nenhum\n';
  if (rUnits.length) {
    out += '- **Grupos de leitores:**\n';
    for (const u of rUnits) out += `  - ${u.id}: ${u.fn} — cobre ${u.ids.join(', ')}\n`;
  } else out += '- **Grupos de leitores:** nenhum\n';
  // A pair needs both sides: an item with no group on one side has no pair, and C6 checks the same list.
  const p = [];
  for (const w of wUnits) for (const r of rUnits) p.push(`${est}__${w.id}__${r.id}`);
  pairCount += p.length;
  out += `- **Pares:** ${p.join(', ')}\n\n`;
}
fs.writeFileSync(path.join(ROOT, 'auditoria', 'matriz.md'), out);
console.log(`matriz.md: ${ests.length} state items, ${pairCount} pairs`);
