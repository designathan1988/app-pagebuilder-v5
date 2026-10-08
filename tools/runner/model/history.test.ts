// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableCSSFileLoading":true,"handleDisabledFileLoadingAsSuccess":true,"disableJavaScriptFileLoading":true}}
// The model of the history and the selection (tools/runner/model/harness.ts): selections, bursts of a field's arrow
// with waits around the merge window, value writes, undo and redo, typing, presses and gestures.
import fc from 'fast-check';
import { expect, it } from 'vitest';
import { addToSelection, command, nodesOf, pick, PROPERTIES, runModel, VALUES, type Step } from './harness.ts';
import { dispatchOutside } from './harness.ts';

// two arrows on the same field with a wait between them: whether they merge depends on the constant's window
const burst = (p: number, ms: number): Step => ({
  check: () => true,
  run: (m, r) => {
    const property = PROPERTIES[p % 3] as string;
    dispatchOutside(m, r, 'field.step', { direction: 'up', size: 'step', property, value: '10px' });
    r.clock.advance(ms);
    dispatchOutside(m, r, 'field.step', { direction: 'up', size: 'step', property, value: '20px' });
  },
  toString: () => `Rajada(${PROPERTIES[p % 3] ?? ''},${ms})`,
});

// An entry of a field's arrow, a command in between (the same selection chosen again), then a burst on the same field
// that comes back to where it began (its entry goes, DEF-0508) and one more arrow: that arrow makes an entry of its
// own, never merging into the older entry across the command in between.
const backAndForth = (i: number): Step => ({
  check: () => true,
  run: (m, r) => {
    const target = pick(nodesOf(r.store.getState()), i);
    dispatchOutside(m, r, 'selection.select', { target });
    const step = (direction: 'up' | 'down', value: string) => dispatchOutside(m, r, 'field.step', { direction, size: 'step', property: 'width', value });
    step('up', '10px');
    dispatchOutside(m, r, 'selection.select', { target });
    step('up', '11px');
    step('down', '12px');
    step('up', '11px');
  },
  toString: () => `Vaivém(${i})`,
});

const STEPS = [
  fc.nat(40).map(backAndForth),
  fc.nat(40).map(addToSelection),
  fc.nat(40).map((i) => command('selection.toggle', (s) => ({ target: pick(nodesOf(s), i) }), `Alternar(${i})`)),
  fc.constant(null).map(() => command('selection.clear', () => ({}), 'Limpar seleção')),
  fc.tuple(fc.nat(PROPERTIES.length - 1), fc.nat(VALUES.length - 1)).map(([p, v]) => command('style.set', () => ({ property: PROPERTIES[p], value: VALUES[v] }), `Estilo(${PROPERTIES[p] ?? ''}=${VALUES[v] ?? ''})`)),
  fc.tuple(fc.nat(5), fc.constantFrom(0, 500, 1000, 1001, 3000)).map(([p, ms]) => burst(p, ms)),
];

it('o histórico e a seleção seguem o modelo do manifesto em sequências aleatórias', () => {
  const summary = runModel('history', STEPS);
  expect(summary.failure).toBeNull();
});
