/* global process */
// Audit checker (PROMPT.md, Phase 1). Exits with code 1 if anything is pending.
// Usage: node tools/audit/check.mjs [--until-phase N] [--only C1,C2] [--batch Lxx] [--summary]
//
// The audit records under auditoria/ are written in Portuguese: the field names, section headings and values
// this script looks for (Status, Causa, Passos, aberto, corrigido...) are kept as they appear in those records.
import path from 'node:path';
import {
  ROOT, cfg, scopeFiles, fileInfo, readText, listAuditFiles,
  citationErrors, nakedRefErrors, idRefErrors, forbiddenWordsIn, stripCode,
  parseItems, collectIds, matchAny, lineCosts, rangeCost,
  flowFiles, computeMatrix, manifestCommandIds, mergeInventory, inventoryBlocks,
} from './lib.mjs';
import fs from 'node:fs';

// ---------- arguments ----------

const argv = process.argv.slice(2);
function argVal(flag) {
  const i = argv.indexOf(flag);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : null;
}
const PHASE = argVal('--until-phase') ? Number(argVal('--until-phase')) : 9;
const ONLY = argVal('--only') ? argVal('--only').split(',').map((s) => s.trim()) : null;
const BATCH = argVal('--batch');
const SUMMARY = argv.includes('--summary');

const PHASE_CHECKS = {
  1: ['C2', 'C7'],
  2: ['C1', 'C2', 'C7', 'C9'],
  3: ['C1', 'C2', 'C3', 'C4', 'C7', 'C9'],
  4: ['C1', 'C2', 'C3', 'C4', 'C7', 'C9'],
  5: ['C1', 'C2', 'C3', 'C4', 'C5', 'C7', 'C9'],
  6: ['C1', 'C2', 'C3', 'C4', 'C5', 'C7', 'C9'],
  7: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C9'],
  8: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9'],
  9: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'],
};
const CHECKS = ONLY || PHASE_CHECKS[PHASE] || PHASE_CHECKS[9];
const CROSS = PHASE >= 5 || (ONLY && ONLY.includes('C5'));

const results = [];
function report(id, label, counts, pend) {
  results.push({ id, label, counts, pend });
}

const AUD = path.join(ROOT, 'auditoria');
const auditFiles = listAuditFiles(['.md', '.json', '.mjs']);

// ---------- C1: inventory ----------

function batchFiles() {
  if (!BATCH) return null;
  const p = path.join(AUD, 'lotes', `${BATCH}.md`);
  const text = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
  if (!text) return null;
  const set = new Set();
  for (const m of text.matchAll(/`([^`\n]+?)`/g)) set.add(m[1]);
  return set;
}

function parseInventoryBlocks() {
  const found = inventoryBlocks();
  return found === null ? new Map() : found.held;
}

function covers(ranges, n) {
  if (n <= 0) return true;
  let next = 1;
  for (const [a, b] of [...ranges].sort((p, q) => p[0] - q[0])) {
    if (a > next) return false;
    next = Math.max(next, b + 1);
    if (next > n) return true;
  }
  return next > n;
}

function checkC1() {
  const pend = [];
  const scopeAll = scopeFiles();
  const batchFilter = batchFiles();
  const scope = batchFilter ? scopeAll.filter((f) => batchFilter.has(f)) : scopeAll;
  const blocks = parseInventoryBlocks();
  let inventoried = 0;
  for (const f of scope) {
    const b = blocks.get(f);
    if (!b) { pend.push({ where: f, why: 'file in scope with no block in the inventory' }); continue; }
    const info = fileInfo(f);
    if (!b.sha1 || b.sha1 !== info.h) { pend.push({ where: f, why: 'inventory SHA1 differs from the current one' }); continue; }
    if (b.lines !== String(info.l)) { pend.push({ where: f, why: 'inventory line count differs from the current one' }); continue; }
    if (!covers(b.ranges, info.l)) { pend.push({ where: f, why: 'parts read do not cover 1..lines' }); continue; }
    const limit = cfg.readLimitChars;
    const prefix = lineCosts(f, info);
    for (const [a, bb] of b.ranges) {
      if (rangeCost(prefix, a, Math.min(bb, info.l)) > limit) { pend.push({ where: f, why: `part ${a}-${bb} above the read limit` }); break; }
    }
    if (!b.purpose) { pend.push({ where: f, why: 'empty purpose' }); continue; }
    inventoried++;
  }
  for (const [p, b] of blocks) {
    if (!scopeAll.includes(p)) pend.push({ where: p, why: 'block for a file that does not exist or is out of scope' });
    if (!b.batch) pend.push({ where: p, why: 'block without a batch field' });
  }
  // inventario-arquivos.md matches the merge
  const finalTxt = readText('auditoria/inventario-arquivos.md');
  if (finalTxt !== null) {
    const merged = mergeInventory();
    if (merged !== null && finalTxt !== merged) pend.push({ where: 'auditoria/inventario-arquivos.md', why: 'differs from what merge-inventory.mjs would generate' });
  }
  return report('C1', 'inventory', `${scope.length} in scope | ${inventoried} inventoried`, pend);
}

// ---------- C2: citations ----------

function checkC2() {
  const pend = [];
  const known = collectIds();
  for (const f of auditFiles) {
    const text = readText(f);
    if (text === null) continue;
    for (const e of citationErrors(f, text)) pend.push({ where: e.split(': ')[0], why: e });
    for (const e of nakedRefErrors(f, text)) pend.push({ where: e.split(': ')[0], why: e });
    // Id references are checked in the records (text), not in the measurement scripts (code).
    if (f.endsWith('.md')) for (const e of idRefErrors(f, text, known)) pend.push({ where: f, why: e });
  }
  return report('C2', 'citations', `${auditFiles.length} files`, pend);
}

// ---------- C3: patterns ----------

// auditoria/padroes.json keeps its Portuguese keys (alvos, codigo, incluir, excluir, manifesto, padroes, tipo, alvo...).
function targetsOf(patterns) {
  const out = [];
  const code = patterns.alvos?.codigo;
  if (code) {
    for (const f of scopeFiles()) {
      if (!code.incluir.some((g) => matchAny(f, [g]))) continue;
      if (code.excluir.some((g) => matchAny(f, [g]))) continue;
      out.push({ target: 'codigo', file: f });
    }
  }
  const man = patterns.alvos?.manifesto;
  if (man) {
    for (const f of scopeFiles()) {
      if (!man.incluir.some((g) => matchAny(f, [g]))) continue;
      if ((man.excluir || []).some((g) => matchAny(f, [g]))) continue;
      out.push({ target: 'manifesto', file: f });
    }
  }
  return out;
}

function citedPositions(text) {
  const set = new Set();
  for (const m of text.matchAll(/`([^`\s]+?):(\d+)`/g)) set.add(m[1].replace(/\\/g, '/') + ':' + m[2]);
  return set;
}

function checkC3() {
  const pend = [];
  const raw = readText('auditoria/padroes.json');
  if (!raw) return report('C3', 'patterns', 'padroes.json missing', [{ where: 'auditoria/padroes.json', why: 'file missing' }]);
  let patterns;
  try { patterns = JSON.parse(raw); } catch (e) { return report('C3', 'patterns', 'padroes.json invalid', [{ where: 'auditoria/padroes.json', why: 'invalid JSON: ' + e.message }]); }
  const stateTxt = (readText('auditoria/estado.md') || '') + listAuditSub('estado');
  const inputsTxt = (readText('auditoria/entradas.md') || '') + listAuditSub('entradas');
  const stateCit = citedPositions(stateTxt);
  const inputsCit = citedPositions(inputsTxt);
  const excCit = new Set();
  for (const t of [stateTxt, inputsTxt]) {
    for (const b of parseItems(t, 'EXC')) {
      const occurrence = (b.fields['Ocorrência'] || []).join(' ');
      const reason = (b.fields['Motivo'] || []).join(' ');
      if (reason) for (const m of occurrence.matchAll(/`([^`\s]+?):(\d+)`/g)) excCit.add(m[1].replace(/\\/g, '/') + ':' + m[2]);
    }
  }
  const targets = targetsOf(patterns);
  let occ = 0;
  for (const p of patterns.padroes || []) {
    // Input patterns are only checked from Phase 4 on, when entradas.md exists.
    if (p.tipo === 'entrada' && PHASE < 4) continue;
    if (!p.justificativa || !p.fonte) { pend.push({ where: p.id, why: 'pattern without justification or source' }); continue; }
    let re;
    try { re = new RegExp(p.regex, p.flags || ''); } catch { pend.push({ where: p.id, why: 'regex that does not compile' }); continue; }
    for (const t of targets) {
      if (t.target !== p.alvo) continue;
      const text = readText(t.file);
      if (text === null) continue;
      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        re.lastIndex = 0;
        if (!re.test(lines[i])) continue;
        occ++;
        const pos = t.file + ':' + (i + 1);
        const set = p.tipo === 'entrada' ? inputsCit : stateCit;
        if (!set.has(pos) && !excCit.has(pos)) pend.push({ where: `${p.id} ${pos}`, why: 'occurrence with no item and no exclusion' });
      }
    }
  }
  return report('C3', 'patterns', `${occ} occurrences`, pend);
}

// ---------- C4: state ----------

function listAuditSub(dirName) {
  const dir = path.join(AUD, dirName);
  if (!fs.existsSync(dir)) return '';
  let out = '';
  for (const e of fs.readdirSync(dir)) if (e.endsWith('.md')) out += '\n' + (readText(`auditoria/${dirName}/${e}`) || '');
  return out;
}

// An area's record lives in auditoria/<area>/<file>.md and is merged into auditoria/<area>.md.
// Reading both would count each item twice: the subdirectory wins; the merged file serves when there is no area.
function recordText(dirName) {
  const sub = listAuditSub(dirName);
  return sub.trim() !== '' ? sub : (readText(`auditoria/${dirName}.md`) || '');
}

function stateText() { return recordText('estado'); }
function inputsText() { return recordText('entradas'); }

function fieldHasCitation(v) { return /`[^`\s]+?:\d+`/.test(v || ''); }

// Browser categories as written in the "Navegador" field of the state records.
const BROWSER_CATEGORIES = ['foco', 'seleção-de-texto', 'rolagem', 'documento-do-iframe', 'captura-de-ponteiro'];

function checkC4() {
  const pend = [];
  const text = stateText();
  const items = parseItems(text, 'EST');
  const browserCats = new Set();
  for (const it of items) {
    for (const f of ['Declaração', 'Forma', 'Valores possíveis', 'Escritores', 'Leitores', 'Criação', 'Descarte', 'Navegador']) {
      if (!it.fields[f] || !it.fields[f].some((x) => x && x.length)) pend.push({ where: it.id, why: `field missing or empty: ${f}` });
    }
    for (const f of ['Declaração', 'Criação', 'Descarte', 'Escritores', 'Leitores']) {
      if (it.fields[f] && !fieldHasCitation(it.fields[f].join(' '))) pend.push({ where: it.id, why: `${f} without a citation` });
    }
    const nav = (it.fields['Navegador'] || [''])[0];
    if (nav && !['não', ...BROWSER_CATEGORIES].includes(nav)) pend.push({ where: it.id, why: `invalid Navegador value: ${nav}` });
    if (nav && nav !== 'não') browserCats.add(nav);
    const hasWriter = it.fields['Escritores'] && it.fields['Escritores'].some((x) => x.length);
    const hasReader = it.fields['Leitores'] && it.fields['Leitores'].some((x) => x.length);
    if (hasWriter && !hasReader && !/DEF-\d+/.test(it.body)) pend.push({ where: it.id, why: 'state written and never read, without a DEF' });
  }
  if (items.length) {
    for (const c of BROWSER_CATEGORIES) {
      if (!browserCats.has(c)) pend.push({ where: 'estado.md', why: `missing browser item for the category ${c}` });
    }
  }
  // state id used in a flow but missing from estado.md (cross-check, Phase 5)
  if (CROSS) {
    const ids = new Set(items.map((i) => i.id));
    for (const f of flowFiles()) {
      const t = readText(f) || '';
      for (const m of t.matchAll(/\[(?:lê|escreve):\s*(EST-[A-Za-z0-9._-]+)/g)) {
        if (!ids.has(m[1])) pend.push({ where: f, why: `state id used in the flow and missing from estado.md: ${m[1]}` });
      }
    }
  }
  return report('C4', 'state', `${items.length} items`, pend);
}

// ---------- C5: flows and snippets ----------

// Section headings of the Portuguese flow records.
const FLOW_SECTIONS = ['Passos', 'Ramos', 'Fronteiras assíncronas', 'Estado', 'Resultado', 'Regras', 'Limpeza', 'Medições'];
const RULE_LINES = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'INT'];
const NAV_API = /(getBoundingClientRect|getClientRects|getComputedStyle|elementFromPoint|elementsFromPoint|matchMedia|innerWidth|innerHeight|devicePixelRatio|currentCSSZoom|activeElement|caretPositionFromPoint|caretRangeFromPoint|offsetTop|offsetLeft|offsetWidth|offsetHeight|clientWidth|clientHeight|scrollTop|scrollLeft|scrollWidth|scrollHeight)/;

function sectionBodies(text) {
  const map = new Map();
  const re = /^## (.+)$/gm;
  const heads = [...text.matchAll(re)];
  for (let i = 0; i < heads.length; i++) {
    const s = heads[i].index + heads[i][0].length;
    const e = i + 1 < heads.length ? heads[i + 1].index : text.length;
    map.set(heads[i][1].trim(), text.slice(s, e).trim());
  }
  return map;
}

function checkC5() {
  const pend = [];
  const inputs = parseItems(inputsText(), 'ENT');
  const needsSnippet = inputs.filter((e) => ((e.fields['Tipo'] || [''])[0] || '').startsWith('comando-porta'));
  const flows = flowFiles();
  const flowIds = new Set(flows.map((f) => path.basename(f).replace(/\.md$/, '')));
  const citedSnippets = new Set();
  for (const e of inputs) {
    if (!flowIds.has(e.id)) pend.push({ where: e.id, why: 'input without a flow file' });
  }
  const inputIds = new Set(inputs.map((e) => e.id));
  const snippetDir = path.join(AUD, 'fluxos', 'trechos');
  const snippets = fs.existsSync(snippetDir) ? fs.readdirSync(snippetDir).filter((e) => e.endsWith('.md')).map((e) => 'fluxos/' + e.slice(0, -3)) : [];
  for (const e of needsSnippet) {
    const p = `auditoria/fluxos/${e.id}.md`;
    if (!fs.existsSync(path.join(ROOT, p))) continue;
    const t = readText(p) || '';
    if (!t.includes('Trecho:')) pend.push({ where: p, why: 'door flow without Trecho' });
    if (!t.includes('Argumentos enviados')) pend.push({ where: p, why: 'door flow without Argumentos enviados' });
    if (!t.includes('Ramos do trecho')) pend.push({ where: p, why: 'door flow without Ramos do trecho' });
  }
  // manifest commands without a TRC
  const cmdIds = manifestCommandIds();
  const trcNames = new Set(snippets.map((t) => t.replace(/^fluxos\//, '')));
  for (const c of cmdIds) if (!trcNames.has('TRC-' + c)) pend.push({ where: c, why: 'manifest command without a TRC-' });
  for (const f of flows) {
    const id = path.basename(f).replace(/\.md$/, '');
    if (id.startsWith('TRC-')) { citedSnippets.add(id); continue; }
    if (!inputIds.has(id)) pend.push({ where: f, why: 'flow file without an input' });
    const t = readText(f);
    for (const m of t.matchAll(/\bTRC-[A-Za-z0-9._-]+/g)) citedSnippets.add(m[0]);
  }
  for (const t of snippets) {
    const n = t.replace(/^fluxos\//, '');
    if (!citedSnippets.has(n)) pend.push({ where: t, why: 'snippet that no flow cites' });
  }
  for (const f of flows) {
    const t = readText(f) || '';
    const secs = sectionBodies(t);
    for (const s of FLOW_SECTIONS) {
      if (!secs.has(s)) pend.push({ where: f, why: `required section missing: ${s}` });
      else if (!secs.get(s)) pend.push({ where: f, why: `required section empty: ${s}` });
    }
    const steps = secs.get('Passos') || '';
    if (steps && !/`[^`\s]+?:\d+`/.test(steps)) pend.push({ where: f, why: 'Passos without a citation' });
    const rules = secs.get('Regras') || '';
    if (rules) for (const r of RULE_LINES) {
      const line = rules.split('\n').find((l) => l.includes(r + ':'));
      if (!line) pend.push({ where: f, why: `Regras without the line ${r}` });
      else if (!/ok|DEF-\d+|n\/a/.test(line)) pend.push({ where: f, why: `line ${r} of Regras without ok, DEF- or n/a` });
    }
    const res = secs.get('Resultado') || '';
    if (res) for (const field of ['Estado final', 'Re-renderizado', 'DOM do editor', 'DOM do canvas']) {
      if (!res.includes(field)) pend.push({ where: f, why: `Resultado without the field ${field}` });
    }
    // automatic: awaits/timers/listeners in the steps
    const boundaries = secs.get('Fronteiras assíncronas') || '';
    for (const line of steps.split('\n')) {
      if (/(await\s|\.then\(|setTimeout\(|setInterval\(|requestAnimationFrame\(|queueMicrotask\(|addEventListener\()/.test(line)) {
        const cits = [...line.matchAll(/`[^`\s]+?:\d+`/g)].map((m) => m[0]);
        if (cits.length && !cits.some((c) => boundaries.includes(c))) pend.push({ where: f, why: 'step with await/timer/listener without a recorded boundary' });
      }
    }
    const cleanup = secs.get('Limpeza') || '';
    for (const line of steps.split('\n')) {
      if (/(addEventListener\(|setInterval\(|setTimeout\(|requestAnimationFrame\(|new\s+\w*Observer\b)/.test(line)) {
        if (!/DEF-\d+/.test(cleanup) && !/removeEventListener|clearInterval|clearTimeout|cancelAnimationFrame|disconnect|remoção/i.test(cleanup)) pend.push({ where: f, why: 'listener/timer/observer created without a cited Limpeza' });
      }
    }
    const meds = secs.get('Medições') || '';
    for (const line of steps.split('\n')) {
      if (NAV_API.test(line)) {
        if (!/MED-\d+/.test(meds)) pend.push({ where: f, why: 'step uses a browser-computed API without a MED-' });
        break;
      }
    }
  }
  return report('C5', 'flows and snippets', `${flows.length} files`, pend);
}

function pairsOf(entry) {
  const wUnits = [...entry.writers.entries()].map(([fn, ids]) => ({ kind: 'GRE', fn, ids: [...ids] }));
  const rUnits = [...entry.readers.entries()].map(([fn, ids]) => ({ kind: 'GRL', fn, ids: [...ids] }));
  const pairs = [];
  for (const w of wUnits) for (const r of rUnits) {
    pairs.push(`${w.kind === 'GRE' ? 'GRE' : w.ids[0]}__${r.kind === 'GRL' ? 'GRL' : r.ids[0]}`);
  }
  return { wUnits, rUnits };
}

function checkC6() {
  const pend = [];
  const mat = computeMatrix();
  const declared = parseItems(readText('auditoria/matriz.md') || '', 'EST');
  const declaredMap = new Map(declared.map((d) => [d.id, d]));
  for (const [est, entry] of mat) {
    const d = declaredMap.get(est);
    if (!d) { pend.push({ where: est, why: 'state item of the computed matrix missing from matriz.md' }); continue; }
    for (const [fn, ids] of entry.writers) if (ids.size === 0) pend.push({ where: est, why: `writer without inputs: ${fn}` });
  }
  for (const d of declared) if (!mat.has(d.id)) pend.push({ where: d.id, why: 'item of matriz.md that the computed matrix does not contain' });
  // interaction files
  const dir = path.join(AUD, 'interacoes');
  const files = fs.existsSync(dir) ? new Set(fs.readdirSync(dir).filter((e) => e.endsWith('.md')).map((e) => e.slice(0, -3))) : new Set();
  for (const [est, entry] of mat) {
    const { wUnits, rUnits } = pairsOf(entry);
    for (const w of wUnits) for (const r of rUnits) {
      const pairs = [];
      const wName = w.kind === 'GRE' ? greId(est, w.fn, mat) : w.ids[0];
      const rName = r.kind === 'GRL' ? grlId(est, r.fn, mat) : r.ids[0];
      pairs.push(`${est}__${wName}__${rName}`);
      for (const p of pairs) {
        if (!files.has(p)) { pend.push({ where: p, why: 'pair without a file in interacoes/' }); continue; }
        const t = readText(`auditoria/interacoes/${p}.md`) || '';
        for (const c of ['C1 final', 'C2 intermediário', 'C3 em curso', 'C4 desmontagem']) {
          if (!t.includes(c)) pend.push({ where: p, why: `missing case: ${c}` });
        }
      }
    }
  }
  return report('C6', 'interactions', `${mat.size} state items`, pend);
}
function greId(est, fn, mat) { const e = mat.get(est); const fns = [...e.writers.keys()].sort(); return 'GRE-' + est + '-' + String(fns.indexOf(fn) + 1).padStart(2, '0'); }
function grlId(est, fn, mat) { const e = mat.get(est); const fns = [...e.readers.keys()].sort(); return 'GRL-' + est + '-' + String(fns.indexOf(fn) + 1).padStart(2, '0'); }

// ---------- C7: language ----------

function checkC7() {
  const pend = [];
  for (const f of auditFiles) {
    const text = readText(f);
    if (text === null) continue;
    const bad = forbiddenWordsIn(text);
    for (const w of bad) pend.push({ where: f, why: `forbidden word "${w}"` });
  }
  return report('C7', 'language', `${auditFiles.length} files`, pend);
}

// ---------- C8: defects ----------

function checkC8() {
  const pend = [];
  const text = readText('auditoria/defeitos.md') || '';
  const items = parseItems(text, 'DEF');
  for (const it of items) {
    const status = (it.fields['Status'] || [''])[0];
    if (!['aberto', 'corrigido'].includes(status)) pend.push({ where: it.id, why: `invalid Status: ${status || 'empty'}` });
    for (const f of ['Citação', 'Causa', 'Efeito', 'Alcance']) if (!it.fields[f] || !it.fields[f].some((x) => x.length)) pend.push({ where: it.id, why: `required field empty: ${f}` });
    if (status === 'aberto') pend.push({ where: it.id, why: 'open' });
    if (status === 'corrigido') {
      if (!it.fields['Correção'] || !fieldHasCitation(it.fields['Correção'].join(' '))) pend.push({ where: it.id, why: 'fixed without a citation in Correção' });
      if (!it.fields['Re-rastreados']) pend.push({ where: it.id, why: 'fixed without Re-rastreados' });
    }
  }
  const interDir = path.join(AUD, 'interacoes');
  const interFiles = fs.existsSync(interDir) ? fs.readdirSync(interDir).filter((e) => e.endsWith('.md')).map((e) => 'auditoria/interacoes/' + e) : [];
  for (const f of [...flowFiles(), ...interFiles]) {
    const t = stripCode(readText(f) || '');
    for (const m of t.matchAll(/\bDEF-\d+/g)) {
      if (!items.some((i) => i.id === m[0])) pend.push({ where: f, why: `cited DEF- that does not exist: ${m[0]}` });
    }
  }
  return report('C8', 'defects', `${items.length} defects`, pend);
}

// ---------- C9: requirements ----------

function checkC9() {
  const pend = [];
  const text = recordText('requisitos');
  const items = parseItems(text, 'REQ');
  const inputIds = new Set(parseItems(inputsText(), 'ENT').map((e) => e.id));
  for (const it of items) {
    if (!it.fields['Onde'] || !fieldHasCitation(it.fields['Onde'].join(' '))) pend.push({ where: it.id, why: 'no cited Onde' });
    if (!it.fields['Comportamento esperado'] || !it.fields['Comportamento esperado'].some((x) => x.length)) pend.push({ where: it.id, why: 'no Comportamento esperado' });
    for (const e of (it.fields['Entradas'] || [])) for (const id of e.matchAll(/ENT-[A-Za-z0-9._-]+/g)) if (!inputIds.has(id[0])) pend.push({ where: it.id, why: `nonexistent input: ${id[0]}` });
  }
  const cmdIds = manifestCommandIds();
  const covered = text;
  for (const c of cmdIds) if (!covered.includes(c)) pend.push({ where: c, why: 'manifest command missing from every REQ-' });
  return report('C9', 'requirements', `${items.length} requirements`, pend);
}

// ---------- C10: optimizations ----------

function checkC10() {
  const pend = [];
  const text = readText('auditoria/otimizacoes.md') || '';
  const items = parseItems(text, 'OTM');
  const medDir = path.join(AUD, 'medicoes');
  const meds = fs.existsSync(medDir) ? new Set(fs.readdirSync(medDir).filter((e) => /^MED-\d+\.md$/.test(e)).map((e) => e.slice(0, -3))) : new Set();
  for (const it of items) {
    const status = (it.fields['Status'] || [''])[0];
    if (status === 'aplicada') {
      const before = (it.fields['Medida antes'] || [''])[0] || '';
      const after = (it.fields['Medida depois'] || [''])[0] || '';
      if (!before || !after) pend.push({ where: it.id, why: 'applied without both measurements' });
      for (const m of (before + after).matchAll(/MED-\d+/g)) if (!meds.has(m[0])) pend.push({ where: it.id, why: `nonexistent MED-: ${m[0]}` });
    }
    if (!it.fields['Re-rastreados']) pend.push({ where: it.id, why: 'no Re-rastreados' });
  }
  return report('C10', 'optimizations', `${items.length} optimizations`, pend);
}

// ---------- run ----------

const RUN = {
  C1: checkC1, C2: checkC2, C3: checkC3, C4: checkC4, C5: checkC5,
  C6: checkC6, C7: checkC7, C8: checkC8, C9: checkC9, C10: checkC10,
};

for (const id of ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10']) {
  if (!CHECKS.includes(id)) continue;
  try { RUN[id](); } catch (err) { report(id, 'error', 'run failure', [{ where: id, why: String(err && err.message ? err.message : err) }]); }
}

let total = 0;
const lines = [];
for (const r of results) {
  total += r.pend.length;
  lines.push(`${r.id} ${r.label}: ${r.counts} | ${r.pend.length} pending`);
}
if (!SUMMARY) {
  for (const r of results) for (const p of r.pend.slice(0, 200)) lines.push(`PENDING ${r.id} ${p.where}: ${p.why}`);
}
lines.push(`TOTAL: ${total} pending`);
process.stdout.write(lines.join('\n') + '\n');
process.exit(total > 0 ? 1 : 0);
