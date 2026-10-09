// The interface's own face (Source Sans 3, src/ui/fonts/), read from the TrueType file — cmap, hmtx, the kern table
// and GPOS — so the width of an editor label is computed in Node, without a browser (the investigation's C4, option A).
// The proof of the arithmetic is auditoria/investigacao/poc/c4-texto/medir.mjs and its resultados.txt: with the GPOS
// kerning the width differs from what Chrome draws by at most 0,015 px over the 6229 messages of both catalogues.
// tools/ui-fit/check.ts is the check that rests on it.
import fs from 'node:fs';

export type Weight = 400 | 600;

// The two faces the interface loads (src/ui/tokens.css, @font-face): regular (400) and semibold (600).
export const UI_FONTS: Readonly<Record<Weight, string>> = {
  400: 'src/ui/fonts/SourceSans3-Regular.ttf',
  600: 'src/ui/fonts/SourceSans3-Semibold.ttf',
};

export interface Font {
  readonly unitsPerEm: number;
  // the advance of each glyph, in font units, by glyph id
  readonly advances: readonly number[];
  // code point → glyph id (0, the missing glyph, when the face has none)
  readonly glyphOf: (codePoint: number) => number;
  // the kerning of a pair, in font units, from the kern table when the face has one
  readonly kernOf: (left: number, right: number) => number;
  // the pair adjustment of the GPOS 'kern' features, in font units (0 when the face has none)
  readonly pairAdjust: (left: number, right: number) => number;
}

type Buffer_ = Buffer;

function tableOffsets(b: Buffer_): Map<string, number> {
  const out = new Map<string, number>();
  const count = b.readUInt16BE(4);
  for (let i = 0; i < count; i++) {
    const at = 12 + 16 * i;
    out.set(b.toString('ascii', at, at + 4), b.readUInt32BE(at + 8));
  }
  return out;
}

// The cmap subtables the face carries: the Windows Unicode one (3,10 format 12, or 3,1 format 4).
function glyphMap(b: Buffer_, cmap: number): Map<number, number> {
  const glyph = new Map<number, number>();
  const subtables: { platform: number; encoding: number; at: number }[] = [];
  const count = b.readUInt16BE(cmap + 2);
  for (let i = 0; i < count; i++) {
    const at = cmap + 4 + 8 * i;
    subtables.push({ platform: b.readUInt16BE(at), encoding: b.readUInt16BE(at + 2), at: cmap + b.readUInt32BE(at + 4) });
  }
  const s12 = subtables.find((s) => s.platform === 3 && s.encoding === 10 && b.readUInt16BE(s.at) === 12);
  const s4 = subtables.find((s) => s.platform === 3 && s.encoding === 1 && b.readUInt16BE(s.at) === 4);
  if (s12 !== undefined) {
    const groups = b.readUInt32BE(s12.at + 12);
    for (let i = 0; i < groups; i++) {
      const at = s12.at + 16 + 12 * i;
      const first = b.readUInt32BE(at);
      const last = b.readUInt32BE(at + 4);
      const g0 = b.readUInt32BE(at + 8);
      for (let c = first; c <= last; c++) glyph.set(c, g0 + c - first);
    }
  } else if (s4 !== undefined) {
    const o = s4.at;
    const segments = b.readUInt16BE(o + 6) / 2;
    const ends = o + 14;
    const starts = ends + 2 * segments + 2;
    const deltas = starts + 2 * segments;
    const offsets = deltas + 2 * segments;
    for (let i = 0; i < segments; i++) {
      const end = b.readUInt16BE(ends + 2 * i);
      const start = b.readUInt16BE(starts + 2 * i);
      const delta = b.readInt16BE(deltas + 2 * i);
      const offset = b.readUInt16BE(offsets + 2 * i);
      for (let c = start; c <= end && c !== 0xffff; c++) {
        let g: number;
        if (offset === 0) g = (c + delta) & 0xffff;
        else {
          const at = offsets + 2 * i + offset + 2 * (c - start);
          g = b.readUInt16BE(at);
          if (g !== 0) g = (g + delta) & 0xffff;
        }
        glyph.set(c, g);
      }
    }
  }
  return glyph;
}

// The kern table, version 0, format 0 subtables (ordered pairs), horizontal.
function kernTable(b: Buffer_, base: number): Map<number, number> {
  const kern = new Map<number, number>();
  let o = base;
  const count = b.readUInt16BE(o + 2);
  o += 4;
  for (let t = 0; t < count; t++) {
    const length = b.readUInt16BE(o + 2);
    const coverage = b.readUInt16BE(o + 4);
    if (coverage >> 8 === 0 && (coverage & 1) === 1) {
      const pairs = b.readUInt16BE(o + 6);
      for (let p = 0; p < pairs; p++) {
        const q = o + 14 + 6 * p;
        kern.set(b.readUInt16BE(q) * 65536 + b.readUInt16BE(q + 2), b.readInt16BE(q + 4));
      }
    }
    o += length;
  }
  return kern;
}

// GPOS: the pair-adjustment lookups (type 2, or type 9 wrapping them) of the 'kern' features of every script; the
// adjustment is the X advance of the first glyph. Formats 1 (pairs by glyph) and 2 (pairs by class).
function gposPairs(b: Buffer_, base: number): (left: number, right: number) => number {
  const u16 = (o: number) => b.readUInt16BE(o);
  const i16 = (o: number) => b.readInt16BE(o);
  const features = base + u16(base + 6);
  const lookups = base + u16(base + 8);
  const wanted = new Set<number>();
  for (let i = 0; i < u16(features); i++) {
    const record = features + 2 + 6 * i;
    if (b.toString('ascii', record, record + 4) !== 'kern') continue;
    const f = features + u16(record + 4);
    for (let k = 0; k < u16(f + 2); k++) wanted.add(u16(f + 4 + 2 * k));
  }
  const coverage = (o: number): Map<number, number> => {
    const map = new Map<number, number>();
    if (u16(o) === 1) for (let i = 0; i < u16(o + 2); i++) map.set(u16(o + 4 + 2 * i), i);
    else
      for (let i = 0; i < u16(o + 2); i++) {
        const r = o + 4 + 6 * i;
        for (let g = u16(r); g <= u16(r + 2); g++) map.set(g, u16(r + 4) + g - u16(r));
      }
    return map;
  };
  const classes = (o: number): Map<number, number> => {
    const map = new Map<number, number>();
    if (u16(o) === 1) for (let i = 0; i < u16(o + 4); i++) map.set(u16(o + 2) + i, u16(o + 6 + 2 * i));
    else
      for (let i = 0; i < u16(o + 2); i++) {
        const r = o + 4 + 6 * i;
        for (let g = u16(r); g <= u16(r + 2); g++) map.set(g, u16(r + 4));
      }
    return map;
  };
  const bitCount = (v: number): number => {
    let n = 0;
    for (let x = v; x !== 0; x >>= 1) n += x & 1;
    return n;
  };
  const all: ((left: number, right: number) => number | null)[][] = [];
  for (const index of [...wanted].sort((x, y) => x - y)) {
    const lookup = lookups + u16(lookups + 2 + 2 * index);
    const type = u16(lookup);
    const subtables: ((left: number, right: number) => number | null)[] = [];
    for (let s = 0; s < u16(lookup + 4); s++) {
      let st = lookup + u16(lookup + 6 + 2 * s);
      if (type === 9) {
        if (u16(st + 2) !== 2) continue;
        st += b.readUInt32BE(st + 4);
      } else if (type !== 2) continue;
      const format = u16(st);
      const valueFormat1 = u16(st + 4);
      const valueFormat2 = u16(st + 6);
      const xAdvance = (valueFormat1 & 4) === 0 ? null : 2 * bitCount(valueFormat1 & 3);
      const size1 = 2 * bitCount(valueFormat1);
      const size2 = 2 * bitCount(valueFormat2);
      const cover = coverage(st + u16(st + 2));
      if (format === 1) {
        const sets: number[] = [];
        for (let p = 0; p < u16(st + 8); p++) sets.push(st + u16(st + 10 + 2 * p));
        subtables.push((g1, g2) => {
          const c = cover.get(g1);
          if (c === undefined) return null;
          const set = sets[c];
          if (set === undefined) return null;
          for (let k = 0; k < u16(set); k++) {
            const r = set + 2 + k * (2 + size1 + size2);
            if (u16(r) === g2) return xAdvance === null ? 0 : i16(r + 2 + xAdvance);
          }
          return null;
        });
      } else if (format === 2) {
        const class1 = classes(st + u16(st + 8));
        const class2 = classes(st + u16(st + 10));
        const n2 = u16(st + 14);
        subtables.push((g1, g2) => {
          if (!cover.has(g1)) return null;
          const r = st + 16 + ((class1.get(g1) ?? 0) * n2 + (class2.get(g2) ?? 0)) * (size1 + size2);
          return xAdvance === null ? 0 : i16(r + xAdvance);
        });
      }
    }
    all.push(subtables);
  }
  const memo = new Map<number, number>();
  return (g1, g2) => {
    const key = g1 * 65536 + g2;
    const held = memo.get(key);
    if (held !== undefined) return held;
    let value = 0;
    for (const subtables of all)
      for (const pair of subtables) {
        const adjust = pair(g1, g2);
        if (adjust !== null) {
          value += adjust;
          break;
        }
      }
    memo.set(key, value);
    return value;
  };
}

export function readFont(file: string): Font {
  const b = fs.readFileSync(file);
  const tables = tableOffsets(b);
  const unitsPerEm = b.readUInt16BE((tables.get('head') ?? 0) + 18);
  const metrics = b.readUInt16BE((tables.get('hhea') ?? 0) + 34);
  const advances: number[] = [];
  const hmtx = tables.get('hmtx') ?? 0;
  for (let g = 0; g < metrics; g++) advances.push(b.readUInt16BE(hmtx + 4 * g));
  const glyph = glyphMap(b, tables.get('cmap') ?? 0);
  const kernBase = tables.get('kern');
  const kern = kernBase === undefined ? new Map<number, number>() : kernTable(b, kernBase);
  const gposBase = tables.get('GPOS');
  const pairAdjust = gposBase === undefined ? () => 0 : gposPairs(b, gposBase);
  return {
    unitsPerEm,
    advances,
    glyphOf: (codePoint) => glyph.get(codePoint) ?? 0,
    kernOf: (left, right) => kern.get(left * 65536 + right) ?? 0,
    pairAdjust,
  };
}

// The width of `text` at `size` px: the advances of its glyphs plus the kerning of each adjacent pair, scaled from the
// face's units. `kerning: 'gpos'` (the default) is the pair the browser applies; 'kern' reads the older table; 'none'
// sums the advances alone.
export function textWidth(font: Font, text: string, size: number, kerning: 'gpos' | 'kern' | 'none' = 'gpos'): number {
  let sum = 0;
  let previous: number | null = null;
  for (const ch of text) {
    const g = font.glyphOf(ch.codePointAt(0) ?? 0);
    // a character the face lacks is drawn by the browser from a fallback face, never as the face's .notdef: it is
    // counted 1 em, the width of the full-width marks the pseudo-expansion writes (【】), on the safe side (DEF-0573)
    if (g === 0) {
      sum += font.unitsPerEm;
      previous = null;
      continue;
    }
    sum += font.advances[Math.min(g, font.advances.length - 1)] ?? 0;
    if (previous !== null) {
      if (kerning === 'gpos') sum += font.pairAdjust(previous, g);
      else if (kerning === 'kern') sum += font.kernOf(previous, g);
    }
    previous = g;
  }
  return (sum * size) / font.unitsPerEm;
}

const cache = new Map<Weight, Font>();
export function uiFont(weight: Weight): Font {
  const held = cache.get(weight);
  if (held !== undefined) return held;
  const font = readFont(UI_FONTS[weight]);
  cache.set(weight, font);
  return font;
}
