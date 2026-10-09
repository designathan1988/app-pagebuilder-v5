// The interface's text against the space its own label has (the investigation's C4, MEC-20; DEF-0573): for every door
// whose control draws a text of the interface, that text in pt-BR and in English has to fit the space measured for
// that door's label (tools/ui-fit/measure.spec.ts, three screen conditions), with 1 px of slack. The width of a text is
// computed from the face itself (tools/ui-fit/font.ts, no browser), and the text is the catalogue's as it reads now
// (the catalogues are read with the mutant's passage swapped). The measurement was taken with the stylesheets of now (a
// stylesheet that changed, the mutant of `--size-inspector` among them, makes it stale), and every door whose label no
// measurement reaches lies in a region whose reason is written (tools/ui-fit/check.ts, UNMEASURED_REASONS). The
// pseudo-expansion is reported in .cache/model/ui-fit-pseudo.json, not failed (decisoes.md, DCS-024).
import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { uiFitFromDisk } from '../../ui-fit/check.ts';

const report = uiFitFromDisk();
fs.mkdirSync('.cache/model', { recursive: true });
fs.writeFileSync('.cache/model/ui-fit-pseudo.json', JSON.stringify(report.stretched.map((f) => `${f.region} ${f.ref}: ${f.need.toFixed(1)} px em ${f.column.toFixed(1)} px`), null, 1));
fs.writeFileSync('.cache/model/ui-fit-nao-medidas.json', JSON.stringify(report.unmeasured, null, 1));

describe('o texto da interface no espaço do seu rótulo', () => {
  it('a medida foi tomada com as folhas de estilo de agora', () => {
    expect(report.stale, 'manifest/generated/ui-widths.json é de outras folhas de estilo: rode npm run ui-fit:measure nas três condições').toBe(false);
  });

  it('o texto de cada porta, em pt-BR e em inglês, cabe no espaço do seu rótulo, com 1 px de folga', () => {
    const described = report.findings.map((f) => `${f.region} ${f.ref} "${f.text}": ${f.need.toFixed(1)} px em ${f.column.toFixed(1)} px`);
    expect(described, 'textos que não cabem no espaço do seu rótulo').toEqual([]);
  });

  it('toda porta com rótulo foi medida, ou está numa região cujo motivo de não ser medida está escrito', () => {
    expect(report.unmeasured.length + report.textless.length, 'a conta das portas não medidas e das sem texto foi feita').toBeGreaterThan(0);
    expect(report.unexplained.map((one) => `${one.region} › ${one.ref}`), 'portas com rótulo não medidas, numa região sem motivo').toEqual([]);
  });
});
