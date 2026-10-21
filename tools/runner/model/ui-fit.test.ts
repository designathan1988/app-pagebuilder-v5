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
fs.writeFileSync('.cache/model/ui-fit-pseudo.json', JSON.stringify(report.stretched.map((f) => `${f.region} ${f.ref}: ${f.need.toFixed(1)} px in ${f.column.toFixed(1)} px`), null, 1));
fs.writeFileSync('.cache/model/ui-fit-unmeasured.json', JSON.stringify(report.unmeasured, null, 1));

describe('the interface text in the space of its label', () => {
  it('the measurement was taken with the current stylesheets', () => {
    expect(report.stale, 'manifest/generated/ui-widths.json is from other stylesheets: run npm run ui-fit:measure in the three conditions').toBe(false);
  });

  it('the text of each door, in pt-BR and in English, fits in the space of its label, with 1 px to spare', () => {
    const described = report.findings.map((f) => `${f.region} ${f.ref} "${f.text}": ${f.need.toFixed(1)} px in ${f.column.toFixed(1)} px`);
    expect(described, 'texts that do not fit in the space of their label').toEqual([]);
  });

  it('every door with a label was measured, or is in a region whose reason for not being measured is written', () => {
    expect(report.unmeasured.length + report.textless.length, 'the count of the unmeasured doors and of the textless ones was made').toBeGreaterThan(0);
    expect(report.unexplained.map((one) => `${one.region} › ${one.ref}`), 'labelled doors not measured, in a region with no reason').toEqual([]);
  });
});
