/* global console */
// MED-0029 — não medido: nenhum fluxo cita este id.
// O procedimento (auditoria/medicoes/PROCEDIMENTO.md) diz que cada id já está citado por um ou mais fluxos, na seção
// `## Medições`. Este script procura o id em auditoria/fluxos/ e mostra quantas citações há: zero, e por isso não há
// valor nem estado a montar no navegador.
// Roda: cat auditoria/medicoes/MED-0029.mjs | node --input-type=module -
import fs from 'node:fs';
import path from 'node:path';

const ID = 'MED-0029';
const dir = path.join('auditoria', 'fluxos');
const files = [];
const walk = (d) => {
  for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith('.md')) files.push(p);
  }
};
walk(dir);
const hits = [];
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  if (text.includes(ID)) hits.push(f);
}
// os vizinhos, para mostrar que o id cai numa faixa em uso
const range = ['MED-0028', 'MED-0030'].map((id) => ({ id, citations: files.filter((f) => fs.readFileSync(f, 'utf8').includes(id)).length }));
console.log(JSON.stringify({ id: ID, flowFiles: files.length, citations: hits.length, files: hits, neighbours: range }));
