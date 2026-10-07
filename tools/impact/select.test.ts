// The impact selector's rules (select.ts), on synthetic changes over a synthetic map: a local change selects the tests
// that ran it and no others; what every test stands on runs everything, saying why; nothing the map cannot place is
// left out silently.
import { describe, expect, it } from 'vitest';
import { changedOldLines } from './diff.ts';
import { selectorsOn } from './css.ts';
import { selectImpact, type BrowserTest, type Change, type Executed, type ImpactInput } from './select.ts';
import { changedDoors, changedKeys, changedScenarios } from './sources.ts';

const test = (id: string, extra: Partial<BrowserTest> = {}): BrowserTest => ({ id, file: `tests/e2e/${id.split(' › ')[0] ?? ''}`, doors: [], render: false, ...extra });
const TESTS: BrowserTest[] = [
  test('a.spec.ts › one', { doors: ['style.set#inspector-width'] }),
  test('a.spec.ts › two'),
  test('b.spec.ts › three'),
  test('sweep.spec.ts › the screens', { render: true }),
  test('scenarios.spec.ts › f › s1 › d#1', { scenario: 'f › s1', doors: ['d#1'], fixtures: ['aurora'] }),
  test('scenarios.spec.ts › f › s2 › d#2', { scenario: 'f › s2', doors: ['d#2'], fixtures: ['empty'] }),
];
const ran = (lines: Executed['lines'], selectors: string[] = [], keys: string[] = []): Executed => ({ lines, selectors, keys });
// src/x.ts: a module whose top (lines 1-3) every test that loads it runs, and whose functions some run
const MAP = new Map<string, Executed>([
  ['a.spec.ts › one', ran({ 'src/x.ts': [[1, 3], [10, 20]] }, ['.field'], ['status.saved'])],
  ['a.spec.ts › two', ran({ 'src/x.ts': [[1, 3], [30, 40]] }, ['.row'])],
  ['b.spec.ts › three', ran({ 'src/y.ts': [[1, 50]] })],
  ['sweep.spec.ts › the screens', ran({ 'src/x.ts': [[1, 3]] })],
  ['scenarios.spec.ts › f › s1 › d#1', ran({ 'src/x.ts': [[1, 3], [10, 12]] })],
  ['scenarios.spec.ts › f › s2 › d#2', ran({ 'src/y.ts': [[1, 5]] })],
]);
const X = Array.from({ length: 50 }, (_, i) => `line ${i + 1}`).join('\n');
const edit = (text: string, line: number, to: string) => text.split('\n').map((one, i) => (i === line - 1 ? to : one)).join('\n');
const changed = (file: string, older: string, newer: string): Change => ({ file, status: 'changed', older, newer, lines: changedOldLines(older, newer) });
const select = (changes: Change[], over: Partial<ImpactInput> = {}) =>
  selectImpact({ changes, tests: TESTS, map: MAP, selectorsOn, changedScenarios, changedDoors, changedKeys, usersOf: () => [], ...over });
const picked = (impact: ReturnType<typeof select>) => [...impact.browser.keys()].sort();

describe('the impact selector', () => {
  it('selects the tests that ran a changed line of a module, and only them', () => {
    const impact = select([changed('src/x.ts', X, edit(X, 15, 'changed'))]);
    expect(impact.browserAll).toEqual([]);
    expect(picked(impact)).toEqual(['a.spec.ts › one']);
    expect(impact.browser.get('a.spec.ts › one')).toEqual(['it ran src/x.ts:15']);
    expect(impact.unit.related).toEqual(['src/x.ts']);
  });

  it('selects every test that loaded a module when its top changed — and still not the suite', () => {
    const impact = select([changed('src/x.ts', X, edit(X, 2, 'a constant changed'))]);
    expect(impact.browserAll).toEqual([]);
    expect(picked(impact)).toEqual(['a.spec.ts › one', 'a.spec.ts › two', 'scenarios.spec.ts › f › s1 › d#1', 'sweep.spec.ts › the screens']);
  });

  it('selects nothing in the browser for a line no browser test runs, and says so', () => {
    const impact = select([changed('src/x.ts', X, edit(X, 45, 'unreached'))]);
    expect(picked(impact)).toEqual([]);
    expect(impact.notes).toContain('src/x.ts: no browser test runs the lines changed');
  });

  it('runs the whole browser suite for what every browser test stands on, with the reason', () => {
    for (const file of ['tests/support/test.ts', 'tests/e2e/door.ts', 'tools/runner/scenarios.ts', 'playwright.config.ts', 'src/main.tsx', 'src/ui/tokens.css', 'package.json']) {
      const impact = select([changed(file, 'a', 'b')]);
      expect(impact.browserAll, file).toEqual([`${file}: what every browser test stands on`]);
      expect(impact.browser.size).toBe(0);
    }
    expect(select([changed('manifest/properties.json', '{}', '{"x":1}')]).browserAll).toEqual(['manifest/properties.json: a table of the manifest the whole editor reads']);
  });

  it('never leaves a source change unplaced without a map: it runs everything and says why', () => {
    const impact = select([changed('src/x.ts', X, edit(X, 15, 'changed'))], { map: null });
    expect(impact.browserAll).toEqual(['src/x.ts: no coverage map says which browser tests run it']);
  });

  it('runs a changed spec file whole', () => {
    expect(picked(select([changed('tests/e2e/a.spec.ts', 'a', 'b')]))).toEqual(['a.spec.ts › one', 'a.spec.ts › two']);
  });

  it('runs the scenarios a features file changed, and none of the others', () => {
    const older = JSON.stringify({ features: [{ id: 'f', commands: [], scenarios: [{ id: 's1', steps: [1] }, { id: 's2', steps: [2] }] }] });
    const newer = JSON.stringify({ features: [{ id: 'f', commands: [], scenarios: [{ id: 's1', steps: [1, 1] }, { id: 's2', steps: [2] }] }] });
    expect(picked(select([changed('manifest/features/02-x.json', older, newer)]))).toEqual(['scenarios.spec.ts › f › s1 › d#1']);
    // a feature's own fields reach every scenario of it
    const own = JSON.stringify({ features: [{ id: 'f', commands: ['c'], scenarios: [{ id: 's1', steps: [1] }, { id: 's2', steps: [2] }] }] });
    expect(picked(select([changed('manifest/features/02-x.json', older, own)]))).toEqual(['scenarios.spec.ts › f › s1 › d#1', 'scenarios.spec.ts › f › s2 › d#2']);
  });

  it('runs the tests that press a door whose definition changed', () => {
    const older = JSON.stringify({ commands: [{ id: 'style.set', args: {}, entryPoints: [{ id: 'inspector-width', kind: 'inspector-field' }, { id: 'inspector-top', kind: 'inspector-field' }] }] });
    const newer = JSON.stringify({ commands: [{ id: 'style.set', args: {}, entryPoints: [{ id: 'inspector-width', kind: 'inspector-field', unit: 'px' }, { id: 'inspector-top', kind: 'inspector-field' }] }] });
    const impact = select([changed('manifest/commands/style.json', older, newer)]);
    expect(picked(impact)).toEqual(['a.spec.ts › one']);
    expect(impact.browser.get('a.spec.ts › one')).toEqual(['it presses style.set#inspector-width, whose definition changed']);
  });

  it('runs the tests that showed a message whose words changed, and every render test', () => {
    const impact = select([changed('src/i18n/locales/pt-BR.json', '{"status.saved":"Salvo","other":"x"}', '{"status.saved":"Gravado","other":"x"}')]);
    expect(picked(impact)).toEqual(['a.spec.ts › one', 'sweep.spec.ts › the screens']);
  });

  it('runs the tests that used a changed rule, and every render test; a rule the map never saw runs everything', () => {
    const css = '.field {\n  width: 1px;\n}\n.row {\n  height: 2px;\n}\n';
    expect(picked(select([changed('src/editor/shell/x.css', css, css.replace('width: 1px', 'width: 2px'))]))).toEqual(['a.spec.ts › one', 'sweep.spec.ts › the screens']);
    const added = select([changed('src/editor/shell/x.css', css, `${css}.new-rule {\n  color: red;\n}\n`)]);
    expect(added.browserAll).toEqual(['src/editor/shell/x.css: rules the coverage map never saw (.new-rule)']);
  });

  it('runs the scenarios and the specs that open a changed fixture', () => {
    const impact = select([changed('manifest/features/fixtures/aurora.json', '{}', '{"a":1}')], { usersOf: () => ['tests/e2e/b.spec.ts'] });
    expect(picked(impact)).toEqual(['b.spec.ts › three', 'scenarios.spec.ts › f › s1 › d#1']);
  });

  it('places a new module through the modules that import it', () => {
    const impact = select([{ file: 'src/z.ts', status: 'added', newer: 'export const z = 1;' }]);
    expect(picked(impact)).toEqual([]);
    expect(impact.notes[0]).toContain('src/z.ts is new');
  });

  it('runs every unit test when what all of them stand on changed, and the related ones otherwise', () => {
    expect(select([changed('vitest.config.ts', 'a', 'b')]).unit.all).toEqual(['vitest.config.ts: what every unit test stands on']);
    expect(select([changed('src/x.ts', X, edit(X, 15, 'changed'))]).unit).toEqual({ all: [], related: ['src/x.ts'] });
  });

  it('checks the manifest and the generated files when what they come from changed', () => {
    const impact = select([changed('manifest/commands/style.json', '{"commands":[]}', '{"commands":[]}')]);
    expect(impact.manifestCheck).toEqual(['manifest/commands/style.json']);
    expect(impact.genCheck).toEqual(['manifest/commands/style.json']);
  });
});
