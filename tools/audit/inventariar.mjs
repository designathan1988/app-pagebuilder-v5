/* global process, console */
// Mantém o inventário depois de uma mudança no código: para cada arquivo dado, atualiza Linhas, SHA1 e Partes lidas no
// bloco que ele já tem num lote (auditoria/inventario/L*.md), ou acrescenta um bloco novo ao lote dado, com o
// propósito lido do arquivo de propósitos (JSON, caminho → propósito) e a âncora na primeira linha que declara algo.
// As partes respeitam o limite de leitura da trava (soma dos caracteres mais 8 por linha). No fim junta
// auditoria/inventario-arquivos.md.
// Uso: node tools/audit/inventariar.mjs [--lote L23] [--propositos arquivo.json] <arquivo>...
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, cfg, fileInfo, lineCosts, mergeInventario, readText } from './lib.mjs';

const args = process.argv.slice(2);
const option = (name) => {
  const at = args.indexOf(name);
  return at < 0 ? null : args[at + 1];
};
const lote = option('--lote') ?? 'L23';
const purposesFile = option('--propositos');
const purposes = purposesFile === null ? {} : JSON.parse(fs.readFileSync(purposesFile, 'utf8'));
const files = args.filter((a, i) => !a.startsWith('--') && !['--lote', '--propositos'].includes(args[i - 1]));

function parts(rel, info) {
  const prefix = lineCosts(rel, info);
  const out = [];
  let a = 1;
  for (let b = 1; b <= info.l; b++) {
    if (prefix[b] - prefix[a - 1] > cfg.limiteLeituraCaracteres) {
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
  if (info === null) { report.push(`${rel}: não existe`); continue; }
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
    report.push(`${rel}: atualizado em ${holder}`);
    continue;
  }
  const purpose = purposes[rel];
  if (!purpose) { report.push(`${rel}: sem propósito no arquivo de propósitos; nada escrito`); continue; }
  const target = path.join(dir, `${lote}.md`);
  const held = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : `# Inventário do lote ${lote} — arquivos dos mecanismos de verificação (auditoria/mecanismos.md)\n\n`;
  const at = anchor(rel);
  const block = [head, `- **Lote:** ${lote}`, `- **Linhas:** ${info.l}`, `- **SHA1:** ${info.h}`, `- **Partes lidas:** ${parts(rel, info)}`, `- **Propósito:** ${purpose}`, ...(at === null ? [] : [`- **Âncora:** ${at}`])].join('\n');
  fs.writeFileSync(target, `${held.trimEnd()}\n\n${block}\n`);
  report.push(`${rel}: bloco novo em ${lote}`);
}
const merged = mergeInventario();
if (merged !== null) fs.writeFileSync(path.join(ROOT, 'auditoria', 'inventario-arquivos.md'), merged);
console.log(report.slice(0, 30).join('\n'));
