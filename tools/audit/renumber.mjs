/* global process, console */
// The group ids (GRE-<EST>-<nn>, GRL-<EST>-<nn>) come from the position of the function's name in the sorted list of
// each item's writers and readers (check.mjs, greId and grlId): a group that enters or leaves renumbers the ones after it.
// This tool reads, in the header of each file in auditoria/interacoes/, the writer's function and the reader's,
// computes the id the matrix gives each of them today and renames the file (and the ids in the title and header), in two
// phases, without collisions. A pair whose function is no longer in the matrix is listed as an orphan and left untouched.
// The header labels it reads (Escritor, Leitor) are those of the Portuguese records.
// Usage: node tools/audit/renumber.mjs [--dry-run] [--archive-orphans]
// Summary on the output (at most 30 lines); the full list in .cache/audit/renumber.json.
import fs from 'node:fs';
import path from 'node:path';
import { computeMatrix } from './lib.mjs';

const dry = process.argv.includes('--dry-run');
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
// --archive-orphans: the pairs of a group the matrix no longer has (a reader that never read the item, taken out of the
// flows) leave auditoria/interacoes/ for .cache/audit/orphans/, kept as they were, before anything is renamed
if (process.argv.includes('--archive-orphans') && !dry && orphans.length > 0) {
  fs.mkdirSync('.cache/audit/orphans', { recursive: true });
  for (const o of orphans) fs.renameSync(path.join(DIR, o.file), path.join('.cache/audit/orphans', o.file));
}
const targets = new Set(renames.map((r) => r.to));
const clash = renames.filter((r) => fs.existsSync(path.join(DIR, r.to)) && !renames.some((o) => o.from === r.to));
if (!dry && clash.length === 0) {
  for (const r of renames) fs.renameSync(path.join(DIR, r.from), path.join(DIR, `${r.from}.renumbering`));
  for (const r of renames) {
    fs.writeFileSync(path.join(DIR, r.to), r.text);
    fs.rmSync(path.join(DIR, `${r.from}.renumbering`));
  }
}
fs.mkdirSync('.cache/audit', { recursive: true });
fs.writeFileSync('.cache/audit/renumber.json', `${JSON.stringify({ renames: renames.map(({ from, to }) => ({ from, to })), orphans, clash: clash.map((c) => c.to) }, null, 2)}\n`);
const lines = [`${dry ? '(dry run) ' : ''}pairs renamed: ${renames.length}; distinct targets: ${targets.size}; collisions with outside files: ${clash.length}; orphans: ${orphans.length}`];
for (const r of renames.slice(0, 10)) lines.push(`  ${r.from} → ${r.to}`);
for (const o of orphans.slice(0, 10)) lines.push(`  orphan ${o.file} (${o.writer} → ${o.reader})`);
console.log(lines.slice(0, 30).join('\n'));
if (clash.length > 0) process.exitCode = 1;
