/* global process, console */
// Repositions the audit's citations after a code edit, using the exact diff between the base version of each cited file
// (.cache/audit/base/<path>, written by the previous run) and the current version: the citation `file:N` whose line N in
// the base held the snippet moves to the line that corresponds to N in the current version (longest common subsequence,
// after removing the identical head and tail). When the cited line itself changed, or the file has no base, a citation
// that does not match moves to the occurrence of the snippet nearest the old line and is listed for review; a citation
// whose snippet no longer exists stays as it is and is listed: it needs re-tracing, not a new number.
// The snippet check is the lock's (the whole snippet equal to the line, or contained in it with 6 or more
// non-whitespace characters). At the end, the base becomes the current version of each cited file.
// Usage: node tools/audit/recite.mjs [--dry-run]
// First use, or after an edit made without a base: write the base before editing with --base-only.
// Summary on the output (at most 30 lines); the full list in .cache/audit/recite.json.
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const dry = args.includes('--dry-run');
const baseOnly = args.includes('--base-only');
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

// old line (1-based) → new line, for the lines that are equal in both versions
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
        lost.push({ record: rel, citation: `${name}:${old}`, snippet: snippet.slice(0, 120) });
        return whole;
      }
      nearest += 1;
      review.push({ record: rel, citation: `${name}:${old}`, to: best + 1, snippet: snippet.slice(0, 120) });
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
fs.writeFileSync('.cache/audit/recite.json', `${JSON.stringify({ exact, nearest, touched, review, lost }, null, 2)}\n`);
const lines = [`${dry ? '(dry run) ' : ''}${baseOnly ? 'base written' : `citations repositioned by the diff: ${exact}; by the nearest occurrence (to review): ${nearest}; in ${touched} records; snippets that no longer exist: ${lost.length}`}; cited files: ${files.size}`];
for (const r of review.slice(0, 12)) lines.push(`  review ${r.record}: ${r.citation} → ${r.to} \`${r.snippet.slice(0, 60)}\``);
for (const l of lost.slice(0, 12)) lines.push(`  lost ${l.record}: ${l.citation} \`${l.snippet.slice(0, 60)}\``);
if (review.length + lost.length > 24) lines.push(`  ... full list in .cache/audit/recite.json`);
console.log(lines.slice(0, 30).join('\n'));
