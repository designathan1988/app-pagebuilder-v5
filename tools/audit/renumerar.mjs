/* global process, console */
// Os ids dos grupos (GRE-<EST>-<nn>, GRL-<EST>-<nn>) saem da posição do nome da função na lista ordenada dos
// escritores e dos leitores de cada item (check.mjs, greId e grlId): um grupo que entra ou sai renumera os seguintes.
// Esta ferramenta lê, no cabeçalho de cada arquivo de auditoria/interacoes/, a função do escritor e a do leitor, calcula
// o id que a matriz dá hoje a cada uma e renomeia o arquivo (e os ids do título e do cabeçalho), em duas fases, sem
// colisão. Um par cuja função não está mais na matriz é listado como órfão e não é tocado.
// Uso: node tools/audit/renumerar.mjs [--seco] [--arquivar-orfaos]
// Resumo na saída (no máximo 30 linhas); a lista completa em .cache/audit/renumerar.json.
import fs from 'node:fs';
import path from 'node:path';
import { computeMatrix } from './lib.mjs';

const dry = process.argv.includes('--seco');
const DIR = 'auditoria/interacoes';
const mat = computeMatrix();
const idOf = (kind, est, fn) => {
  const entry = mat.get(est);
  if (!entry) return null;
  const fns = [...(kind === 'GRE' ? entry.writers : entry.readers).keys()].sort();
  const at = fns.indexOf(fn);
  return at < 0 ? null : `${kind}-${est}-${String(at + 1).padStart(2, '0')}`;
};

const renames = [];
const orphans = [];
for (const name of fs.readdirSync(DIR).filter((f) => f.endsWith('.md') && f.startsWith('EST-'))) {
  const text = fs.readFileSync(path.join(DIR, name), 'utf8');
  const est = /^# (EST-[A-Za-z0-9._-]+) ×/m.exec(text)?.[1];
  // the function's name may hold parentheses of its own (form.get('pattern')): it runs up to the "):" before the members
  const writer = /^- \*\*Escritor:\*\* (GRE-[A-Za-z0-9._-]+) \((.*?)\):/m.exec(text);
  const reader = /^- \*\*Leitor:\*\* (GRL-[A-Za-z0-9._-]+) \((.*?)\):/m.exec(text);
  if (!est || !writer || !reader) continue;
  const gre = idOf('GRE', est, writer[2]);
  const grl = idOf('GRL', est, reader[2]);
  if (gre === null || grl === null) {
    orphans.push({ file: name, writer: writer[2], reader: reader[2] });
    continue;
  }
  const target = `${est}__${gre}__${grl}.md`;
  if (target === name && writer[1] === gre && reader[1] === grl) continue;
  const fixed = text.split(writer[1]).join(gre).split(reader[1]).join(grl);
  renames.push({ from: name, to: target, text: fixed });
}
// --arquivar-orfaos: the pairs of a group the matrix no longer has (a reader that never read the item, taken out of the
// flows) leave auditoria/interacoes/ for .cache/audit/orfaos/, kept as they were, before anything is renamed
if (process.argv.includes('--arquivar-orfaos') && !dry && orphans.length > 0) {
  fs.mkdirSync('.cache/audit/orfaos', { recursive: true });
  for (const o of orphans) fs.renameSync(path.join(DIR, o.file), path.join('.cache/audit/orfaos', o.file));
}
const targets = new Set(renames.map((r) => r.to));
const clash = renames.filter((r) => fs.existsSync(path.join(DIR, r.to)) && !renames.some((o) => o.from === r.to));
if (!dry && clash.length === 0) {
  for (const r of renames) fs.renameSync(path.join(DIR, r.from), path.join(DIR, `${r.from}.renumerando`));
  for (const r of renames) {
    fs.writeFileSync(path.join(DIR, r.to), r.text);
    fs.rmSync(path.join(DIR, `${r.from}.renumerando`));
  }
}
fs.mkdirSync('.cache/audit', { recursive: true });
fs.writeFileSync('.cache/audit/renumerar.json', `${JSON.stringify({ renames: renames.map(({ from, to }) => ({ from, to })), orphans, clash: clash.map((c) => c.to) }, null, 2)}\n`);
const lines = [`${dry ? '(seco) ' : ''}pares renomeados: ${renames.length}; destinos distintos: ${targets.size}; colisões com arquivo de fora: ${clash.length}; órfãos: ${orphans.length}`];
for (const r of renames.slice(0, 10)) lines.push(`  ${r.from} → ${r.to}`);
for (const o of orphans.slice(0, 10)) lines.push(`  órfão ${o.file} (${o.writer} → ${o.reader})`);
console.log(lines.slice(0, 30).join('\n'));
if (clash.length > 0) process.exitCode = 1;
