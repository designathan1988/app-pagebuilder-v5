/* global process, console */
// Reposiciona as citações da auditoria depois de uma edição no código, pelo diff exato entre a versão-base de cada
// arquivo citado (.cache/audit/base/<caminho>, gravada pela execução anterior) e a versão atual: a citação `arquivo:N`
// cuja linha N da base continha o trecho vai para a linha que corresponde a N na versão atual (subsequência comum
// mais longa, depois de tirar o começo e o fim iguais). Quando a própria linha citada mudou, ou o arquivo não tem base,
// a citação que não confere vai para a ocorrência do trecho mais próxima da linha antiga e é listada para revisão; a
// citação cujo trecho não existe mais fica como está e é listada: ela precisa de rastreamento, não de número novo.
// A conferência do trecho é a da trava (o trecho inteiro igual à linha, ou contido nela com 6 ou mais caracteres que
// não sejam espaço). No fim, a base passa a ser a versão atual de cada arquivo citado.
// Uso: node tools/audit/recitar.mjs [--seco]
// Primeiro uso, ou depois de uma edição feita sem base: grave a base antes de editar com --so-base.
// Resumo na saída (no máximo 30 linhas); a lista completa em .cache/audit/recitar.json.
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const dry = args.includes('--seco');
const baseOnly = args.includes('--so-base');
const BASE = '.cache/audit/base';
const RE = /`([^`\s]+?):(\d+)`(\s*)`([^`\n]+)`/g;

const fits = (line, snippet) => {
  const s = snippet.trim();
  return line !== undefined && (s === line.trim() || (s.replace(/\s/g, '').length >= 6 && line.includes(s)));
};
const split = (text) => text.split('\n').map((l) => l.replace(/\r$/, ''));
const read = (file) => {
  try { return fs.readFileSync(file, 'utf8'); } catch { return null; }
};

// linha antiga (1-based) → linha nova, para as linhas iguais nas duas versões
function lineMap(a, b) {
  const map = new Map();
  let head = 0;
  while (head < a.length && head < b.length && a[head] === b[head]) { map.set(head + 1, head + 1); head++; }
  let tail = 0;
  while (tail < a.length - head && tail < b.length - head && a[a.length - 1 - tail] === b[b.length - 1 - tail]) tail++;
  for (let k = 0; k < tail; k++) map.set(a.length - k, b.length - k);
  const x = a.slice(head, a.length - tail);
  const y = b.slice(head, b.length - tail);
  const n = x.length;
  const m = y.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = x[i] === y[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (x[i] === y[j]) { map.set(head + i + 1, head + j + 1); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return map;
}

const records = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.md')) records.push(p.split(path.sep).join('/'));
  }
};
walk('auditoria');

const files = new Map();
function fileOf(name) {
  if (!files.has(name)) {
    const now = read(name);
    const base = read(path.join(BASE, name));
    const entry = { now: now === null ? null : split(now), base: base === null ? null : split(base), text: now, map: null };
    if (entry.now !== null && entry.base !== null && base !== now) entry.map = lineMap(entry.base, entry.now);
    files.set(name, entry);
  }
  return files.get(name);
}

let exact = 0;
let nearest = 0;
let touched = 0;
const review = [];
const lost = [];
if (!baseOnly) {
  for (const rel of records) {
    const text = fs.readFileSync(rel, 'utf8');
    let changed = false;
    const out = text.replace(RE, (whole, file, n, gap, snippet) => {
      const name = file.replace(/\\/g, '/');
      const f = fileOf(name);
      if (f.now === null) return whole;
      const old = Number(n);
      // the base held the snippet at N: the line N became is where it is now
      if (f.map !== null && fits(f.base[old - 1], snippet)) {
        const to = f.map.get(old);
        if (to !== undefined && fits(f.now[to - 1], snippet)) {
          if (to === old) return whole;
          exact += 1;
          changed = true;
          return `\`${file}:${to}\`${gap}\`${snippet}\``;
        }
      }
      if (fits(f.now[old - 1], snippet)) return whole;
      let best = -1;
      for (let i = 0; i < f.now.length; i++) if (fits(f.now[i], snippet) && (best < 0 || Math.abs(i + 1 - old) < Math.abs(best + 1 - old))) best = i;
      if (best < 0) {
        lost.push({ registro: rel, citacao: `${name}:${old}`, trecho: snippet.slice(0, 120) });
        return whole;
      }
      nearest += 1;
      review.push({ registro: rel, citacao: `${name}:${old}`, para: best + 1, trecho: snippet.slice(0, 120) });
      changed = true;
      return `\`${file}:${best + 1}\`${gap}\`${snippet}\``;
    });
    if (changed) {
      touched += 1;
      if (!dry) fs.writeFileSync(rel, out);
    }
  }
}
// the base becomes the version now of every file the records cite
if (!dry) {
  for (const rel of records) for (const m of fs.readFileSync(rel, 'utf8').matchAll(RE)) fileOf(m[1].replace(/\\/g, '/'));
  for (const [name, f] of files) {
    if (f.text === null) continue;
    const to = path.join(BASE, name);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.writeFileSync(to, f.text);
  }
}
fs.mkdirSync('.cache/audit', { recursive: true });
fs.writeFileSync('.cache/audit/recitar.json', `${JSON.stringify({ exact, nearest, touched, review, lost }, null, 2)}\n`);
const linhas = [`${dry ? '(seco) ' : ''}${baseOnly ? 'base gravada' : `citações reposicionadas pelo diff: ${exact}; pela ocorrência mais próxima (a revisar): ${nearest}; em ${touched} registros; trechos que não existem mais: ${lost.length}`}; arquivos citados: ${files.size}`];
for (const r of review.slice(0, 12)) linhas.push(`  revisar ${r.registro}: ${r.citacao} → ${r.para} \`${r.trecho.slice(0, 60)}\``);
for (const l of lost.slice(0, 12)) linhas.push(`  perdida ${l.registro}: ${l.citacao} \`${l.trecho.slice(0, 60)}\``);
if (review.length + lost.length > 24) linhas.push(`  ... lista completa em .cache/audit/recitar.json`);
console.log(linhas.slice(0, 30).join('\n'));
