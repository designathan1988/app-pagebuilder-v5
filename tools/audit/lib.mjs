/* global process */
// Utilitários compartilhados pelos scripts de tools/audit/.
// Reimplementa a vistoria da trava (.claude/hooks/vistoria.mjs) para que o
// verificador da auditoria use exatamente o mesmo escopo, hashes e regras de citação.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

export const ROOT = path.resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd());
export const WIN = process.platform === 'win32';

const CONFIG_FILE = path.join(ROOT, '.claude', 'vistoria.config.json');
const DEFAULT_CONFIG = {
  ignorar: [
    '.git/**', '**/node_modules/**', 'dist/**', 'auditoria/**', '.claude/**',
    '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp', '**/*.ico', '**/*.avif', '**/*.bmp',
    '**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.otf', '**/*.eot',
    '**/*.mp4', '**/*.webm', '**/*.mp3', '**/*.wav', '**/*.ogg',
    '**/*.pdf', '**/*.zip', '**/*.gz', '**/*.tgz',
    'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lockb',
  ],
  livres: ['auditoria/**', 'tools/audit/**', 'CLAUDE.md'],
  proibidosDeEditar: ['**/node_modules/**', 'dist/**', 'PROMPT.md'],
  extensoesCodigo: ['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs', '.vue', '.svelte'],
  registrosDeMudanca: ['auditoria/defeitos.md', 'auditoria/otimizacoes.md'],
  limiteLeituraCaracteres: 60000,
  verificadorAuditoria: 'node tools/audit/check.mjs',
  comandosVerificacao: ['npm run typecheck', 'npm run lint'],
  palavrasProibidas: ['etc.', 'e assim por diante', 'similar', 'mesmo padrão', 'análogo', 'presumivelmente',
    'provavelmente', 'deve funcionar', 'aparentemente'],
  palavrasDeConclusao: ['funciona', 'corrigido', 'corrigida', 'garantido', 'garantida', '100%', 'sem erros'],
};

function loadJSON(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { /* arquivo ausente ou inválido */ return fallback; }
}

export const cfg = { ...DEFAULT_CONFIG, ...loadJSON(CONFIG_FILE, {}) };

export function toRel(p) {
  if (!p || typeof p !== 'string') return null;
  const abs = path.resolve(ROOT, p);
  const r = path.relative(ROOT, abs);
  if (!r || r.startsWith('..') || path.isAbsolute(r)) return null;
  return r.split(path.sep).join('/');
}

export const keyOf = (r) => (WIN ? r.toLowerCase() : r);

export function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        i++;
        if (glob[i + 1] === '/') { i++; re += '(?:.*/)?'; } else { re += '.*'; }
      } else { re += '[^/]*'; }
    } else if (c === '?') { re += '[^/]'; } else { re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&'); }
  }
  return new RegExp('^' + re + '$', WIN ? 'i' : '');
}

const reCache = new Map();
export function matchAny(rel, globs) {
  return globs.some((g) => {
    if (!reCache.has(g)) reCache.set(g, globToRegExp(g));
    return reCache.get(g).test(rel);
  });
}

const infoCache = new Map();
export function fileInfo(rel) {
  if (infoCache.has(rel)) return infoCache.get(rel);
  let st;
  try { st = fs.statSync(path.join(ROOT, rel)); } catch { /* ausente */ return null; }
  if (!st.isFile()) return null;
  const buf = fs.readFileSync(path.join(ROOT, rel));
  const text = buf.toString('utf8');
  const lines = buf.length === 0 ? 0 : text.split('\n').length - (text.endsWith('\n') ? 1 : 0);
  const v = { s: st.size, h: crypto.createHash('sha1').update(buf).digest('hex'), l: lines };
  infoCache.set(rel, v);
  return v;
}

function walk(dir, out) {
  for (const ent of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = dir ? dir + '/' + ent.name : ent.name;
    if (ent.isDirectory()) {
      if (['.git', 'node_modules', 'dist'].includes(ent.name)) continue;
      walk(rel, out);
    } else if (ent.isFile()) out.push(rel);
  }
  return out;
}

export function scopeFiles() {
  const r = spawnSync('git', ['-c', `safe.directory=${ROOT}`, 'ls-files', '-co', '--exclude-standard', '-z'],
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 });
  const all = r.status === 0 ? r.stdout.split('\0').filter(Boolean) : walk('', []);
  const seen = new Set();
  const out = [];
  for (const f of all) {
    if (matchAny(f, cfg.ignorar)) continue;
    if (seen.has(keyOf(f))) continue;
    seen.add(keyOf(f));
    if (fileInfo(f)) out.push(f);
  }
  out.sort();
  return out;
}

export function linesOf(rel) {
  try { return fs.readFileSync(path.join(ROOT, rel), 'utf8').split('\n').map((l) => l.replace(/\r$/, '')); }
  catch { /* ausente */ return null; }
}

export function readText(rel) {
  try { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); } catch { /* ausente */ return null; }
}

// ---------- citações ----------

const CITATION_RE = /`([^`\s]+?):(\d+)`\s*`([^`\n]+)`/g;
const NAKED_RE = /`([^`\s]+?):(\d+)`/g;

export function citationErrors(rel, text) {
  const errs = [];
  for (const m of text.matchAll(CITATION_RE)) {
    const [, file, lineStr, snippet] = m;
    const lines = linesOf(file.replace(/\\/g, '/'));
    const n = Number(lineStr);
    if (!lines) { errs.push(`${rel}: cita ${file}:${n}, arquivo inexistente`); continue; }
    if (n < 1 || n > lines.length) { errs.push(`${rel}: cita ${file}:${n}, linha inexistente`); continue; }
    const line = lines[n - 1];
    const s = snippet.trim();
    const okFull = s === line.trim();
    const okPart = s.replace(/\s/g, '').length >= 6 && line.includes(s);
    if (!okFull && !okPart) errs.push(`${rel}: cita ${file}:${n}, o trecho não está nessa linha`);
  }
  return errs;
}

export function nakedRefErrors(rel, text) {
  const errs = [];
  const isFile = (f) => f.includes('/') || f.includes('.');
  for (const m of text.matchAll(NAKED_RE)) {
    const after = text.slice(m.index + m[0].length);
    if (/^\s*`/.test(after)) continue; // é a primeira metade de uma citação completa
    const file = m[1].replace(/\\/g, '/');
    if (file.includes('://')) continue; // um endereço com porta, não uma citação
    if (!isFile(file)) continue;
    const lines = linesOf(file);
    const n = Number(m[2]);
    if (!lines) { errs.push(`${rel}: referência ${file}:${n}, arquivo inexistente`); continue; }
    if (n < 1 || n > lines.length) errs.push(`${rel}: referência ${file}:${n}, linha inexistente`);
  }
  return errs;
}

export function stripCode(text) {
  return text.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`\n]*`/g, ' ');
}

export function forbiddenWordsIn(text) {
  const plain = stripCode(text).toLowerCase();
  return cfg.palavrasProibidas.filter((w) => {
    const esc = w.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^\\p{L}])${esc}($|[^\\p{L}])`, 'u').test(plain);
  });
}

// ---------- registros ----------

export function listAuditFiles(exts = ['.md']) {
  const dir = path.join(ROOT, 'auditoria');
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const rec = (d) => {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) rec(p);
      else if (exts.some((e) => ent.name.endsWith(e))) out.push(toRel(p));
    }
  };
  rec(dir);
  out.sort();
  return out;
}

// Blocos `## <ID> — <nome>` com campos `- **Campo:** valor` (ou subitens).
export function parseItems(text, idPrefix) {
  const items = [];
  const re = new RegExp(`^## (${idPrefix}-[A-Za-z0-9._-]+)(?: —\\s*(.*))?$`, 'gm');
  const heads = [...text.matchAll(re)];
  for (let i = 0; i < heads.length; i++) {
    const start = heads[i].index;
    const end = i + 1 < heads.length ? heads[i + 1].index : text.length;
    const body = text.slice(start, end);
    const fields = {};
    const fre = /^- \*\*([^:*]+):\*\*\s*(.*)$/gm;
    for (const f of body.matchAll(fre)) {
      const name = f[1].trim();
      if (!(name in fields)) fields[name] = [];
      fields[name].push(f[2].trim());
    }
    items.push({ id: heads[i][1], title: heads[i][2] || '', body, fields });
  }
  return items;
}

export function collectIds() {
  const ids = new Set();
  const add = (t, p) => { for (const m of (t || '').matchAll(new RegExp(`\\b${p}-[A-Za-z0-9._-]+`, 'g'))) ids.add(m[0]); };
  for (const f of listAuditFiles(['.md'])) {
    const t = readText(f);
    add(t, 'EST'); add(t, 'ENT'); add(t, 'TRC'); add(t, 'DEF');
    add(t, 'MED'); add(t, 'REQ'); add(t, 'GRE'); add(t, 'GRL');
    add(t, 'DCS'); add(t, 'OTM'); add(t, 'EXC');
  }
  return ids;
}

export function idRefErrors(rel, text, known) {
  const errs = [];
  const plain = stripCode(text);
  const re = /\b(ENT|EST|TRC|DEF|MED|REQ|GRE|GRL)-[A-Za-z0-9._-]+/g;
  for (const m of plain.matchAll(re)) {
    // O que segue o id não faz parte dele: a extensão de um arquivo, o ponto da frase e uma faixa de ids.
    const id = m[0].replace(/\.md$/, '').replace(/\.+$/, '');
    if (id.includes('..')) continue;
    if (!known.has(id)) errs.push(`${rel}: referencia a id inexistente ${id}`);
  }
  return errs;
}

// ---------- fluxos, matriz e junção ----------

export function flowFiles() {
  const out = [];
  for (const d of ['fluxos', 'fluxos/trechos']) {
    const dir = path.join(ROOT, 'auditoria', d);
    if (!fs.existsSync(dir)) continue;
    // Os PROCEDIMENTO*.md descrevem o trabalho; não são registros de fluxo.
    for (const e of fs.readdirSync(dir)) if (e.endsWith('.md') && !e.startsWith('PROCEDIMENTO')) out.push(`auditoria/${d}/${e}`);
  }
  out.sort();
  return out;
}

export function marksOf(text) {
  const writes = [];
  const reads = [];
  for (const m of text.matchAll(/\[(lê|escreve):\s*(EST-[A-Za-z0-9._-]+)\s+via\s+([^\]]+)\]/g)) {
    const rec = { est: m[2], fn: m[3].trim() };
    if (m[1] === 'escreve') writes.push(rec); else reads.push(rec);
  }
  return { writes, reads };
}

export function computeMatrix() {
  const mat = new Map();
  const ensure = (e) => { if (!mat.has(e)) mat.set(e, { writers: new Map(), readers: new Map() }); return mat.get(e); };
  for (const f of flowFiles()) {
    const t = readText(f) || '';
    const id = path.basename(f).replace(/\.md$/, '');
    const { writes, reads } = marksOf(t);
    for (const w of writes) { const e = ensure(w.est); if (!e.writers.has(w.fn)) e.writers.set(w.fn, new Set()); e.writers.get(w.fn).add(id); }
    for (const r of reads) { const e = ensure(r.est); if (!e.readers.has(r.fn)) e.readers.set(r.fn, new Set()); e.readers.get(r.fn).add(id); }
  }
  return mat;
}

export function manifestCommandIds() {
  const dir = path.join(ROOT, 'manifest', 'commands');
  const ids = [];
  if (!fs.existsSync(dir)) return ids;
  for (const e of fs.readdirSync(dir)) {
    if (!e.endsWith('.json')) continue;
    const j = JSON.parse(readText('manifest/commands/' + e) || '{}');
    const list = Array.isArray(j) ? j : (j.commands || []);
    for (const c of list) if (c && c.id) ids.push(c.id);
  }
  return ids;
}

// Os blocos `### \`caminho\`` de auditoria/inventario/L*.md, um por arquivo, com as partes de
// cada arquivo unidas quando lotes diferentes leram metades dele (L14a e L14b, L15a e L15b).
export function inventarioBlocks() {
  const dir = path.join(ROOT, 'auditoria', 'inventario');
  if (!fs.existsSync(dir)) return null;
  const held = new Map();
  const order = [];
  for (const e of fs.readdirSync(dir).filter((x) => /^L\d+[a-z]?\.md$/.test(x)).sort()) {
    const text = readText('auditoria/inventario/' + e) || '';
    const heads = [...text.matchAll(/^### `([^`]+)`\s*$/gm)];
    for (let i = 0; i < heads.length; i++) {
      const start = heads[i].index;
      const end = i + 1 < heads.length ? heads[i + 1].index : text.length;
      const block = text.slice(start, end).trimEnd();
      const p = heads[i][1];
      const field = (name) => {
        const m = block.match(new RegExp(`^- \\*\\*${name}:\\*\\*\\s*(.*)$`, 'm'));
        return m ? m[1].trim() : null;
      };
      const ranges = [...(field('Partes lidas') || '').matchAll(/(\d+)\s*-\s*(\d+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
      if (!held.has(p)) {
        held.set(p, { path: p, text: block, lote: field('Lote'), linhas: field('Linhas'), sha1: field('SHA1'), proposito: field('Propósito'), ranges: [...ranges] });
        order.push(p);
      } else {
        held.get(p).ranges.push(...ranges);
      }
    }
  }
  for (const entry of held.values()) {
    const merged = [...entry.ranges].sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(([a, b]) => `${a}-${b}`).join('; ');
    entry.text = entry.text.replace(/^- \*\*Partes lidas:\*\*.*$/m, `- **Partes lidas:** ${merged}`);
  }
  return { held, order };
}

export function mergeInventario() {
  const blocks = inventarioBlocks();
  if (blocks === null) return null;
  const { held, order } = blocks;
  const stackDir = path.join(ROOT, 'auditoria', 'inventario');
  const stack = fs.existsSync(stackDir)
    ? fs.readdirSync(stackDir).filter((e) => e.startsWith('stack') && e.endsWith('.md')).sort()
        .map((e) => (readText('auditoria/inventario/' + e) || '').trim()).filter((t) => t !== '').join('\n\n')
    : '';
  let out = '# Inventário de arquivos\n\n' + stack + '\n\n## Arquivos\n\n';
  for (const p of [...order].sort()) out += held.get(p).text + '\n\n';
  return out.trimEnd() + '\n';
}

export function lineCosts(rel, info) {
  const text = readText(rel);
  if (text === null) return null;
  const lines = text.split('\n');
  const prefix = [0];
  for (let i = 0; i < info.l; i++) prefix.push(prefix[i] + (lines[i] || '').length + 8);
  return prefix;
}

export function rangeCost(prefix, a, b) {
  return prefix[b] - prefix[a - 1];
}
