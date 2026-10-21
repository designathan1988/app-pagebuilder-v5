// Proof of concept C5: the properties every value field must satisfy, checked with fast-check over the real reader
// and writer (readValue of src/core/style/set.ts, the codecs of src/core/style/codecs.ts) for every manifest property
// that offers units, without a browser:
//  - idempotence: the text the field saves, read again, saves the same text (format(parse(x)) stable);
//  - grammar: the saved text is a value the browsers' syntax accepts for the property (the css-tree lexer that
//    src/manifest/css.ts builds, matchImplemented), in place of CSS.supports, which only the browser has;
//  - number preserved: "12.5px" saves 12.5 in the same unit, rounded to four decimal places;
//  - acceptance: a value the browsers' syntax accepts and that is a number with an offered unit is not refused.
// Writes the counts and the first counterexamples to resultados.txt.
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

const OUTPUT = 'auditoria/investigacao/poc/c5-campos/resultados.txt';
const memory = (): { read(): string | null; write(text: string): void } => {
  let g: string | null = null;
  return { read: () => g, write: (t) => void (g = t) };
};

it('value fields satisfy round trip, grammar and preservation', () => {
  const start = Date.now();
  const document = JSON.parse(fs.readFileSync('manifest/features/fixtures/aurora.json', 'utf8')) as DocumentJson;
  const store = createEditorStore({ storage: memory(), workspace: memory(), clock: manualClock(0), ids: sequentialIds('c'), restored: { document, selection: [] }, freeze: true });
  const context = { state: store.getState(), rules: MODEL_RULES, css: anyCss, words: (k: string, p?: Record<string, string | number>) => translate('pt-BR', k as never, p ?? {}) } as unknown as Parameters<typeof readValue>[0];
  const properties = manifest.properties.properties.map((p) => p.id).filter((id) => factsOf(id, MODEL_RULES).units.length > 0);
  const breaks: Record<string, string[]> = { idempotence: [], grammar: [], number: [], refusal: [], exception: [] };
  let cases = 0;
  const record = (kind: string, text: string) => {
    const list = breaks[kind] as string[];
    list.push(text);
  };
  for (const property of properties) {
    const { units } = factsOf(property, MODEL_RULES);
    const number = fc.oneof(
      fc.double({ min: -1e6, max: 1e6, noNaN: true, noDefaultInfinity: true }).map((n) => String(n)),
      fc.integer({ min: -2000, max: 2000 }).map(String),
      fc.constantFrom('0', '-0', '.5', '5.', '0.00001', '1e3', '1,5', '+3', '-.25', '12.345678'),
    );
    const text = fc.tuple(number, fc.constantFrom(...units, ''), fc.constantFrom('', ' ')).map(([n, u, e]) => `${n}${e}${u}`);
    fc.assert(
      fc.property(text, (x) => {
        cases += 1;
        try {
          const read = readValue(context, property, x);
          const syntaxAccepted = matchImplemented(property, x) === null;
          if (read === null) {
            if (syntaxAccepted && /^[+-]?(\d+\.?\d*|\.\d+)[a-z%]+$/i.test(x)) record('refusal', `${property}: "${x}"`);
            return;
          }
          const again = readValue(context, property, read.css);
          if (again === null || again.css !== read.css) record('idempotence', `${property}: "${x}" saved "${read.css}", which read again saves ${again === null ? 'nothing' : `"${again.css}"`}`);
          const error = matchImplemented(property, read.css);
          if (error !== null) record('grammar', `${property}: "${x}" saved "${read.css}", refused by the syntax (${error.slice(0, 60)})`);
          // the saved text keeps the typed number with up to four decimal places (writeNumber) and the typed unit
          const m = /^([+-]?(?:\d+\.?\d*|\.\d+))([a-z%]+)$/i.exec(x.trim());
          const g = /^([+-]?(?:\d+\.?\d*|\.\d+))([a-z%]*)$/i.exec(read.css.trim());
          if (m !== null && g !== null) {
            const expected = Math.round(Number(m[1]) * 10_000) / 10_000;
            const unit = expected === 0 || (g[2] as string).toLowerCase() === (m[2] as string).toLowerCase();
            if (Math.abs(Number(g[1]) - expected) > 1e-9 || !unit) record('number', `${property}: "${x}" saved "${read.css}"`);
          }
        } catch (e) {
          record('exception', `${property}: "${x}" threw ${String(e).slice(0, 120)}`);
        }
      }),
      { seed: 20261008, numRuns: 200 },
    );
  }
  const lines = [
    `properties with units: ${properties.length}; cases: ${cases}; time: ${Date.now() - start} ms`,
    ...Object.entries(breaks).map(([kind, list]) => {
      const perProperty = new Map<string, number>();
      for (const l of list) perProperty.set(l.split(':')[0] as string, (perProperty.get(l.split(':')[0] as string) ?? 0) + 1);
      return `${kind}: ${list.length} (${[...perProperty].map(([p, n]) => `${p} ${n}`).join(', ')})`;
    }),
    '',
    // two examples of each property, for each kind
    ...Object.entries(breaks).flatMap(([kind, list]) => {
      const seen = new Map<string, number>();
      const examples = [...new Set(list)].filter((l) => {
        const p = l.split(':')[0] as string;
        seen.set(p, (seen.get(p) ?? 0) + 1);
        return (seen.get(p) ?? 0) <= 2;
      });
      return [`examples of ${kind}:`, ...examples.map((l) => `  ${l}`)];
    }),
  ];
  fs.writeFileSync(OUTPUT, `${lines.join('\n')}\n`);
});
