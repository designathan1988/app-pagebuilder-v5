/* global process, console */
// Fase 7: cria os esqueletos dos pares de um item de estado em auditoria/interacoes/:
// título, ids, membros dos grupos e títulos de seção. Nunca conteúdo.
// Uso: node tools/audit/esqueletos.mjs <EST-x>
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, computeMatrix } from './lib.mjs';

const est = process.argv[2];
if (!est) {
  console.error('uso: node tools/audit/esqueletos.mjs <EST-x>');
  process.exit(1);
}
const mat = computeMatrix();
const e = mat.get(est);
if (!e) {
  console.error(`${est} não aparece em nenhum fluxo ou trecho.`);
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
    const nome = `${est}__${w.id}__${r.id}.md`;
    const p = path.join(dir, nome);
    if (fs.existsSync(p)) continue;
    const esc = `${w.id} (${w.fn}): ${w.ids.join(', ')}`;
    const lei = `${r.id} (${r.fn}): ${r.ids.join(', ')}`;
    const texto = [
      `# ${est} × ${w.id} → ${r.id}`,
      `- **Estado:** ${est}`,
      `- **Escritor:** ${esc}`,
      `- **Leitor:** ${lei}`,
      '## Estados deixados por A',
      '## Casos',
      '### C1 final',
      '### C2 intermediário',
      '### C3 em curso',
      '### C4 desmontagem',
      '## Resultado',
      '',
    ].join('\n');
    fs.writeFileSync(p, texto);
    n++;
  }
}
console.log(`${est}: ${n} esqueletos criados em auditoria/interacoes/`);
