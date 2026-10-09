// The contracts of the value fields (the investigation's C5; grown from
// auditoria/investigacao/poc/c5-campos/ida-e-volta.poc.ts), over the real reader and writers (readValue of
// src/core/style/set.ts, the codecs of src/core/style/codecs.ts) and the CSS port of the lexer
// (tools/runner/css-lexer-port.ts), for every contract of tools/runner/contracts.ts:
//  - every property a door of style.set or of a number field writes has a codec registered under the id it names;
//  - round trip: the text written, read again, writes the same text;
//  - grammar: the text written is one the lexer takes for the property;
//  - number kept: a length typed is written with its number at four decimals and its unit (DCS-015), never "-0";
//  - taken: a number in a unit the property offers that the lexer takes is never refused;
//  - the decimal comma of pt-BR reads as a point;
//  - a field's step moves by the manifest's step and factors (Shift, Alt, a page);
//  - every refusal the fields' commands declare has its words in both catalogues.
import fs from 'node:fs';
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { walk, type DocumentJson } from '../../../src/core/document/model.ts';
import { manualClock } from '../../../src/core/ports/clock.ts';
import { sequentialIds } from '../../../src/core/ports/ids.ts';
import { writeNumber } from '../../../src/core/style/codecs.ts';
import { readValue } from '../../../src/core/style/set.ts';
import { storedValue } from '../../../src/core/style/stored.ts';
import { createEditorStore, MODEL_RULES } from '../../../src/editor/store.ts';
import type { CommandId } from '../../../src/generated/ids.ts';
import { translate } from '../../../src/i18n/index.ts';
import { matchImplemented } from '../../../src/manifest/css.ts';
import { fieldContracts, fieldRefusalKeys, STEP_FACTS } from '../contracts.ts';
import { lexerCss } from '../css-lexer-port.ts';

const memory = (): { read(): string | null; write(text: string): void } => {
  let held: string | null = null;
  return { read: () => held, write: (text) => void (held = text) };
};
const document = (): DocumentJson => JSON.parse(fs.readFileSync('manifest/features/fixtures/aurora.json', 'utf8')) as DocumentJson;
const storeOn = () => createEditorStore({ storage: memory(), workspace: memory(), clock: manualClock(0), ids: sequentialIds('c'), restored: { document: document(), selection: [] }, ports: { css: lexerCss, readOnly: () => false }, freeze: true });
const contextOf = (store: ReturnType<typeof storeOn>) => ({ state: store.getState(), rules: MODEL_RULES, css: lexerCss, words: (k: string, p?: Record<string, string | number>) => translate('pt-BR', k as never, p ?? {}) }) as unknown as Parameters<typeof readValue>[0];
const CONTRACTS = fieldContracts();
const NUMBER_WITH_UNIT = /^\s*([+-]?(?:\d+\.?\d*|\.\d+))\s*([a-z%]+)\s*$/i;

describe('os contratos dos campos de valor', () => {
  it('toda propriedade que uma porta de style.set ou de campo escreve tem um codec registrado', () => {
    const missing = CONTRACTS.filter((c) => c.reachedByStyleSet && !c.structured && !c.registered).map((c) => `${c.property} (codec ${c.codec})`);
    expect(missing, 'codec declarado no manifesto e não registrado em src/core/style/codecs.ts').toEqual([]);
  });

  it('ida e volta, gramática, número preservado e aceitação, com a porta do lexer', () => {
    const context = contextOf(storeOn());
    const breaks: string[] = [];
    for (const contract of CONTRACTS.filter((c) => c.kind === 'property' && c.registered && !c.structured && c.units.length > 0)) {
      const number = fc.oneof(
        fc.double({ min: -1e6, max: 1e6, noNaN: true, noDefaultInfinity: true }).map((n) => String(n)),
        fc.integer({ min: -2000, max: 2000 }).map(String),
        fc.constantFrom('0', '-0', '.5', '5.', '0.00001', '1e3', '+3', '-.25', '12.345678', '-0.00001'),
      );
      const text = fc.tuple(number, fc.constantFrom(...contract.units, ''), fc.constantFrom('', ' ')).map(([n, u, gap]) => `${n}${gap}${u}`);
      fc.assert(
        fc.property(text, (typed) => {
          const read = readValue(context, contract.property, typed);
          const plain = NUMBER_WITH_UNIT.exec(typed);
          if (read === null) {
            if (plain !== null && contract.units.includes((plain[2] ?? '').toLowerCase()) && matchImplemented(contract.property, typed.trim()) === null) breaks.push(`recusou ${contract.property}: "${typed}", que a sintaxe aceita numa unidade oferecida`);
            return;
          }
          const again = readValue(context, contract.property, read.css);
          if (again === null || again.css !== read.css) breaks.push(`ida e volta ${contract.property}: "${typed}" gravou "${read.css}", que lido de novo grava ${again === null ? 'nada' : `"${again.css}"`}`);
          if (!lexerCss.supports(contract.property, read.css)) breaks.push(`gramática ${contract.property}: "${typed}" gravou "${read.css}"`);
          if (read.value.kind === 'length' && plain !== null) {
            const expected = writeNumber(Number(plain[1]));
            const written = NUMBER_WITH_UNIT.exec(read.css);
            if (written === null || written[1] !== expected || (expected !== '0' && (written[2] ?? '').toLowerCase() !== (plain[2] ?? '').toLowerCase())) breaks.push(`número ${contract.property}: "${typed}" gravou "${read.css}", esperado ${expected}${plain[2] ?? ''}`);
          }
          // the codecs whose grammar the browser checks keep the text as typed (DCS-015)
          if (read.value.kind === 'length' && /(^|[\s(,])-0(?![.\d])/.test(read.css)) breaks.push(`menos zero ${contract.property}: "${typed}" gravou "${read.css}"`);
        }),
        { seed: 20261008, numRuns: 120 },
      );
    }
    expect(breaks.slice(0, 12)).toEqual([]);
  });

  // The acceptance of the properties with no unit too (the grid lines, the transition lists: DEF-0509's longhands,
  // whose codecs the loop above never reaches; DEF-0560): every keyword a property offers that its syntax takes is
  // read, so a codec registered that refuses every text is accused, not only a codec that is missing.
  it('toda palavra-chave que uma propriedade oferece e a sintaxe aceita é lida, com ou sem unidades', () => {
    const context = contextOf(storeOn());
    const refused: string[] = [];
    let read = 0;
    for (const contract of CONTRACTS.filter((c) => c.kind === 'property' && c.registered && !c.structured)) {
      for (const keyword of contract.keywords) {
        if (matchImplemented(contract.property, keyword) !== null) continue;
        read += 1;
        if (readValue(context, contract.property, keyword) === null) refused.push(`${contract.property} (codec ${contract.codec}): "${keyword}"`);
      }
    }
    expect(read, 'palavras-chave conferidas').toBeGreaterThan(50);
    expect(refused, 'palavras-chave oferecidas e recusadas').toEqual([]);
  });

  it('a vírgula decimal do pt-BR é lida como ponto', () => {
    const context = contextOf(storeOn());
    for (const contract of CONTRACTS.filter((c) => c.kind === 'property' && c.registered && !c.structured && c.units.includes('px'))) {
      const comma = readValue(context, contract.property, '1,5px');
      const point = readValue(context, contract.property, '1.5px');
      // the point is read (a length the property offers): two refusals are no equal reading (DEF-0558)
      expect(point?.css, `${contract.property}: "1.5px" é lido`).toBeDefined();
      expect(comma?.css, `${contract.property}: "1,5px"`).toBe(point?.css);
    }
  });

  it('o passo de campo move pelo passo e pelos fatores do manifesto', () => {
    const cases = [
      { size: 'step', modifier: undefined, delta: STEP_FACTS.step },
      { size: 'step', modifier: 'Shift', delta: STEP_FACTS.step * STEP_FACTS.shiftFactor },
      { size: 'step', modifier: 'Alt', delta: STEP_FACTS.step * STEP_FACTS.altFactor },
      { size: 'page', modifier: undefined, delta: STEP_FACTS.pageStep },
    ] as const;
    for (const { size, modifier, delta } of cases) {
      for (const direction of ['up', 'down'] as const) {
        const store = storeOn();
        const target = [...walk(store.getState().document.pages[0]?.tree ?? ({ children: [] } as never))].find((n) => n.children.length === 0 && n.type !== MODEL_RULES.root.type);
        const dispatch = store.dispatch as (id: CommandId, args: unknown) => { status: string };
        dispatch('selection.select' as CommandId, { target: target?.id });
        dispatch('style.set' as CommandId, { property: 'width', value: '100px' });
        dispatch('field.step' as CommandId, { property: 'width', value: '100px', direction, size, ...(modifier === undefined ? {} : { modifier }) });
        const node = [...walk(store.getState().document.pages[0]?.tree ?? ({ children: [] } as never))].find((n) => n.id === target?.id);
        const expected = `${writeNumber(100 + (direction === 'up' ? delta : -delta))}px`;
        expect(node === undefined ? null : storedValue(node, 'width', MODEL_RULES), `field.step ${direction} ${size} ${modifier ?? ''}`).toBe(expected);
      }
    }
  });

  // Every door of a field hands the text the field holds, empty included, and the command decides what an empty field
  // starts from (startOf: rule G3, DEF-0552): the step and the unit from the same value of the element.
  it('um campo vazio parte do valor do elemento no passo e na troca de unidade', () => {
    const found: string[] = [];
    for (const [command, args, expected] of [['field.step', { direction: 'up', size: 'step' }, `${writeNumber(96 + STEP_FACTS.step)}px`], ['field.setUnit', { unit: 'pt' }, '72pt']] as const) {
      const store = storeOn();
      const target = [...walk(store.getState().document.pages[0]?.tree ?? ({ children: [] } as never))].find((n) => n.children.length === 0 && n.type !== MODEL_RULES.root.type);
      const dispatch = store.dispatch as (id: CommandId, args: unknown) => { status: string };
      dispatch('selection.select' as CommandId, { target: target?.id });
      dispatch('style.set' as CommandId, { property: 'width', value: '96px' });
      const result = dispatch(command as CommandId, { property: 'width', value: '', ...args });
      const node = [...walk(store.getState().document.pages[0]?.tree ?? ({ children: [] } as never))].find((n) => n.id === target?.id);
      const written = node === undefined ? null : storedValue(node, 'width', MODEL_RULES);
      if (written !== expected) found.push(`${command} com o campo vazio: ${result.status}, width ${String(written)} (esperado ${expected})`);
    }
    expect(found, 'comandos de campo que não partem do valor do elemento').toEqual([]);
  });

  it('toda recusa dos comandos de campo e de estilo tem palavras nos dois catálogos', () => {
    const flat = (o: unknown, prefix = ''): string[] => Object.entries(o as Record<string, unknown>).flatMap(([k, v]) => (typeof v === 'string' ? [`${prefix}${k}`] : flat(v, `${prefix}${k}.`)));
    const pt = new Set(flat(JSON.parse(fs.readFileSync('src/i18n/locales/pt-BR.json', 'utf8'))));
    const en = new Set(flat(JSON.parse(fs.readFileSync('src/i18n/locales/en.json', 'utf8'))));
    const missing = fieldRefusalKeys().filter((key) => !pt.has(key) || !en.has(key));
    expect(missing).toEqual([]);
  });
});
