// The two catalogues against each other (the investigation's C8, "i18n completeness" without a browser): the keys of
// src/i18n/locales/en.json and of pt-BR.json are the same set, every key of one has its placeholders in the other, no
// text is empty, and every plural form the code takes by a count (.one, .other) exists in both. The source is read
// from the disk with the passage of the mutant under run swapped (tools/runner/mutants.ts), so a key taken from a
// catalogue is accused here. What this group does not see — a Portuguese text left in English, a text too long for
// its column — needs the browser (the screen guard's family `english`, C4).
import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { placeholders } from '../../../src/manifest/check/base.ts';
import { mutatedSource } from '../mutants.ts';
import { translate } from '../../../src/i18n/index.ts';
import type { CommandId, MessageId } from '../../../src/generated/ids.ts';
import { manualClock } from '../../../src/core/ports/clock.ts';
import { sequentialIds } from '../../../src/core/ports/ids.ts';
import { createEditorStore } from '../../../src/editor/store.ts';
import { fixture } from './harness.ts';

const memory = (): { read(): string | null; write(text: string): void } => ({ read: () => null, write: () => undefined });

const LOCALES = ['en', 'pt-BR'] as const;
type Locale = (typeof LOCALES)[number];

const fileOf = (locale: Locale): string => `src/i18n/locales/${locale}.json`;
const read = (locale: Locale): Readonly<Record<string, string>> =>
  JSON.parse(mutatedSource(fileOf(locale), fs.readFileSync(fileOf(locale), 'utf8'))) as Readonly<Record<string, string>>;

// the placeholders of a text as a stable list (the order a text names them is the author's, not a rule)
const holes = (text: string): readonly string[] => [...placeholders(text)].sort();

// every source file of the application, so a plural base used with a count can be found where it is written
function sourceFiles(): readonly string[] {
  return (fs.readdirSync('src', { recursive: true }) as string[])
    .map((one) => `src/${one.replace(/\\/g, '/')}`)
    .filter((one) => /\.(ts|tsx)$/.test(one) && !one.endsWith('.test.ts'));
}
// The bases a count takes a plural of (src/core/commands/registry.ts, MessageParam): the catalogue names beside a
// `plural:` argument and the prefix of a `${pluralForm(` in a template literal. A base named by a variable at run
// time (a command's own message key) cannot be read here, and the type PluralBase does not carry it either.
function pluralBases(): readonly string[] {
  const bases = new Set<string>();
  for (const file of sourceFiles()) {
    const text = mutatedSource(file, fs.readFileSync(file, 'utf8'));
    for (const found of text.matchAll(/plural:\s*'([A-Za-z][A-Za-z0-9.]*)'/g)) bases.add(found[1] ?? '');
    for (const found of text.matchAll(/`([A-Za-z][A-Za-z0-9.]*)\.\$\{pluralForm\(/g)) bases.add(found[1] ?? '');
  }
  return [...bases].sort();
}

// The keys the code passes a count to (translate and message take its plural form .one by it, the key itself serving
// the other numbers): what is written as t('key', { count, … }), message('key', { count, … }) or
// translate(locale, 'key', { count, … }) (DEF-0547: the check above saw only the bases of `plural:` and pluralForm).
function countedKeys(): readonly string[] {
  const keys = new Set<string>();
  for (const file of sourceFiles()) {
    const text = mutatedSource(file, fs.readFileSync(file, 'utf8'));
    for (const found of text.matchAll(/['"]([A-Za-z][A-Za-z0-9.]*)['"]\s*(?:as [A-Za-z]+\s*)?,\s*\{[^}]*\bcount\b/g)) keys.add(found[1] ?? '');
  }
  return [...keys].sort();
}

describe('the two message catalogues', () => {
  it('have the same keys, in both directions', () => {
    const [first, ...others] = LOCALES;
    const base = read(first);
    const missing: string[] = [];
    for (const locale of others) {
      const other = read(locale);
      for (const key of Object.keys(base)) if (!(key in other)) missing.push(`${key} is in ${first} and missing from ${locale}`);
      for (const key of Object.keys(other)) if (!(key in base)) missing.push(`${key} is in ${locale} and missing from ${first}`);
    }
    expect(missing, 'keys of one language with no match in the other').toEqual([]);
  });

  it('have the same placeholders in each key', () => {
    const [first, ...others] = LOCALES;
    const base = read(first);
    const broken: string[] = [];
    for (const locale of others) {
      const other = read(locale);
      for (const key of Object.keys(base)) {
        const a = base[key];
        const b = other[key];
        if (typeof a !== 'string' || typeof b !== 'string') continue;
        const [x, y] = [holes(a), holes(b)];
        if (x.join(',') !== y.join(',')) broken.push(`${key}: {${x.join('}, {')}} in ${first}, {${y.join('}, {')}} in ${locale}`);
      }
    }
    expect(broken, 'keys with different placeholders between the languages').toEqual([]);
  });

  it('have no empty key and no empty text', () => {
    const found: string[] = [];
    for (const locale of LOCALES) {
      for (const [key, text] of Object.entries(read(locale))) {
        if (!/^[A-Za-z][A-Za-z0-9.-]*$/.test(key)) found.push(`${locale}: the key "${key}" is not a message name`);
        if (typeof text !== 'string' || text.trim() === '') found.push(`${locale}: "${key}" is empty`);
      }
    }
    expect(found, 'keys out of format or empty').toEqual([]);
  });

  it('every base the code counts has both plural forms in both languages', () => {
    const bases = pluralBases();
    expect(bases.length, 'the code counts plurals somewhere').toBeGreaterThan(0);
    const found: string[] = [];
    for (const locale of LOCALES) {
      const catalogue = read(locale);
      for (const base of bases) {
        for (const form of ['one', 'other']) {
          if (!(`${base}.${form}` in catalogue)) found.push(`${locale}: "${base}.${form}" is missing (the base "${base}" is counted with a number)`);
        }
      }
    }
    expect(found, 'plural forms of a counted base').toEqual([]);
  });

  it('every key counted by count that has the form for one in one language has it in the other, and a count of one says the singular', () => {
    const counted = countedKeys();
    expect(counted.length, 'the code passes count to some key').toBeGreaterThan(50);
    const catalogues = LOCALES.map((locale) => [locale, read(locale)] as const);
    const found: string[] = [];
    for (const key of counted) {
      const holders = catalogues.filter(([, catalogue]) => `${key}.one` in catalogue).map(([locale]) => locale);
      if (holders.length > 0 && holders.length < catalogues.length) for (const [locale] of catalogues) if (!holders.includes(locale)) found.push(`${locale}: "${key}.one" is missing (the key is counted by count, and ${holders.join(', ')} has it)`);
    }
    expect(found, 'forms for one missing in a language').toEqual([]);
    // the counts of one that read a plural noun without it (DEF-0547)
    const plural: string[] = [];
    for (const [locale] of catalogues)
      for (const [key, noun] of [['capture.editor.missingResources', locale === 'en' ? 'resources' : 'recursos'], ['canvas.selectedCount', locale === 'en' ? 'elements' : 'elementos'], ['inspector.elementCount', locale === 'en' ? 'elements' : 'elementos']] as const)
        if (translate(locale, key as MessageId, { count: 1 }).includes(noun)) plural.push(`${locale}: ${key} with 1 says "${noun}"`);
    expect(plural, 'counts of one in the plural').toEqual([]);
  });

  // A file refused at File › Open says why in the words of the interface's language: never a text of its own, an
  // error's or the validator's prose in English (DCS-003, DEF-0549).
  it('the refusal to open a file says the reason in the words of the catalogue', () => {
    const store = createEditorStore({ storage: memory(), workspace: memory(), clock: manualClock(1_000_000), ids: sequentialIds('i'), restored: { document: fixture('aurora'), selection: [] }, ports: { readOnly: () => false }, freeze: true });
    const opened = (file: string) => {
      (store.dispatch as (id: CommandId, args: unknown) => unknown)('project.open' as CommandId, { file });
      return store.getState().message;
    };
    const files: readonly (readonly [string, string])[] = [
      ['a text that is not JSON', 'x{'],
      ['a JSON that is not a document', '{"hello":1}'],
      ['a version with no migration step', '{"version":0.5,"pages":[]}'],
      ['a document the validation refuses', JSON.stringify({ version: 4, pages: [{ id: 'p', name: 'Home', file: 'index.html', tree: { id: 'r', type: 'page', name: 'Page', tag: 'body', attributes: {}, classes: [], styles: {}, text: null, children: [{ id: 'x', type: 'blink', name: 'x', tag: 'div', attributes: {}, classes: [], styles: {}, text: null, children: [] }] } }] })],
    ];
    const found: string[] = [];
    for (const [name, file] of files) {
      const said = opened(file);
      const reason = (said?.params as { reason?: unknown } | undefined)?.reason;
      if (said?.key !== 'status.open.invalidArchive') found.push(`${name}: the refusal was not the open one (${said?.key ?? 'none'})`);
      else if (reason === null || typeof reason !== 'object' || !('key' in reason)) found.push(`${name}: the reason is a raw text (${String(reason)})`);
    }
    expect(found, 'open refusals with a reason outside the catalogue').toEqual([]);
  });
});
