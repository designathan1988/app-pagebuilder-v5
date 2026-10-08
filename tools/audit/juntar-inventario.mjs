/* global process, console */
// Junta auditoria/inventario/<lote>.md em auditoria/inventario-arquivos.md, ordenado por caminho.
// Uso: node tools/audit/juntar-inventario.mjs
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, mergeInventario } from './lib.mjs';

const out = mergeInventario();
if (out === null) {
  console.error('auditoria/inventario/ não existe: nada a juntar.');
  process.exit(1);
}
fs.writeFileSync(path.join(ROOT, 'auditoria', 'inventario-arquivos.md'), out);
console.log(`inventario-arquivos.md: ${out.split('\n').length} linhas`);
