/* global process, console */
// Merges auditoria/inventario/<batch>.md into auditoria/inventario-arquivos.md, sorted by path.
// Usage: node tools/audit/merge-inventory.mjs
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, mergeInventory } from './lib.mjs';

const out = mergeInventory();
if (out === null) {
  console.error('auditoria/inventario/ does not exist: nothing to merge.');
  process.exit(1);
}
fs.writeFileSync(path.join(ROOT, 'auditoria', 'inventario-arquivos.md'), out);
console.log(`inventario-arquivos.md: ${out.split('\n').length} lines`);
