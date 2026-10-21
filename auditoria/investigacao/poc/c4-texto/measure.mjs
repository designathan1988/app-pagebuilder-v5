// Proof of concept C4: interface text width computed in Node by reading the font file (TrueType: cmap, hmtx and the
// kern table), compared with the width Chrome draws (getBoundingClientRect of a span), for every message in
// src/i18n/locales/pt-BR.json and en.json, at the sizes and weights of the tokens in src/ui/tokens.css.
// No new package: the font reader is this file; Chrome comes from the installed @playwright/test.
// Usage: node auditoria/investigacao/poc/c4-texto/measure.mjs
import console from 'node:console';
import { performance } from 'node:perf_hooks';
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const OUTPUT = 'auditoria/investigacao/poc/c4-texto/resultados.txt';
const FONTS = { 400: 'C:/Windows/Fonts/segoeui.ttf', 600: 'C:/Windows/Fonts/seguisb.ttf' };
// the size and weight pairs of the tokens (--fs-caption 11/400, --fs-body 12/400, --fs-label 12/600, --fs-title 13/600, --fs-input 15/400)
const SETTINGS = [[11, 400], [12, 400], [12, 600], [13, 600], [15, 400]];

// ---------------------------------------------------------------- TrueType reader
function readFont(file) {
  const b = fs.readFileSync(file);
  const tables = {};
  for (let i = 0; i < b.readUInt16BE(4); i++) {
    const o = 12 + 16 * i;
    tables[b.toString('ascii', o, o + 4)] = b.readUInt32BE(o + 8);
  }
  const unitsPerEm = b.readUInt16BE(tables.head + 18);
  const metrics = b.readUInt16BE(tables.hhea + 34);
  const advances = [];
  for (let g = 0; g < metrics; g++) advances.push(b.readUInt16BE(tables.hmtx + 4 * g));
  // cmap: the Windows Unicode subtable (3,10 format 12, or 3,1 format 4)
  const glyph = new Map();
  const cmap = tables.cmap;
  const subtables = [];
  for (let i = 0; i < b.readUInt16BE(cmap + 2); i++) {
    const o = cmap + 4 + 8 * i;
    subtables.push({ platform: b.readUInt16BE(o), encoding: b.readUInt16BE(o + 2), start: cmap + b.readUInt32BE(o + 4) });
  }
  const s12 = subtables.find((s) => s.platform === 3 && s.encoding === 10 && b.readUInt16BE(s.start) === 12);
  const s4 = subtables.find((s) => s.platform === 3 && s.encoding === 1 && b.readUInt16BE(s.start) === 4);
  if (s12 !== undefined) {
    const n = b.readUInt32BE(s12.start + 12);
    for (let i = 0; i < n; i++) {
      const o = s12.start + 16 + 12 * i;
      const first = b.readUInt32BE(o);
      const last = b.readUInt32BE(o + 4);
      const g0 = b.readUInt32BE(o + 8);
      for (let c = first; c <= last; c++) glyph.set(c, g0 + c - first);
    }
  } else if (s4 !== undefined) {
    const o = s4.start;
    const segs = b.readUInt16BE(o + 6) / 2;
    const ends = o + 14;
    const starts = ends + 2 * segs + 2;
    const deltas = starts + 2 * segs;
    const offs = deltas + 2 * segs;
    for (let i = 0; i < segs; i++) {
      const last = b.readUInt16BE(ends + 2 * i);
      const first = b.readUInt16BE(starts + 2 * i);
      const delta = b.readInt16BE(deltas + 2 * i);
      const off = b.readUInt16BE(offs + 2 * i);
      for (let c = first; c <= last && c !== 0xffff; c++) {
        let g;
        if (off === 0) g = (c + delta) & 0xffff;
        else {
          const at = offs + 2 * i + off + 2 * (c - first);
          g = b.readUInt16BE(at);
          if (g !== 0) g = (g + delta) & 0xffff;
        }
        glyph.set(c, g);
      }
    }
  }
  // kern version 0, format 0 subtables (sorted pairs), horizontal
  const kern = new Map();
  if (tables.kern !== undefined) {
    let o = tables.kern;
    const n = b.readUInt16BE(o + 2);
    o += 4;
    for (let t = 0; t < n; t++) {
      const length = b.readUInt16BE(o + 2);
      const coverage = b.readUInt16BE(o + 4);
      if ((coverage >> 8) === 0 && (coverage & 1) === 1) {
        const pairs = b.readUInt16BE(o + 6);
        for (let p = 0; p < pairs; p++) {
          const q = o + 14 + 6 * p;
          kern.set(b.readUInt16BE(q) * 65536 + b.readUInt16BE(q + 2), b.readInt16BE(q + 4));
        }
      }
      o += length;
    }
  }
  return { unitsPerEm, advances, glyph, kern, gpos: tables.GPOS === undefined ? null : readGpos(b, tables.GPOS) };
}

// GPOS: the pair adjustment lookups (type 2, or type 9 that wraps it) of the 'kern' features of every script; the
// adjustment is the XAdvance of the first glyph. Formats 1 (pairs per glyph) and 2 (pairs per class).
function readGpos(b, base) {
  const u16 = (o) => b.readUInt16BE(o);
  const i16 = (o) => b.readInt16BE(o);
  const featureList = base + u16(base + 6);
  const lookupList = base + u16(base + 8);
  const indices = new Set();
  for (let i = 0; i < u16(featureList); i++) {
    const r = featureList + 2 + 6 * i;
    if (b.toString('ascii', r, r + 4) !== 'kern') continue;
    const f = featureList + u16(r + 4);
    for (let k = 0; k < u16(f + 2); k++) indices.add(u16(f + 4 + 2 * k));
  }
  const coverage = (o) => {
    const map = new Map();
    if (u16(o) === 1) for (let i = 0; i < u16(o + 2); i++) map.set(u16(o + 4 + 2 * i), i);
    else for (let i = 0; i < u16(o + 2); i++) {
      const r = o + 4 + 6 * i;
      for (let g = u16(r); g <= u16(r + 2); g++) map.set(g, u16(r + 4) + g - u16(r));
    }
    return map;
  };
  const classes = (o) => {
    const map = new Map();
    if (u16(o) === 1) for (let i = 0; i < u16(o + 4); i++) map.set(u16(o + 2) + i, u16(o + 6 + 2 * i));
    else for (let i = 0; i < u16(o + 2); i++) {
      const r = o + 4 + 6 * i;
      for (let g = u16(r); g <= u16(r + 2); g++) map.set(g, u16(r + 4));
    }
    return map;
  };
  const bits = (v) => { let n = 0; for (let x = v; x !== 0; x >>= 1) n += x & 1; return n; };
  const lookups = [];
  for (const index of [...indices].sort((x, y) => x - y)) {
    const l = lookupList + u16(lookupList + 2 + 2 * index);
    const type = u16(l);
    const subtables = [];
    for (let s = 0; s < u16(l + 4); s++) {
      let st = l + u16(l + 6 + 2 * s);
      if (type === 9) { if (u16(st + 2) !== 2) continue; st += b.readUInt32BE(st + 4); } else if (type !== 2) continue;
      const format = u16(st);
      const vf1 = u16(st + 4);
      const vf2 = u16(st + 6);
      const xAdv = (vf1 & 4) === 0 ? null : 2 * bits(vf1 & 3);
      const size1 = 2 * bits(vf1);
      const size2 = 2 * bits(vf2);
      const cov = coverage(st + u16(st + 2));
      if (format === 1) {
        const sets = [];
        for (let p = 0; p < u16(st + 8); p++) sets.push(st + u16(st + 10 + 2 * p));
        subtables.push((g1, g2) => {
          const c = cov.get(g1);
          if (c === undefined) return null;
          const ps = sets[c];
          for (let k = 0; k < u16(ps); k++) {
            const r = ps + 2 + k * (2 + size1 + size2);
            if (u16(r) === g2) return xAdv === null ? 0 : i16(r + 2 + xAdv);
          }
          return null;
        });
      } else if (format === 2) {
        const cd1 = classes(st + u16(st + 8));
        const cd2 = classes(st + u16(st + 10));
        const n2 = u16(st + 14);
        subtables.push((g1, g2) => {
          if (!cov.has(g1)) return null;
          const r = st + 16 + ((cd1.get(g1) ?? 0) * n2 + (cd2.get(g2) ?? 0)) * (size1 + size2);
          return xAdv === null ? 0 : i16(r + xAdv);
        });
      }
    }
    lookups.push(subtables);
  }
  const memo = new Map();
  return (g1, g2) => {
    const key = g1 * 65536 + g2;
    let v = memo.get(key);
    if (v === undefined) {
      v = 0;
      for (const subtables of lookups) for (const st of subtables) { const a = st(g1, g2); if (a !== null) { v += a; break; } }
      memo.set(key, v);
    }
    return v;
  };
}

function width(font, text, size, kerning) {
  let sum = 0;
  let previous = null;
  for (const ch of text) {
    const g = font.glyph.get(ch.codePointAt(0)) ?? 0;
    sum += font.advances[Math.min(g, font.advances.length - 1)];
    if (kerning === 'kern' && previous !== null) sum += font.kern.get(previous * 65536 + g) ?? 0;
    if (kerning === 'gpos' && previous !== null && font.gpos !== null) sum += font.gpos(previous, g);
    previous = g;
  }
  return (sum * size) / font.unitsPerEm;
}

// ---------------------------------------------------------------- texts
const flatten = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (typeof v === 'string' ? [v] : flatten(v, `${p}${k}.`)));
const texts = [...new Set([...flatten(JSON.parse(fs.readFileSync('src/i18n/locales/pt-BR.json', 'utf8'))), ...flatten(JSON.parse(fs.readFileSync('src/i18n/locales/en.json', 'utf8')))])].filter((t) => t.length > 0 && !t.includes('\n'));

const fonts = { 400: readFont(FONTS[400]), 600: readFont(FONTS[600]) };
const t0 = performance.now();
const computed = SETTINGS.map(([size, weight]) => texts.map((t) => [width(fonts[weight], t, size, null), width(fonts[weight], t, size, 'kern'), width(fonts[weight], t, size, 'gpos')]));
const msNode = performance.now() - t0;

// ---------------------------------------------------------------- Chrome
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
await page.setContent('<!doctype html><html><body></body></html>');
const t1 = performance.now();
const measured = await page.evaluate(({ texts, settings }) => settings.map(([size, weight]) => {
  const root = globalThis.document.createElement('div');
  globalThis.document.body.append(root);
  const spans = texts.map((t) => {
    const s = globalThis.document.createElement('span');
    s.style.cssText = `font-family:"Segoe UI Variable Text","Segoe UI",system-ui,sans-serif;font-size:${size}px;font-weight:${weight};white-space:pre;position:absolute;left:0;top:0`;
    s.textContent = t;
    root.append(s);
    return s;
  });
  const widths = spans.map((s) => s.getBoundingClientRect().width);
  root.remove();
  return widths;
}), { texts, settings: SETTINGS });
const msChrome = performance.now() - t1;
await browser.close();

// ---------------------------------------------------------------- comparison
const lines = [`distinct texts: ${texts.length}`, `Node, computing ${texts.length * SETTINGS.length * 3} widths: ${msNode.toFixed(0)} ms`, `Chrome, measuring ${texts.length * SETTINGS.length} widths: ${msChrome.toFixed(0)} ms`, ''];
const percentile = (v, p) => [...v].sort((a, b) => a - b)[Math.min(v.length - 1, Math.floor(p * v.length))];
for (const [k, [size, weight]] of SETTINGS.entries()) {
  for (const [mode, index] of [['no kerning', 0], ['kern table', 1], ['GPOS kern', 2]]) {
    const errors = texts.map((_, i) => computed[k][i][index] - measured[k][i]);
    const abs = errors.map(Math.abs);
    const rel = texts.map((_, i) => abs[i] / Math.max(1, measured[k][i]));
    const within = (lim) => ((100 * abs.filter((e) => e <= lim).length) / abs.length).toFixed(1);
    const worst = abs.indexOf(Math.max(...abs));
    lines.push(`${size}px weight ${weight}, ${mode}: median |error| ${percentile(abs, 0.5).toFixed(3)} px, p95 ${percentile(abs, 0.95).toFixed(3)} px, max ${abs[worst].toFixed(3)} px (relative p95 ${(100 * percentile(rel, 0.95)).toFixed(2)}%); up to 0.5 px: ${within(0.5)}%; up to 1 px: ${within(1)}%; up to 2 px: ${within(2)}%; mean signed error ${(errors.reduce((a, b) => a + b, 0) / errors.length).toFixed(3)} px; worst text has ${texts[worst].length} characters`);
  }
}
fs.writeFileSync(OUTPUT, `${lines.join('\n')}\n`);
console.log(lines.join('\n'));
