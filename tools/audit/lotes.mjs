/* global process, console */
// Fase 2: divide o escopo da vistoria nos lotes do plano (auditoria/plano-execucao.md, B.2)
// e grava auditoria/lotes/<lote>.md com, por arquivo, linhas, SHA1 e a lista de leituras
// (offset, limit) cujo custo cabe no alvo. Recusa arquivo sem lote ou em dois lotes.
// Uso: node tools/audit/lotes.mjs
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, cfg, scopeFiles, fileInfo, readText } from './lib.mjs';

const AUD = path.join(ROOT, 'auditoria');
const TARGET = Math.min(50000, cfg.limiteLeituraCaracteres);

const SPLIT = {
  'manifest/features/04-inspector.json': ['L14a', 'L14b'],
  'manifest/features/07-elements.json': ['L15a', 'L15b'],
};

const EXACT = {
  'src/main.tsx': 'L05a',
  'src/env.d.ts': 'L05a',
};

const CMD_L11B = new Set(['style.json', 'structure.json', 'text.json', 'view.json', 'workspace.json', 'selection.json']);
const MANIFEST_L12 = new Set(['checks.json', 'consumers.json', 'css-exclusions.json', 'elements.json', 'environment.json', 'interactions.json', 'layout.json', 'properties.json', 'references.json']);

function featureLote(base) {
  if (base === '02-structure-editing.json') return 'L13a';
  if (base === '24-motion.json') return 'L18b';
  if (base === '25-content.json') return 'L18c';
  if (/^0[1356]-/.test(base)) return 'L13b';
  if (/^0[89]-|^1[012]-/.test(base)) return 'L16';
  if (/^1[3456]-/.test(base)) return 'L17a';
  if (/^1[789]-|^2[012]-/.test(base)) return 'L17b';
  if (/^23-|^26-/.test(base)) return 'L18a';
  return null;
}

function e2eLote(rest) {
  const c = rest[0];
  if (c >= 'a' && c <= 'h') return 'L20a';
  if (c >= 'i' && c <= 'p') return 'L20b';
  if (c >= 'q' && c <= 'z') return 'L20c';
  return null;
}

function loteOf(rel) {
  if (SPLIT[rel]) return SPLIT[rel];
  if (EXACT[rel]) return EXACT[rel];
  if (rel === 'src/app/' || rel.startsWith('src/app/')) return 'L05a';
  if (rel.startsWith('src/config/')) return 'L05a';
  if (rel.startsWith('src/core/')) {
    const rest = rel.slice('src/core/'.length);
    const seg = rest.split('/')[0];
    if (rest.includes('/')) {
      const map = {
        store: 'L01', history: 'L01', commands: 'L01', ports: 'L01', document: 'L01', a11y: 'L01', testing: 'L01',
        selection: 'L02', structure: 'L02', nodes: 'L02', text: 'L02', geometry: 'L02', page: 'L02', project: 'L02', files: 'L02', clipboard: 'L02',
        style: 'L03', design: 'L03', elements: 'L03', forms: 'L03',
        render: 'L04a', export: 'L04a', import: 'L04a', capture: 'L04a',
        data: 'L04b', animation: 'L04b', events: 'L04b', motion: 'L04b',
      };
      if (map[seg]) return map[seg];
      return null;
    }
    return 'L01';
  }
  if (rel.startsWith('src/editor/')) {
    const rest = rel.slice('src/editor/'.length);
    const seg = rest.split('/')[0];
    if (!rest.includes('/')) {
      if (/^(store|state|wiring)/.test(seg)) return 'L05a';
      return 'L05b';
    }
    const map = {
      input: 'L05a', persistence: 'L05a',
      doors: 'L05b', drag: 'L05b', focus: 'L05b', menus: 'L05b', 'command-bar': 'L05b', preferences: 'L05b', project: 'L05b',
      inspector: 'L06', forms: 'L06', 'quick-panel': 'L06', checks: 'L06', layers: 'L06', palette: 'L06', explorer: 'L06', 'code-panel': 'L06', data: 'L06', import: 'L06', capture: 'L06', assistant: 'L06',
      canvas: 'L07', view: 'L07', workspace: 'L07', timeline: 'L07',
      motion: 'L08',
    };
    if (seg === 'shell') {
      const dentro = rest.slice('shell/'.length);
      if (dentro.startsWith('sidebar/')) return 'L09b';
      return dentro[0] >= 'l' ? 'L09b' : 'L09a';
    }
    if (map[seg]) return map[seg];
    return 'L05b';
  }
  if (rel.startsWith('src/modules/')) return 'L10a';
  if (rel.startsWith('src/manifest/')) return 'L10b';
  if (rel.startsWith('src/ui/')) return 'L10b';
  if (rel.startsWith('src/i18n/')) return 'L10c';
  if (rel.startsWith('manifest/commands/')) {
    const base = rel.slice('manifest/commands/'.length);
    return CMD_L11B.has(base) ? 'L11b' : 'L11a';
  }
  if (rel.startsWith('manifest/features/fixtures/')) return 'L19';
  if (rel.startsWith('manifest/features/')) {
    const base = rel.slice('manifest/features/'.length);
    if (base.includes('/')) return 'L19';
    return featureLote(base);
  }
  if (rel.includes('/') === false) return 'L22b';
  if (rel.startsWith('manifest/')) {
    const base = rel.slice('manifest/'.length);
    if (!base.includes('/') && MANIFEST_L12.has(base)) return 'L12';
  }
  if (rel.startsWith('tests/e2e/')) {
    const rest = rel.slice('tests/e2e/'.length);
    if (!rest.includes('/')) return e2eLote(rest);
    return null;
  }
  if (rel.startsWith('tests/support/') || rel.startsWith('tests/perf/')) return 'L21';
  if (rel.startsWith('tools/')) return 'L22a';
  if (rel.startsWith('companion/')) return 'L22b';
  return null;
}

function readsFor(rel) {
  const info = fileInfo(rel);
  const text = readText(rel);
  const lines = text === null ? [] : text.split('\n');
  const parts = [];
  let start = 1;
  let acc = 0;
  for (let i = 1; i <= info.l; i++) {
    const c = (lines[i - 1] || '').length + 8;
    if (acc > 0 && acc + c > TARGET) { parts.push([start, i - 1]); start = i; acc = 0; }
    acc += c;
  }
  if (info.l >= start) parts.push([start, info.l]);
  return parts;
}

const scope = scopeFiles();
const byLote = new Map();
const problems = [];
for (const f of scope) {
  const l = loteOf(f);
  if (!l) { problems.push(`sem lote: ${f}`); continue; }
  const lotes = Array.isArray(l) ? l : [l];
  for (const nome of lotes) {
    if (!byLote.has(nome)) byLote.set(nome, []);
    byLote.get(nome).push(f);
  }
}
const seen = new Map();
for (const [nome, files] of byLote) {
  for (const f of files) {
    if (SPLIT[f]) continue;
    if (seen.has(f)) problems.push(`em dois lotes: ${f} (${seen.get(f)}, ${nome})`);
    seen.set(f, nome);
  }
}

const outDir = path.join(AUD, 'lotes');
fs.mkdirSync(outDir, { recursive: true });
const resumo = [];
for (const [nome, files] of [...byLote.entries()].sort()) {
  const uniq = [...new Set(files)].sort();
  let totalLinhas = 0;
  let out = `# Lote ${nome}\n\nArquivos: ${uniq.length}.\n\n`;
  for (const f of uniq) {
    const info = fileInfo(f);
    totalLinhas += info.l;
    let parts = readsFor(f);
    if (SPLIT[f]) {
      const half = Math.ceil(parts.length / 2);
      parts = nome === SPLIT[f][0] ? parts.slice(0, half) : parts.slice(half);
    }
    out += `## \`${f}\`\n`;
    out += `Linhas: ${info.l}. SHA1: ${info.h}\n`;
    out += `Leituras: ${parts.map(([a, b]) => `(${a}, ${b - a + 1})`).join(' ')}\n\n`;
  }
  fs.writeFileSync(path.join(outDir, `${nome}.md`), out);
  resumo.push([nome, uniq.length, totalLinhas]);
}

console.log('lote | arquivos | linhas');
for (const [n, a, l] of resumo) console.log(`${n} | ${a} | ${l}`);
console.log(`TOTAL: ${scope.length} arquivos`);
if (problems.length) {
  for (const p of problems) console.log(`PROBLEMA: ${p}`);
  process.exit(1);
}
