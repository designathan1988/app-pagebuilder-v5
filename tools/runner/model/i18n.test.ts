// The two catalogues against each other (the investigation's C8, "completude do i18n" without a browser): the keys of
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
import type { MessageId } from '../../../src/generated/ids.ts';

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

describe('os dois catálogos de mensagens', () => {
  it('têm as mesmas chaves, nos dois sentidos', () => {
    const [first, ...others] = LOCALES;
    const base = read(first);
    const missing: string[] = [];
    for (const locale of others) {
      const other = read(locale);
      for (const key of Object.keys(base)) if (!(key in other)) missing.push(`${key} está em ${first} e falta em ${locale}`);
      for (const key of Object.keys(other)) if (!(key in base)) missing.push(`${key} está em ${locale} e falta em ${first}`);
    }
    expect(missing, 'chaves de um idioma sem par no outro').toEqual([]);
  });

  it('têm os mesmos placeholders em cada chave', () => {
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
        if (x.join(',') !== y.join(',')) broken.push(`${key}: {${x.join('}, {')}} em ${first}, {${y.join('}, {')}} em ${locale}`);
      }
    }
    expect(broken, 'chaves com placeholders diferentes entre os idiomas').toEqual([]);
  });

  it('não têm chave vazia nem texto vazio', () => {
    const found: string[] = [];
    for (const locale of LOCALES) {
      for (const [key, text] of Object.entries(read(locale))) {
        if (!/^[A-Za-z][A-Za-z0-9.-]*$/.test(key)) found.push(`${locale}: a chave "${key}" não é um nome de mensagem`);
        if (typeof text !== 'string' || text.trim() === '') found.push(`${locale}: "${key}" está vazia`);
      }
    }
    expect(found, 'chaves fora do formato ou vazias').toEqual([]);
  });

  it('toda base que o código conta tem as duas formas plurais nos dois idiomas', () => {
    const bases = pluralBases();
    expect(bases.length, 'o código conta plurais em algum lugar').toBeGreaterThan(0);
    const found: string[] = [];
    for (const locale of LOCALES) {
      const catalogue = read(locale);
      for (const base of bases) {
        for (const form of ['one', 'other']) {
          if (!(`${base}.${form}` in catalogue)) found.push(`${locale}: "${base}.${form}" falta (a base "${base}" é contada com um número)`);
        }
      }
    }
    expect(found, 'formas plurais de uma base contada').toEqual([]);
  });

  it('toda chave contada pelo count que tem a forma de um num idioma a tem no outro, e uma contagem de um diz o singular', () => {
    const counted = countedKeys();
    expect(counted.length, 'o código passa count a alguma chave').toBeGreaterThan(50);
    const catalogues = LOCALES.map((locale) => [locale, read(locale)] as const);
    const found: string[] = [];
    for (const key of counted) {
      const holders = catalogues.filter(([, catalogue]) => `${key}.one` in catalogue).map(([locale]) => locale);
      if (holders.length > 0 && holders.length < catalogues.length) for (const [locale] of catalogues) if (!holders.includes(locale)) found.push(`${locale}: "${key}.one" falta (a chave é contada pelo count, e ${holders.join(', ')} a tem)`);
    }
    expect(found, 'formas de um que faltam num idioma').toEqual([]);
    // the counts of one that read a plural noun without it (DEF-0547)
    const plural: string[] = [];
    for (const [locale] of catalogues)
      for (const [key, noun] of [['capture.editor.missingResources', locale === 'en' ? 'resources' : 'recursos'], ['canvas.selectedCount', locale === 'en' ? 'elements' : 'elementos'], ['inspector.elementCount', locale === 'en' ? 'elements' : 'elementos']] as const)
        if (translate(locale, key as MessageId, { count: 1 }).includes(noun)) plural.push(`${locale}: ${key} com 1 diz "${noun}"`);
    expect(plural, 'contagens de um no plural').toEqual([]);
  });
});
