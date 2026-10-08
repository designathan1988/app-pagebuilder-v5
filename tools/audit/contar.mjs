/* global console */
// Conta as ocorrências de cada padrão de auditoria/padroes.json nos alvos, por padrão e no total.
// Uso: node tools/audit/contar.mjs
import fs from 'node:fs';
import { ROOT, scopeFiles, readText, matchAny } from './lib.mjs';
import path from 'node:path';

const padroes = JSON.parse(fs.readFileSync(path.join(ROOT, 'auditoria', 'padroes.json'), 'utf8'));
const targetsOf = (alvo) => {
  const def = padroes.alvos[alvo];
  return scopeFiles().filter((f) => def.incluir.some((g) => matchAny(f, [g])) && !(def.excluir || []).some((g) => matchAny(f, [g])));
};
const byAlvo = new Map();
for (const alvo of Object.keys(padroes.alvos)) byAlvo.set(alvo, targetsOf(alvo));

let total = 0;
for (const p of padroes.padroes) {
  const re = new RegExp(p.regex, p.flags || '');
  let n = 0;
  for (const f of byAlvo.get(p.alvo) || []) {
    const text = readText(f) || '';
    for (const line of text.split('\n')) {
      re.lastIndex = 0;
      if (re.test(line)) n += 1;
    }
  }
  total += n;
  console.log(`${p.id} ${p.tipo} ${p.alvo}: ${n}`);
}
console.log(`TOTAL: ${total} ocorrências`);
