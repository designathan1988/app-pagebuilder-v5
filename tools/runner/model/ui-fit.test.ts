// The interface's text against the column it is drawn in (the investigation's C4, MEC-20): for every door of the
// manifest whose control draws its label, the widest of the label in pt-BR, in English and in the pseudo-expansion has
// to fit the width of its region with 1 px of slack. The width of a label is computed from the face itself
// (tools/ui-fit/font.ts, no browser); the column is a token of src/ui/tokens.css when the region's width is fixed (the
// mutant of `--size-inspector` shows this, since the token is read here with the mutant's passage swapped) and the
// measured widths of manifest/generated/ui-widths.json when it is fluid (tools/ui-fit/measure.spec.ts).
import { describe, expect, it } from 'vitest';
import { uiFitFindingsFromDisk } from '../../ui-fit/check.ts';

describe('o texto da interface na coluna da sua região', () => {
  it('o rótulo mais longo de cada porta cabe na largura da sua região, com 1 px de folga', () => {
    const findings = uiFitFindingsFromDisk();
    const described = findings.map((f) => `${f.region} ${f.ref} (${f.labelKey}): ${f.need.toFixed(1)} px em ${f.column} px`);
    expect(described, 'rótulos que não cabem na coluna da sua região').toEqual([]);
  });
});
