// Prova de conceito C4: largura de texto da interface calculada em Node, lendo o arquivo da fonte (TrueType: cmap,
// hmtx e a tabela kern), comparada com a largura que o Chrome desenha (getBoundingClientRect de um span), para todas
// as mensagens de src/i18n/locales/pt-BR.json e en.json, nos tamanhos e pesos dos tokens de src/ui/tokens.css.
// Nenhum pacote novo: o leitor de fonte é este arquivo; o Chrome vem do @playwright/test instalado.
// Uso: node auditoria/investigacao/poc/c4-texto/medir.mjs
import console from 'node:console';
import { performance } from 'node:perf_hooks';
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const SAIDA = 'auditoria/investigacao/poc/c4-texto/resultados.txt';
const FONTES = { 400: 'C:/Windows/Fonts/segoeui.ttf', 600: 'C:/Windows/Fonts/seguisb.ttf' };
// os pares tamanho e peso dos tokens (--fs-caption 11/400, --fs-body 12/400, --fs-label 12/600, --fs-title 13/600, --fs-input 15/400)
const CONFIGURACOES = [[11, 400], [12, 400], [12, 600], [13, 600], [15, 400]];

// ---------------------------------------------------------------- leitor de TrueType
function lerFonte(arquivo) {
  const b = fs.readFileSync(arquivo);
  const tabelas = {};
  for (let i = 0; i < b.readUInt16BE(4); i++) {
    const o = 12 + 16 * i;
    tabelas[b.toString('ascii', o, o + 4)] = b.readUInt32BE(o + 8);
  }
  const unidades = b.readUInt16BE(tabelas.head + 18);
  const metricas = b.readUInt16BE(tabelas.hhea + 34);
  const avancos = [];
  for (let g = 0; g < metricas; g++) avancos.push(b.readUInt16BE(tabelas.hmtx + 4 * g));
  // cmap: a subtabela Windows Unicode (3,10 formato 12, ou 3,1 formato 4)
  const glifo = new Map();
  const cmap = tabelas.cmap;
  const subtabelas = [];
  for (let i = 0; i < b.readUInt16BE(cmap + 2); i++) {
    const o = cmap + 4 + 8 * i;
    subtabelas.push({ plataforma: b.readUInt16BE(o), codificacao: b.readUInt16BE(o + 2), inicio: cmap + b.readUInt32BE(o + 4) });
  }
  const s12 = subtabelas.find((s) => s.plataforma === 3 && s.codificacao === 10 && b.readUInt16BE(s.inicio) === 12);
  const s4 = subtabelas.find((s) => s.plataforma === 3 && s.codificacao === 1 && b.readUInt16BE(s.inicio) === 4);
  if (s12 !== undefined) {
    const n = b.readUInt32BE(s12.inicio + 12);
    for (let i = 0; i < n; i++) {
      const o = s12.inicio + 16 + 12 * i;
      const ini = b.readUInt32BE(o);
      const fim = b.readUInt32BE(o + 4);
      const g0 = b.readUInt32BE(o + 8);
      for (let c = ini; c <= fim; c++) glifo.set(c, g0 + c - ini);
    }
  } else if (s4 !== undefined) {
    const o = s4.inicio;
    const segs = b.readUInt16BE(o + 6) / 2;
    const fins = o + 14;
    const inis = fins + 2 * segs + 2;
    const deltas = inis + 2 * segs;
    const offs = deltas + 2 * segs;
    for (let i = 0; i < segs; i++) {
      const fim = b.readUInt16BE(fins + 2 * i);
      const ini = b.readUInt16BE(inis + 2 * i);
      const delta = b.readInt16BE(deltas + 2 * i);
      const off = b.readUInt16BE(offs + 2 * i);
      for (let c = ini; c <= fim && c !== 0xffff; c++) {
        let g;
        if (off === 0) g = (c + delta) & 0xffff;
        else {
          const at = offs + 2 * i + off + 2 * (c - ini);
          g = b.readUInt16BE(at);
          if (g !== 0) g = (g + delta) & 0xffff;
        }
        glifo.set(c, g);
      }
    }
  }
  // kern versão 0, subtabelas formato 0 (pares ordenados), horizontais
  const kern = new Map();
  if (tabelas.kern !== undefined) {
    let o = tabelas.kern;
    const n = b.readUInt16BE(o + 2);
    o += 4;
    for (let t = 0; t < n; t++) {
      const comprimento = b.readUInt16BE(o + 2);
      const cobertura = b.readUInt16BE(o + 4);
      if ((cobertura >> 8) === 0 && (cobertura & 1) === 1) {
        const pares = b.readUInt16BE(o + 6);
        for (let p = 0; p < pares; p++) {
          const q = o + 14 + 6 * p;
          kern.set(b.readUInt16BE(q) * 65536 + b.readUInt16BE(q + 2), b.readInt16BE(q + 4));
        }
      }
      o += comprimento;
    }
  }
  return { unidades, avancos, glifo, kern, gpos: tabelas.GPOS === undefined ? null : lerGpos(b, tabelas.GPOS) };
}

// GPOS: os lookups de ajuste de par (tipo 2, ou tipo 9 que o envolve) das features 'kern' de todos os scripts; o
// ajuste é o XAdvance do primeiro glifo. Formatos 1 (pares por glifo) e 2 (pares por classe).
function lerGpos(b, base) {
  const u16 = (o) => b.readUInt16BE(o);
  const i16 = (o) => b.readInt16BE(o);
  const listaDeFeatures = base + u16(base + 6);
  const listaDeLookups = base + u16(base + 8);
  const indices = new Set();
  for (let i = 0; i < u16(listaDeFeatures); i++) {
    const r = listaDeFeatures + 2 + 6 * i;
    if (b.toString('ascii', r, r + 4) !== 'kern') continue;
    const f = listaDeFeatures + u16(r + 4);
    for (let k = 0; k < u16(f + 2); k++) indices.add(u16(f + 4 + 2 * k));
  }
  const cobertura = (o) => {
    const mapa = new Map();
    if (u16(o) === 1) for (let i = 0; i < u16(o + 2); i++) mapa.set(u16(o + 4 + 2 * i), i);
    else for (let i = 0; i < u16(o + 2); i++) {
      const r = o + 4 + 6 * i;
      for (let g = u16(r); g <= u16(r + 2); g++) mapa.set(g, u16(r + 4) + g - u16(r));
    }
    return mapa;
  };
  const classes = (o) => {
    const mapa = new Map();
    if (u16(o) === 1) for (let i = 0; i < u16(o + 4); i++) mapa.set(u16(o + 2) + i, u16(o + 6 + 2 * i));
    else for (let i = 0; i < u16(o + 2); i++) {
      const r = o + 4 + 6 * i;
      for (let g = u16(r); g <= u16(r + 2); g++) mapa.set(g, u16(r + 4));
    }
    return mapa;
  };
  const bits = (v) => { let n = 0; for (let x = v; x !== 0; x >>= 1) n += x & 1; return n; };
  const lookups = [];
  for (const indice of [...indices].sort((x, y) => x - y)) {
    const l = listaDeLookups + u16(listaDeLookups + 2 + 2 * indice);
    const tipo = u16(l);
    const subtabelas = [];
    for (let s = 0; s < u16(l + 4); s++) {
      let st = l + u16(l + 6 + 2 * s);
      if (tipo === 9) { if (u16(st + 2) !== 2) continue; st += b.readUInt32BE(st + 4); } else if (tipo !== 2) continue;
      const formato = u16(st);
      const vf1 = u16(st + 4);
      const vf2 = u16(st + 6);
      const xAdv = (vf1 & 4) === 0 ? null : 2 * bits(vf1 & 3);
      const tam1 = 2 * bits(vf1);
      const tam2 = 2 * bits(vf2);
      const cob = cobertura(st + u16(st + 2));
      if (formato === 1) {
        const conjuntos = [];
        for (let p = 0; p < u16(st + 8); p++) conjuntos.push(st + u16(st + 10 + 2 * p));
        subtabelas.push((g1, g2) => {
          const c = cob.get(g1);
          if (c === undefined) return null;
          const ps = conjuntos[c];
          for (let k = 0; k < u16(ps); k++) {
            const r = ps + 2 + k * (2 + tam1 + tam2);
            if (u16(r) === g2) return xAdv === null ? 0 : i16(r + 2 + xAdv);
          }
          return null;
        });
      } else if (formato === 2) {
        const cd1 = classes(st + u16(st + 8));
        const cd2 = classes(st + u16(st + 10));
        const n2 = u16(st + 14);
        subtabelas.push((g1, g2) => {
          if (!cob.has(g1)) return null;
          const r = st + 16 + ((cd1.get(g1) ?? 0) * n2 + (cd2.get(g2) ?? 0)) * (tam1 + tam2);
          return xAdv === null ? 0 : i16(r + xAdv);
        });
      }
    }
    lookups.push(subtabelas);
  }
  const memo = new Map();
  return (g1, g2) => {
    const chave = g1 * 65536 + g2;
    let v = memo.get(chave);
    if (v === undefined) {
      v = 0;
      for (const subtabelas of lookups) for (const st of subtabelas) { const a = st(g1, g2); if (a !== null) { v += a; break; } }
      memo.set(chave, v);
    }
    return v;
  };
}

function largura(fonte, texto, tamanho, comKern) {
  let soma = 0;
  let anterior = null;
  for (const ch of texto) {
    const g = fonte.glifo.get(ch.codePointAt(0)) ?? 0;
    soma += fonte.avancos[Math.min(g, fonte.avancos.length - 1)];
    if (comKern === 'kern' && anterior !== null) soma += fonte.kern.get(anterior * 65536 + g) ?? 0;
    if (comKern === 'gpos' && anterior !== null && fonte.gpos !== null) soma += fonte.gpos(anterior, g);
    anterior = g;
  }
  return (soma * tamanho) / fonte.unidades;
}

// ---------------------------------------------------------------- textos
const planos = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (typeof v === 'string' ? [v] : planos(v, `${p}${k}.`)));
const textos = [...new Set([...planos(JSON.parse(fs.readFileSync('src/i18n/locales/pt-BR.json', 'utf8'))), ...planos(JSON.parse(fs.readFileSync('src/i18n/locales/en.json', 'utf8')))])].filter((t) => t.length > 0 && !t.includes('\n'));

const fontes = { 400: lerFonte(FONTES[400]), 600: lerFonte(FONTES[600]) };
const t0 = performance.now();
const calculado = CONFIGURACOES.map(([tamanho, peso]) => textos.map((t) => [largura(fontes[peso], t, tamanho, null), largura(fontes[peso], t, tamanho, 'kern'), largura(fontes[peso], t, tamanho, 'gpos')]));
const msNode = performance.now() - t0;

// ---------------------------------------------------------------- o Chrome
const navegador = await chromium.launch({ channel: 'chrome', headless: true });
const pagina = await navegador.newPage();
await pagina.setContent('<!doctype html><html><body></body></html>');
const t1 = performance.now();
const medido = await pagina.evaluate(({ textos, configuracoes }) => configuracoes.map(([tamanho, peso]) => {
  const raiz = globalThis.document.createElement('div');
  globalThis.document.body.append(raiz);
  const spans = textos.map((t) => {
    const s = globalThis.document.createElement('span');
    s.style.cssText = `font-family:"Segoe UI Variable Text","Segoe UI",system-ui,sans-serif;font-size:${tamanho}px;font-weight:${peso};white-space:pre;position:absolute;left:0;top:0`;
    s.textContent = t;
    raiz.append(s);
    return s;
  });
  const larguras = spans.map((s) => s.getBoundingClientRect().width);
  raiz.remove();
  return larguras;
}), { textos, configuracoes: CONFIGURACOES });
const msChrome = performance.now() - t1;
await navegador.close();

// ---------------------------------------------------------------- comparação
const linhas = [`textos distintos: ${textos.length}`, `Node, cálculo de ${textos.length * CONFIGURACOES.length * 3} larguras: ${msNode.toFixed(0)} ms`, `Chrome, medição de ${textos.length * CONFIGURACOES.length} larguras: ${msChrome.toFixed(0)} ms`, ''];
const percentil = (v, p) => [...v].sort((a, b) => a - b)[Math.min(v.length - 1, Math.floor(p * v.length))];
for (const [k, [tamanho, peso]] of CONFIGURACOES.entries()) {
  for (const [modo, indice] of [['sem kerning', 0], ['tabela kern', 1], ['GPOS kern', 2]]) {
    const erros = textos.map((_, i) => calculado[k][i][indice] - medido[k][i]);
    const abs = erros.map(Math.abs);
    const rel = textos.map((_, i) => abs[i] / Math.max(1, medido[k][i]));
    const dentro = (lim) => ((100 * abs.filter((e) => e <= lim).length) / abs.length).toFixed(1);
    const pior = abs.indexOf(Math.max(...abs));
    linhas.push(`${tamanho}px peso ${peso}, ${modo}: |erro| mediano ${percentil(abs, 0.5).toFixed(3)} px, p95 ${percentil(abs, 0.95).toFixed(3)} px, máximo ${abs[pior].toFixed(3)} px (relativo p95 ${(100 * percentil(rel, 0.95)).toFixed(2)}%); até 0,5 px: ${dentro(0.5)}%; até 1 px: ${dentro(1)}%; até 2 px: ${dentro(2)}%; erro médio com sinal ${(erros.reduce((a, b) => a + b, 0) / erros.length).toFixed(3)} px; pior texto com ${textos[pior].length} caracteres`);
  }
}
fs.writeFileSync(SAIDA, `${linhas.join('\n')}\n`);
console.log(linhas.join('\n'));
