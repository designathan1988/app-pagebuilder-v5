// Prova de conceito C5: as propriedades que todo campo de valor precisa cumprir, conferidas com fast-check sobre o
// leitor e o escritor reais (readValue de src/core/style/set.ts, os codecs de src/core/style/codecs.ts) para toda
// propriedade do manifesto que oferece unidades, sem navegador:
//  - idempotência: o texto que o campo grava, lido de novo, grava o mesmo texto (format(parse(x)) estável);
//  - gramática: o texto gravado é um valor que a sintaxe dos navegadores aceita para a propriedade (o lexer do
//    css-tree que src/manifest/css.ts monta, matchImplemented), no lugar do CSS.supports que só o navegador tem;
//  - número preservado: "12.5px" grava 12.5 na mesma unidade, arredondado a quatro casas;
//  - aceitação: um valor que a sintaxe dos navegadores aceita e que é um número com unidade oferecida não é recusado.
// Escreve as contagens e os primeiros contraexemplos em resultados.txt.
import fs from 'node:fs';
import fc from 'fast-check';
import { it } from 'vitest';
import type { DocumentJson } from '../../../../src/core/document/model.ts';
import { anyCss } from '../../../../src/core/ports/css.ts';
import { manualClock } from '../../../../src/core/ports/clock.ts';
import { sequentialIds } from '../../../../src/core/ports/ids.ts';
import { factsOf, readValue } from '../../../../src/core/style/set.ts';
import { createEditorStore, MODEL_RULES } from '../../../../src/editor/store.ts';
import { translate } from '../../../../src/i18n/index.ts';
import { matchImplemented } from '../../../../src/manifest/css.ts';
import { manifest } from '../../../../src/manifest/runtime.ts';

const SAIDA = 'auditoria/investigacao/poc/c5-campos/resultados.txt';
const memoria = (): { read(): string | null; write(text: string): void } => {
  let g: string | null = null;
  return { read: () => g, write: (t) => void (g = t) };
};

it('os campos de valor cumprem ida e volta, gramática e preservação', () => {
  const inicio = Date.now();
  const documento = JSON.parse(fs.readFileSync('manifest/features/fixtures/aurora.json', 'utf8')) as DocumentJson;
  const store = createEditorStore({ storage: memoria(), workspace: memoria(), clock: manualClock(0), ids: sequentialIds('c'), restored: { document: documento, selection: [] }, freeze: true });
  const contexto = { state: store.getState(), rules: MODEL_RULES, css: anyCss, words: (k: string, p?: Record<string, string | number>) => translate('pt-BR', k as never, p ?? {}) } as unknown as Parameters<typeof readValue>[0];
  const propriedades = manifest.properties.properties.map((p) => p.id).filter((id) => factsOf(id, MODEL_RULES).units.length > 0);
  const quebras: Record<string, string[]> = { idempotencia: [], gramatica: [], numero: [], recusa: [], excecao: [] };
  let casos = 0;
  const anotar = (tipo: string, texto: string) => {
    const lista = quebras[tipo] as string[];
    lista.push(texto);
  };
  for (const propriedade of propriedades) {
    const { units } = factsOf(propriedade, MODEL_RULES);
    const numero = fc.oneof(
      fc.double({ min: -1e6, max: 1e6, noNaN: true, noDefaultInfinity: true }).map((n) => String(n)),
      fc.integer({ min: -2000, max: 2000 }).map(String),
      fc.constantFrom('0', '-0', '.5', '5.', '0.00001', '1e3', '1,5', '+3', '-.25', '12.345678'),
    );
    const texto = fc.tuple(numero, fc.constantFrom(...units, ''), fc.constantFrom('', ' ')).map(([n, u, e]) => `${n}${e}${u}`);
    fc.assert(
      fc.property(texto, (x) => {
        casos += 1;
        try {
          const lido = readValue(contexto, propriedade, x);
          const sintaxeAceita = matchImplemented(propriedade, x) === null;
          if (lido === null) {
            if (sintaxeAceita && /^[+-]?(\d+\.?\d*|\.\d+)[a-z%]+$/i.test(x)) anotar('recusa', `${propriedade}: "${x}"`);
            return;
          }
          const denovo = readValue(contexto, propriedade, lido.css);
          if (denovo === null || denovo.css !== lido.css) anotar('idempotencia', `${propriedade}: "${x}" gravou "${lido.css}", que lido de novo grava ${denovo === null ? 'nada' : `"${denovo.css}"`}`);
          const erro = matchImplemented(propriedade, lido.css);
          if (erro !== null) anotar('gramatica', `${propriedade}: "${x}" gravou "${lido.css}", recusado pela sintaxe (${erro.slice(0, 60)})`);
          // o texto gravado guarda o número digitado com até quatro casas (writeNumber) e a unidade digitada
          const m = /^([+-]?(?:\d+\.?\d*|\.\d+))([a-z%]+)$/i.exec(x.trim());
          const g = /^([+-]?(?:\d+\.?\d*|\.\d+))([a-z%]*)$/i.exec(lido.css.trim());
          if (m !== null && g !== null) {
            const esperado = Math.round(Number(m[1]) * 10_000) / 10_000;
            const unidade = esperado === 0 || (g[2] as string).toLowerCase() === (m[2] as string).toLowerCase();
            if (Math.abs(Number(g[1]) - esperado) > 1e-9 || !unidade) anotar('numero', `${propriedade}: "${x}" gravou "${lido.css}"`);
          }
        } catch (e) {
          anotar('excecao', `${propriedade}: "${x}" lançou ${String(e).slice(0, 120)}`);
        }
      }),
      { seed: 20261008, numRuns: 200 },
    );
  }
  const linhas = [
    `propriedades com unidades: ${propriedades.length}; casos: ${casos}; tempo: ${Date.now() - inicio} ms`,
    ...Object.entries(quebras).map(([tipo, lista]) => {
      const porPropriedade = new Map<string, number>();
      for (const l of lista) porPropriedade.set(l.split(':')[0] as string, (porPropriedade.get(l.split(':')[0] as string) ?? 0) + 1);
      return `${tipo}: ${lista.length} (${[...porPropriedade].map(([p, n]) => `${p} ${n}`).join(', ')})`;
    }),
    '',
    // dois exemplos de cada propriedade, em cada tipo
    ...Object.entries(quebras).flatMap(([tipo, lista]) => {
      const vistos = new Map<string, number>();
      const exemplos = [...new Set(lista)].filter((l) => {
        const p = l.split(':')[0] as string;
        vistos.set(p, (vistos.get(p) ?? 0) + 1);
        return (vistos.get(p) ?? 0) <= 2;
      });
      return [`exemplos de ${tipo}:`, ...exemplos.map((l) => `  ${l}`)];
    }),
  ];
  fs.writeFileSync(SAIDA, `${linhas.join('\n')}\n`);
});
