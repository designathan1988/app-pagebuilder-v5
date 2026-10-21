/* global console */
// Counts the occurrences of each pattern in auditoria/padroes.json across its targets, per pattern and in total.
// The JSON keeps its Portuguese keys (alvos, incluir, excluir, padroes, tipo, alvo).
// Usage: node tools/audit/count.mjs
import fs from 'node:fs';
import { ROOT, scopeFiles, readText, matchAny } from './lib.mjs';
import path from 'node:path';

const patterns = JSON.parse(fs.readFileSync(path.join(ROOT, 'auditoria', 'padroes.json'), 'utf8'));
const targetsOf = (target) => {
  const def = patterns.alvos[target];
  return scopeFiles().filter((f) => def.incluir.some((g) => matchAny(f, [g])) && !(def.excluir || []).some((g) => matchAny(f, [g])));
};
const byTarget = new Map();
for (const target of Object.keys(patterns.alvos)) byTarget.set(target, targetsOf(target));

let total = 0;
for (const p of patterns.padroes) {
  const re = new RegExp(p.regex, p.flags || '');
  let n = 0;
  for (const f of byTarget.get(p.alvo) || []) {
    const text = readText(f) || '';
    for (const line of text.split('\n')) {
      re.lastIndex = 0;
      if (re.test(line)) n += 1;
    }
  }
  total += n;
  console.log(`${p.id} ${p.tipo} ${p.alvo}: ${n}`);
}
console.log(`TOTAL: ${total} occurrences`);
