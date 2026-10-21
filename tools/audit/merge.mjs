/* global process, console */
// Merges auditoria/<record>/*.md into auditoria/<record>.md, sorted by area name.
// Usage: node tools/audit/merge.mjs <record>
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib.mjs';

// Keys are the record directories under auditoria/; values are the Portuguese headings of the merged files.
const TITLES = {
  estado: 'Estado',
  entradas: 'Entradas',
  requisitos: 'Requisitos',
  matriz: 'Matriz',
};

const record = process.argv[2];
if (!record || !TITLES[record]) {
  console.error(`usage: node tools/audit/merge.mjs <${Object.keys(TITLES).join('|')}>`);
  process.exit(1);
}
const dir = path.join(ROOT, 'auditoria', record);
if (!fs.existsSync(dir)) {
  console.error(`auditoria/${record}/ does not exist: nothing to merge.`);
  process.exit(1);
}
// each record folder's PROCEDIMENTO file describes the work; it is not a record item.
const files = fs.readdirSync(dir).filter((e) => e.endsWith('.md') && !e.startsWith('PROCEDIMENTO')).sort();
let out = `# ${TITLES[record]}\n\n`;
for (const f of files) {
  out += fs.readFileSync(path.join(dir, f), 'utf8').trimEnd() + '\n\n';
}
fs.writeFileSync(path.join(ROOT, 'auditoria', `${record}.md`), out.trimEnd() + '\n');
console.log(`${record}.md: ${files.length} areas, ${out.split('\n').length} lines`);
