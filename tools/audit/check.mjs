/* global process */
// Verificador da auditoria (PROMPT.md, Fase 1). Sai com código 1 se houver pendência.
// Uso: node tools/audit/check.mjs [--ate-fase N] [--so C1,C2] [--lote Lxx] [--resumo]
import path from 'node:path';
import {
  ROOT, cfg, scopeFiles, fileInfo, readText, listAuditFiles,
  citationErrors, nakedRefErrors, idRefErrors, forbiddenWordsIn, stripCode,
  parseItems, collectIds, matchAny, lineCosts, rangeCost,
  flowFiles, computeMatrix, manifestCommandIds, mergeInventario, inventarioBlocks,
} from './lib.mjs';
import fs from 'node:fs';

// ---------- argumentos ----------

const argv = process.argv.slice(2);
function argVal(flag) {
  const i = argv.indexOf(flag);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : null;
}
const FASE = argVal('--ate-fase') ? Number(argVal('--ate-fase')) : 9;
const SO = argVal('--so') ? argVal('--so').split(',').map((s) => s.trim()) : null;
const LOTE = argVal('--lote');
const RESUMO = argv.includes('--resumo');

const FASE_CHECKS = {
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
const CHECKS = SO || FASE_CHECKS[FASE] || FASE_CHECKS[9];
const CROSS = FASE >= 5 || (SO && SO.includes('C5'));

const results = [];
function report(id, label, counts, pend) {
  results.push({ id, label, counts, pend });
}

const AUD = path.join(ROOT, 'auditoria');
const auditoriaFiles = listAuditFiles(['.md', '.json', '.mjs']);

// ---------- C1: inventário ----------

function loteFiles() {
  if (!LOTE) return null;
  const p = path.join(AUD, 'lotes', `${LOTE}.md`);
  const text = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
  if (!text) return null;
  const set = new Set();
  for (const m of text.matchAll(/`([^`\n]+?)`/g)) set.add(m[1]);
  return set;
}

function parseInventarioBlocks() {
  const found = inventarioBlocks();
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
  const loteFilter = loteFiles();
  const scope = loteFilter ? scopeAll.filter((f) => loteFilter.has(f)) : scopeAll;
  const blocks = parseInventarioBlocks();
  let inventariados = 0;
  for (const f of scope) {
    const b = blocks.get(f);
    if (!b) { pend.push({ where: f, why: 'arquivo do escopo sem bloco no inventário' }); continue; }
    const info = fileInfo(f);
    if (!b.sha1 || b.sha1 !== info.h) { pend.push({ where: f, why: 'SHA1 do inventário diferente do atual' }); continue; }
    if (b.linhas !== String(info.l)) { pend.push({ where: f, why: 'Linhas do inventário diferente do atual' }); continue; }
    if (!covers(b.ranges, info.l)) { pend.push({ where: f, why: 'Partes lidas não cobrem 1..Linhas' }); continue; }
    const limit = cfg.limiteLeituraCaracteres;
    const prefix = lineCosts(f, info);
    for (const [a, bb] of b.ranges) {
      if (rangeCost(prefix, a, Math.min(bb, info.l)) > limit) { pend.push({ where: f, why: `parte ${a}-${bb} acima do limite de leitura` }); break; }
    }
    if (!b.proposito) { pend.push({ where: f, why: 'Propósito vazio' }); continue; }
    inventariados++;
  }
  for (const [p, b] of blocks) {
    if (!scopeAll.includes(p)) pend.push({ where: p, why: 'bloco de arquivo inexistente ou fora do escopo' });
    if (!b.lote) pend.push({ where: p, why: 'bloco sem campo Lote' });
  }
  // inventario-arquivos.md confere com a junção
  const finalTxt = readText('auditoria/inventario-arquivos.md');
  if (finalTxt !== null) {
    const merged = mergeInventario();
    if (merged !== null && finalTxt !== merged) pend.push({ where: 'auditoria/inventario-arquivos.md', why: 'diferente do que juntar-inventario.mjs geraria' });
  }
  return report('C1', 'inventário', `${scope.length} no escopo | ${inventariados} inventariados`, pend);
}

// ---------- C2: citações ----------

function checkC2() {
  const pend = [];
  const known = collectIds();
  for (const f of auditoriaFiles) {
    const text = readText(f);
    if (text === null) continue;
    for (const e of citationErrors(f, text)) pend.push({ where: e.split(': ')[0], why: e });
    for (const e of nakedRefErrors(f, text)) pend.push({ where: e.split(': ')[0], why: e });
    // A referência a id é conferida nos registros (texto), não nos scripts de medição (código).
    if (f.endsWith('.md')) for (const e of idRefErrors(f, text, known)) pend.push({ where: f, why: e });
  }
  return report('C2', 'citações', `${auditoriaFiles.length} arquivos`, pend);
}

// ---------- C3: padrões ----------

function targetsOf(padroes) {
  const out = [];
  const codigo = padroes.alvos?.codigo;
  if (codigo) {
    for (const f of scopeFiles()) {
      if (!codigo.incluir.some((g) => matchAny(f, [g]))) continue;
      if (codigo.excluir.some((g) => matchAny(f, [g]))) continue;
      out.push({ alvo: 'codigo', file: f });
    }
  }
  const man = padroes.alvos?.manifesto;
  if (man) {
    for (const f of scopeFiles()) {
      if (!man.incluir.some((g) => matchAny(f, [g]))) continue;
      if ((man.excluir || []).some((g) => matchAny(f, [g]))) continue;
      out.push({ alvo: 'manifesto', file: f });
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
  if (!raw) return report('C3', 'padrões', 'padroes.json ausente', [{ where: 'auditoria/padroes.json', why: 'arquivo ausente' }]);
  let padroes;
  try { padroes = JSON.parse(raw); } catch (e) { return report('C3', 'padrões', 'padroes.json inválido', [{ where: 'auditoria/padroes.json', why: 'JSON inválido: ' + e.message }]); }
  const estadoTxt = (readText('auditoria/estado.md') || '') + listAuditSub('estado');
  const entradasTxt = (readText('auditoria/entradas.md') || '') + listAuditSub('entradas');
  const estadoCit = citedPositions(estadoTxt);
  const entradasCit = citedPositions(entradasTxt);
  const excCit = new Set();
  for (const t of [estadoTxt, entradasTxt]) {
    for (const b of parseItems(t, 'EXC')) {
      const occ = (b.fields['Ocorrência'] || []).join(' ');
      const motivo = (b.fields['Motivo'] || []).join(' ');
      if (motivo) for (const m of occ.matchAll(/`([^`\s]+?):(\d+)`/g)) excCit.add(m[1].replace(/\\/g, '/') + ':' + m[2]);
    }
  }
  const targets = targetsOf(padroes);
  let occ = 0;
  for (const p of padroes.padroes || []) {
    // A conferência dos padrões de entrada só vale a partir da Fase 4, quando entradas.md existe.
    if (p.tipo === 'entrada' && FASE < 4) continue;
    if (!p.justificativa || !p.fonte) { pend.push({ where: p.id, why: 'padrão sem justificativa ou fonte' }); continue; }
    let re;
    try { re = new RegExp(p.regex, p.flags || ''); } catch { pend.push({ where: p.id, why: 'regex que não compila' }); continue; }
    for (const t of targets) {
      if (t.alvo !== p.alvo) continue;
      const text = readText(t.file);
      if (text === null) continue;
      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        re.lastIndex = 0;
        if (!re.test(lines[i])) continue;
        occ++;
        const pos = t.file + ':' + (i + 1);
        const set = p.tipo === 'entrada' ? entradasCit : estadoCit;
        if (!set.has(pos) && !excCit.has(pos)) pend.push({ where: `${p.id} ${pos}`, why: 'ocorrência sem item nem exclusão' });
      }
    }
  }
  return report('C3', 'padrões', `${occ} ocorrências`, pend);
}

// ---------- C4: estado ----------

function listAuditSub(dirName) {
  const dir = path.join(AUD, dirName);
  if (!fs.existsSync(dir)) return '';
  let out = '';
  for (const e of fs.readdirSync(dir)) if (e.endsWith('.md')) out += '\n' + (readText(`auditoria/${dirName}/${e}`) || '');
  return out;
}

// O registro de uma área vive em auditoria/<área>/<arquivo>.md e é juntado em auditoria/<área>.md.
// Ler os dois contaria cada item duas vezes: o subdiretório vence; o arquivo juntado serve quando não há área.
function registroText(dirName) {
  const sub = listAuditSub(dirName);
  return sub.trim() !== '' ? sub : (readText(`auditoria/${dirName}.md`) || '');
}

function estadoText() { return registroText('estado'); }
function entradasText() { return registroText('entradas'); }

function fieldHasCitation(v) { return /`[^`\s]+?:\d+`/.test(v || ''); }

function checkC4() {
  const pend = [];
  const text = estadoText();
  const items = parseItems(text, 'EST');
  const browserCats = new Set();
  for (const it of items) {
    for (const f of ['Declaração', 'Forma', 'Valores possíveis', 'Escritores', 'Leitores', 'Criação', 'Descarte', 'Navegador']) {
      if (!it.fields[f] || !it.fields[f].some((x) => x && x.length)) pend.push({ where: it.id, why: `campo ausente ou vazio: ${f}` });
    }
    if (it.fields['Declaração'] && !fieldHasCitation(it.fields['Declaração'].join(' '))) pend.push({ where: it.id, why: 'Declaração sem citação' });
    if (it.fields['Criação'] && !fieldHasCitation(it.fields['Criação'].join(' '))) pend.push({ where: it.id, why: 'Criação sem citação' });
    if (it.fields['Descarte'] && !fieldHasCitation(it.fields['Descarte'].join(' '))) pend.push({ where: it.id, why: 'Descarte sem citação' });
    if (it.fields['Escritores'] && !fieldHasCitation(it.fields['Escritores'].join(' '))) pend.push({ where: it.id, why: 'Escritores sem citação' });
    if (it.fields['Leitores'] && !fieldHasCitation(it.fields['Leitores'].join(' '))) pend.push({ where: it.id, why: 'Leitores sem citação' });
    const nav = (it.fields['Navegador'] || [''])[0];
    if (nav && !['não', 'foco', 'seleção-de-texto', 'rolagem', 'documento-do-iframe', 'captura-de-ponteiro'].includes(nav)) pend.push({ where: it.id, why: `Navegador inválido: ${nav}` });
    if (nav && nav !== 'não') browserCats.add(nav);
    const hasWriter = it.fields['Escritores'] && it.fields['Escritores'].some((x) => x.length);
    const hasReader = it.fields['Leitores'] && it.fields['Leitores'].some((x) => x.length);
    if (hasWriter && !hasReader && !/DEF-\d+/.test(it.body)) pend.push({ where: it.id, why: 'estado escrito e nunca lido sem DEF' });
  }
  if (items.length) {
    for (const c of ['foco', 'seleção-de-texto', 'rolagem', 'documento-do-iframe', 'captura-de-ponteiro']) {
      if (!browserCats.has(c)) pend.push({ where: 'estado.md', why: `falta item de navegador para a categoria ${c}` });
    }
  }
  // id de estado usado em fluxo ausente de estado.md (cruzamento, Fase 5)
  if (CROSS) {
    const ids = new Set(items.map((i) => i.id));
    for (const f of flowFiles()) {
      const t = readText(f) || '';
      for (const m of t.matchAll(/\[(?:lê|escreve):\s*(EST-[A-Za-z0-9._-]+)/g)) {
        if (!ids.has(m[1])) pend.push({ where: f, why: `id de estado usado no fluxo e ausente de estado.md: ${m[1]}` });
      }
    }
  }
  return report('C4', 'estado', `${items.length} itens`, pend);
}

// ---------- C5: fluxos e trechos ----------

const FLOW_SECTIONS = ['Passos', 'Ramos', 'Fronteiras assíncronas', 'Estado', 'Resultado', 'Regras', 'Limpeza', 'Medições'];
const REGRA_LINES = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'INT'];
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
  const entradas = parseItems(entradasText(), 'ENT');
  const needsTrecho = entradas.filter((e) => ((e.fields['Tipo'] || [''])[0] || '').startsWith('comando-porta'));
  const flows = flowFiles();
  const flowIds = new Set(flows.map((f) => path.basename(f).replace(/\.md$/, '')));
  const citedTrechos = new Set();
  let medidas = new Set();
  const medDir = path.join(AUD, 'medicoes');
  if (fs.existsSync(medDir)) for (const e of fs.readdirSync(medDir)) if (e.endsWith('.md')) medidas.add(e.replace(/\.md$/, ''));
  for (const e of entradas) {
    if (!flowIds.has(e.id)) pend.push({ where: e.id, why: 'entrada sem arquivo de fluxo' });
  }
  const entradaIds = new Set(entradas.map((e) => e.id));
  const trechoDir = path.join(AUD, 'fluxos', 'trechos');
  const trechos = fs.existsSync(trechoDir) ? fs.readdirSync(trechoDir).filter((e) => e.endsWith('.md')).map((e) => 'fluxos/' + e.slice(0, -3)) : [];
  for (const e of needsTrecho) {
    const p = `auditoria/fluxos/${e.id}.md`;
    if (!fs.existsSync(path.join(ROOT, p))) continue;
    const t = readText(p) || '';
    if (!t.includes('Trecho:')) pend.push({ where: p, why: 'fluxo de porta sem Trecho' });
    if (!t.includes('Argumentos enviados')) pend.push({ where: p, why: 'fluxo de porta sem Argumentos enviados' });
    if (!t.includes('Ramos do trecho')) pend.push({ where: p, why: 'fluxo de porta sem Ramos do trecho' });
  }
  // comandos do manifesto sem TRC
  const cmdIds = manifestCommandIds();
  const trcNames = new Set(trechos.map((t) => t.replace(/^fluxos\//, '')));
  for (const c of cmdIds) if (!trcNames.has('TRC-' + c)) pend.push({ where: c, why: 'comando do manifesto sem TRC-' });
  for (const f of flows) {
    const id = path.basename(f).replace(/\.md$/, '');
    if (id.startsWith('TRC-')) { citedTrechos.add(id); continue; }
    if (!entradaIds.has(id)) pend.push({ where: f, why: 'arquivo de fluxo sem entrada' });
    const t = readText(f);
    for (const m of t.matchAll(/\bTRC-[A-Za-z0-9._-]+/g)) citedTrechos.add(m[0]);
  }
  for (const t of trechos) {
    const n = t.replace(/^fluxos\//, '');
    if (!citedTrechos.has(n)) pend.push({ where: t, why: 'trecho que nenhum fluxo cita' });
  }
  for (const f of flows) {
    const t = readText(f) || '';
    const secs = sectionBodies(t);
    for (const s of FLOW_SECTIONS) {
      if (!secs.has(s)) pend.push({ where: f, why: `seção obrigatória ausente: ${s}` });
      else if (!secs.get(s)) pend.push({ where: f, why: `seção obrigatória vazia: ${s}` });
    }
    const passos = secs.get('Passos') || '';
    if (passos && !/`[^`\s]+?:\d+`/.test(passos)) pend.push({ where: f, why: 'Passos sem citação' });
    const regras = secs.get('Regras') || '';
    if (regras) for (const r of REGRA_LINES) {
      const line = regras.split('\n').find((l) => l.includes(r + ':'));
      if (!line) pend.push({ where: f, why: `Regras sem a linha ${r}` });
      else if (!/ok|DEF-\d+|n\/a/.test(line)) pend.push({ where: f, why: `linha ${r} das Regras sem ok, DEF- ou n/a` });
    }
    const res = secs.get('Resultado') || '';
    if (res) for (const campo of ['Estado final', 'Re-renderizado', 'DOM do editor', 'DOM do canvas']) {
      if (!res.includes(campo)) pend.push({ where: f, why: `Resultado sem o campo ${campo}` });
    }
    // automático: awaits/timers/listeners nos passos
    const fronteiras = secs.get('Fronteiras assíncronas') || '';
    for (const line of passos.split('\n')) {
      if (/(await\s|\.then\(|setTimeout\(|setInterval\(|requestAnimationFrame\(|queueMicrotask\(|addEventListener\()/.test(line)) {
        const cits = [...line.matchAll(/`[^`\s]+?:\d+`/g)].map((m) => m[0]);
        if (cits.length && !cits.some((c) => fronteiras.includes(c))) pend.push({ where: f, why: 'passo com await/timer/listener sem fronteira registrada' });
      }
    }
    const limpeza = secs.get('Limpeza') || '';
    for (const line of passos.split('\n')) {
      if (/(addEventListener\(|setInterval\(|setTimeout\(|requestAnimationFrame\(|new\s+\w*Observer\b)/.test(line)) {
        if (!/DEF-\d+/.test(limpeza) && !/removeEventListener|clearInterval|clearTimeout|cancelAnimationFrame|disconnect|remoção/i.test(limpeza)) pend.push({ where: f, why: 'criação de listener/timer/observer sem Limpeza citada' });
      }
    }
    const meds = secs.get('Medições') || '';
    for (const line of passos.split('\n')) {
      if (NAV_API.test(line)) {
        if (!/MED-\d+/.test(meds)) pend.push({ where: f, why: 'passo usa API calculada pelo navegador sem MED-' });
        break;
      }
    }
  }
  return report('C5', 'fluxos e trechos', `${flows.length} arquivos`, pend);
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
    if (!d) { pend.push({ where: est, why: 'item de estado da matriz calculada ausente de matriz.md' }); continue; }
    for (const [fn, ids] of entry.writers) if (ids.size === 0) pend.push({ where: est, why: `escritor sem entradas: ${fn}` });
  }
  for (const d of declared) if (!mat.has(d.id)) pend.push({ where: d.id, why: 'item de matriz.md que a matriz calculada não contém' });
  // arquivos de interação
  const dir = path.join(AUD, 'interacoes');
  const files = fs.existsSync(dir) ? new Set(fs.readdirSync(dir).filter((e) => e.endsWith('.md')).map((e) => e.slice(0, -3))) : new Set();
  for (const [est, entry] of mat) {
    const { wUnits, rUnits } = pairsOf(entry);
    for (const w of wUnits) for (const r of rUnits) {
      const pares = [];
      const wName = w.kind === 'GRE' ? greId(est, w.fn, mat) : w.ids[0];
      const rName = r.kind === 'GRL' ? grlId(est, r.fn, mat) : r.ids[0];
      pares.push(`${est}__${wName}__${rName}`);
      for (const p of pares) {
        if (!files.has(p)) { pend.push({ where: p, why: 'par sem arquivo em interacoes/' }); continue; }
        const t = readText(`auditoria/interacoes/${p}.md`) || '';
        for (const c of ['C1 final', 'C2 intermediário', 'C3 em curso', 'C4 desmontagem']) {
          if (!t.includes(c)) pend.push({ where: p, why: `caso ausente: ${c}` });
        }
      }
    }
  }
  return report('C6', 'interações', `${mat.size} itens de estado`, pend);
}
function greId(est, fn, mat) { const e = mat.get(est); const fns = [...e.writers.keys()].sort(); return 'GRE-' + est + '-' + String(fns.indexOf(fn) + 1).padStart(2, '0'); }
function grlId(est, fn, mat) { const e = mat.get(est); const fns = [...e.readers.keys()].sort(); return 'GRL-' + est + '-' + String(fns.indexOf(fn) + 1).padStart(2, '0'); }

// ---------- C7: linguagem ----------

function checkC7() {
  const pend = [];
  for (const f of auditoriaFiles) {
    const text = readText(f);
    if (text === null) continue;
    const bad = forbiddenWordsIn(text);
    for (const w of bad) pend.push({ where: f, why: `palavra proibida "${w}"` });
  }
  return report('C7', 'linguagem', `${auditoriaFiles.length} arquivos`, pend);
}

// ---------- C8: defeitos ----------

function checkC8() {
  const pend = [];
  const text = readText('auditoria/defeitos.md') || '';
  const items = parseItems(text, 'DEF');
  for (const it of items) {
    const status = (it.fields['Status'] || [''])[0];
    if (!['aberto', 'corrigido'].includes(status)) pend.push({ where: it.id, why: `Status inválido: ${status || 'vazio'}` });
    for (const f of ['Citação', 'Causa', 'Efeito', 'Alcance']) if (!it.fields[f] || !it.fields[f].some((x) => x.length)) pend.push({ where: it.id, why: `campo obrigatório vazio: ${f}` });
    if (status === 'aberto') pend.push({ where: it.id, why: 'aberto' });
    if (status === 'corrigido') {
      if (!it.fields['Correção'] || !fieldHasCitation(it.fields['Correção'].join(' '))) pend.push({ where: it.id, why: 'corrigido sem citação em Correção' });
      if (!it.fields['Re-rastreados']) pend.push({ where: it.id, why: 'corrigido sem Re-rastreados' });
    }
  }
  const interDir = path.join(AUD, 'interacoes');
  const interFiles = fs.existsSync(interDir) ? fs.readdirSync(interDir).filter((e) => e.endsWith('.md')).map((e) => 'auditoria/interacoes/' + e) : [];
  for (const f of [...flowFiles(), ...interFiles]) {
    const t = stripCode(readText(f) || '');
    for (const m of t.matchAll(/\bDEF-\d+/g)) {
      if (!items.some((i) => i.id === m[0])) pend.push({ where: f, why: `DEF- citado que não existe: ${m[0]}` });
    }
  }
  return report('C8', 'defeitos', `${items.length} defeitos`, pend);
}

// ---------- C9: requisitos ----------

function checkC9() {
  const pend = [];
  const text = registroText('requisitos');
  const items = parseItems(text, 'REQ');
  const entradaIds = new Set(parseItems(entradasText(), 'ENT').map((e) => e.id));
  for (const it of items) {
    if (!it.fields['Onde'] || !fieldHasCitation(it.fields['Onde'].join(' '))) pend.push({ where: it.id, why: 'sem Onde citado' });
    if (!it.fields['Comportamento esperado'] || !it.fields['Comportamento esperado'].some((x) => x.length)) pend.push({ where: it.id, why: 'sem Comportamento esperado' });
    for (const e of (it.fields['Entradas'] || [])) for (const id of e.matchAll(/ENT-[A-Za-z0-9._-]+/g)) if (!entradaIds.has(id[0])) pend.push({ where: it.id, why: `entrada inexistente: ${id[0]}` });
  }
  const cmdIds = manifestCommandIds();
  const covered = text;
  for (const c of cmdIds) if (!covered.includes(c)) pend.push({ where: c, why: 'comando do manifesto ausente de todo REQ-' });
  return report('C9', 'requisitos', `${items.length} requisitos`, pend);
}

// ---------- C10: otimizações ----------

function checkC10() {
  const pend = [];
  const text = readText('auditoria/otimizacoes.md') || '';
  const items = parseItems(text, 'OTM');
  const medDir = path.join(AUD, 'medicoes');
  const meds = fs.existsSync(medDir) ? new Set(fs.readdirSync(medDir).filter((e) => /^MED-\d+\.md$/.test(e)).map((e) => e.slice(0, -3))) : new Set();
  for (const it of items) {
    const status = (it.fields['Status'] || [''])[0];
    if (status === 'aplicada') {
      const antes = (it.fields['Medida antes'] || [''])[0] || '';
      const depois = (it.fields['Medida depois'] || [''])[0] || '';
      if (!antes || !depois) pend.push({ where: it.id, why: 'aplicada sem as duas medidas' });
      for (const m of (antes + depois).matchAll(/MED-\d+/g)) if (!meds.has(m[0])) pend.push({ where: it.id, why: `MED- inexistente: ${m[0]}` });
    }
    if (!it.fields['Re-rastreados']) pend.push({ where: it.id, why: 'sem Re-rastreados' });
  }
  return report('C10', 'otimizações', `${items.length} otimizações`, pend);
}

// ---------- execução ----------

const RUN = {
  C1: checkC1, C2: checkC2, C3: checkC3, C4: checkC4, C5: checkC5,
  C6: checkC6, C7: checkC7, C8: checkC8, C9: checkC9, C10: checkC10,
};

for (const id of ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10']) {
  if (!CHECKS.includes(id)) continue;
  try { RUN[id](); } catch (err) { report(id, 'erro', 'falha de execução', [{ where: id, why: String(err && err.message ? err.message : err) }]); }
}

let total = 0;
const lines = [];
for (const r of results) {
  total += r.pend.length;
  lines.push(`${r.id} ${r.label}: ${r.counts} | ${r.pend.length} pendências`);
}
if (!RESUMO) {
  for (const r of results) for (const p of r.pend.slice(0, 200)) lines.push(`PENDENTE ${r.id} ${p.where}: ${p.why}`);
}
lines.push(`TOTAL: ${total} pendências`);
process.stdout.write(lines.join('\n') + '\n');
process.exit(total > 0 ? 1 : 0);
