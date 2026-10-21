/* global process, console */
// Keeps the inventory up to date after a code change: for each given file, updates the line count, SHA1 and parts read
// in the block it already has in a batch (auditoria/inventario/L*.md), or appends a new block to the given batch, with
// the purpose read from the purposes file (JSON, path → purpose) and the anchor on the first line that declares something.
// The parts respect the lock's read limit (sum of the characters plus 8 per line). At the end it merges
// auditoria/inventario-arquivos.md.
// The block field labels (Lote, Linhas, SHA1, Partes lidas, Propósito, Âncora) are those of the Portuguese records.
// Usage: node tools/audit/inventory.mjs [--batch L23] [--purposes file.json] <file>...
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, cfg, fileInfo, lineCosts, mergeInventory, readText } from './lib.mjs';

const args = process.argv.slice(2);
const option = (name) => {
  const at = args.indexOf(name);
  return at < 0 ? null : args[at + 1];
};
const batch = option('--batch') ?? 'L23';
const purposesFile = option('--purposes');
const purposes = purposesFile === null ? {} : JSON.parse(fs.readFileSync(purposesFile, 'utf8'));
const files = args.filter((a, i) => !a.startsWith('--') && !['--batch', '--purposes'].includes(args[i - 1]));

function parts(rel, info) {
  const prefix = lineCosts(rel, info);
  const out = [];
  let a = 1;
  for (let b = 1; b <= info.l; b++) {
    if (prefix[b] - prefix[a - 1] > cfg.readLimitChars) {
      out.push(`${a}-${b - 1}`);
      a = b;
    }
  }
  if (info.l >= a) out.push(`${a}-${info.l}`);
  return out.join('; ');
}
function anchor(rel) {
  const lines = (readText(rel) || '').split('\n').map((l) => l.replace(/\r$/, ''));
  const at = lines.findIndex((l) => /^(export |import |const |function |interface |type |class |\{|\(|[A-Za-z_#.@:-])/.test(l) && !/^\s*(\/\/|\/\*|\*)/.test(l) && l.trim().replace(/\s/g, '').length >= 6 && !l.includes('`'));
  return at < 0 ? null : `\`${rel}:${at + 1}\` \`${lines[at].trim()}\``;
}

const dir = path.join(ROOT, 'auditoria', 'inventario');
const lots = fs.readdirSync(dir).filter((x) => /^L\d+[a-z]?\.md$/.test(x));
const report = [];
for (const rel of files.map((f) => f.replace(/\\/g, '/'))) {
  const info = fileInfo(rel);
  if (info === null) { report.push(`${rel}: does not exist`); continue; }
  const head = `### \`${rel}\``;
  const holder = lots.find((l) => (readText(`auditoria/inventario/${l}`) || '').split('\n').some((line) => line.trim() === head));
  if (holder !== undefined) {
    const file = `auditoria/inventario/${holder}`;
    const text = readText(file);
    const start = text.split('\n').findIndex((line) => line.trim() === head);
    const lines = text.split('\n');
    let end = lines.findIndex((line, i) => i > start && line.startsWith('### '));
    if (end < 0) end = lines.length;
    for (let i = start; i < end; i++) {
      if (lines[i].startsWith('- **Linhas:**')) lines[i] = `- **Linhas:** ${info.l}`;
      else if (lines[i].startsWith('- **SHA1:**')) lines[i] = `- **SHA1:** ${info.h}`;
      else if (lines[i].startsWith('- **Partes lidas:**')) lines[i] = `- **Partes lidas:** ${parts(rel, info)}`;
    }
    fs.writeFileSync(path.join(ROOT, file), lines.join('\n'));
    report.push(`${rel}: updated in ${holder}`);
    continue;
  }
  const purpose = purposes[rel];
  if (!purpose) { report.push(`${rel}: no purpose in the purposes file; nothing written`); continue; }
  const target = path.join(dir, `${batch}.md`);
  // The heading of a new batch file stays in Portuguese, like the other inventory records.
  const held = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : `# Inventário do lote ${batch} — arquivos dos mecanismos de verificação (auditoria/mecanismos.md)\n\n`;
  const at = anchor(rel);
  const block = [head, `- **Lote:** ${batch}`, `- **Linhas:** ${info.l}`, `- **SHA1:** ${info.h}`, `- **Partes lidas:** ${parts(rel, info)}`, `- **Propósito:** ${purpose}`, ...(at === null ? [] : [`- **Âncora:** ${at}`])].join('\n');
  fs.writeFileSync(target, `${held.trimEnd()}\n\n${block}\n`);
  report.push(`${rel}: new block in ${batch}`);
}
const merged = mergeInventory();
if (merged !== null) fs.writeFileSync(path.join(ROOT, 'auditoria', 'inventario-arquivos.md'), merged);
console.log(report.slice(0, 30).join('\n'));
