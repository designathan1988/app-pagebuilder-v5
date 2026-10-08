// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableCSSFileLoading":true,"handleDisabledFileLoadingAsSuccess":true,"disableJavaScriptFileLoading":true}}
// The model of the style commands (tools/runner/model/harness.ts): value writes, a field's arrow and its bursts, the
// unit menu, the spacing control and Reset, mixed with typing, breakpoint and style-state changes: every write lands in
// the context it was asked in (CLAUDE.md, rule G1).
import fc from 'fast-check';
import { expect, it } from 'vitest';
import { walk } from '../../../src/core/document/model.ts';
import { manualClock } from '../../../src/core/ports/clock.ts';
import { sequentialIds } from '../../../src/core/ports/ids.ts';
import { createEditorStore, MODEL_RULES } from '../../../src/editor/store.ts';
import { keyframeTarget } from '../../../src/editor/timeline/playhead.ts';
import type { CommandId } from '../../../src/generated/ids.ts';
import { command, dispatchOutside, fixture, PROPERTIES, runModel, VALUES, type Step } from './harness.ts';

const UNITS = ['px', '%', 'em', 'rem', 'vw'];
const burst = (p: number, ms: number, up: boolean): Step => ({
  check: () => true,
  run: (m, r) => {
    const property = PROPERTIES[p % 3] as string;
    dispatchOutside(m, r, 'field.step', { direction: up ? 'up' : 'down', size: 'step', property, value: '10px' });
    r.clock.advance(ms);
    dispatchOutside(m, r, 'field.step', { direction: up ? 'up' : 'down', size: 'page', property, value: '20px', modifier: 'Shift' });
  },
  toString: () => `Rajada(${PROPERTIES[p % 3] ?? ''},${ms},${up ? 'up' : 'down'})`,
});

const STEPS = [
  fc.tuple(fc.nat(PROPERTIES.length - 1), fc.nat(VALUES.length - 1)).map(([p, v]) => command('style.set', () => ({ property: PROPERTIES[p], value: VALUES[v] }), `Estilo(${PROPERTIES[p] ?? ''}=${VALUES[v] ?? ''})`)),
  fc.tuple(fc.nat(PROPERTIES.length - 1), fc.nat(VALUES.length - 1)).map(([p, v]) => command('style.set', () => ({ property: PROPERTIES[p], value: VALUES[v] }), `Estilo(${PROPERTIES[p] ?? ''}=${VALUES[v] ?? ''})`)),
  fc.tuple(fc.nat(5), fc.constantFrom(0, 500, 1000, 1001, 3000), fc.boolean()).map(([p, ms, up]) => burst(p, ms, up)),
  fc.tuple(fc.nat(2), fc.nat(VALUES.length - 1), fc.boolean()).map(([p, v, up]) => command('field.step', () => ({ direction: up ? 'up' : 'down', size: 'step', property: PROPERTIES[p], value: VALUES[v] }), `PassoDeCampo(${PROPERTIES[p] ?? ''},${VALUES[v] ?? ''})`)),
  fc.tuple(fc.nat(1), fc.nat(UNITS.length - 1)).map(([p, u]) => command('field.setUnit', () => ({ property: PROPERTIES[p], value: '12px', unit: UNITS[u] }), `Unidade(${PROPERTIES[p] ?? ''},${UNITS[u] ?? ''})`)),
  fc.tuple(fc.constantFrom('padding', 'margin'), fc.constantFrom('all', 'top', 'left'), fc.constantFrom('4px', '12px', '0')).map(([box, sides, value]) => command('style.setSpacing', () => ({ box, sides, value }), `Espaço(${box},${sides},${value})`)),
  fc.nat(PROPERTIES.length - 1).map((p) => command('style.reset', () => ({ property: PROPERTIES[p] }), `Redefinir(${PROPERTIES[p] ?? ''})`)),
];

// A change made on a keyframe, undone and redone with the Timeline closed since: the Timeline opens again on that
// keyframe (DCS-009, DCS-016), so the step is seen where it was made.
it('desfazer e refazer devolvem o quadro-chave em que a mudança foi feita', () => {
  const memory = (): { read(): string | null; write(text: string): void } => {
    let held: string | null = null;
    return { read: () => held, write: (text) => void (held = text) };
  };
  const store = createEditorStore({ storage: memory(), workspace: memory(), clock: manualClock(1_000_000), ids: sequentialIds('k'), restored: { document: fixture('aurora'), selection: [] }, ports: { readOnly: () => false }, freeze: true });
  const dispatch = store.dispatch as (id: CommandId, args: unknown) => { status: string };
  const target = [...walk(store.getState().document.pages[0]?.tree ?? ({ children: [] } as never))].find((n) => n.children.length === 0 && n.type !== MODEL_RULES.root.type);
  dispatch('selection.select' as CommandId, { target: target?.id });
  expect(dispatch('animation.create' as CommandId, { name: 'Entrada' }).status).toBe('done');
  dispatch('workspace.setPanelOpen' as CommandId, { panel: 'timeline', open: 'open' });
  dispatch('timeline.setPlayhead' as CommandId, { time: 0 });
  const made = keyframeTarget(store.getState());
  expect(made, 'o playhead sobre o quadro-chave de 0%').not.toBeNull();
  dispatch('style.set' as CommandId, { property: 'opacity', value: '0.3' });
  for (const step of ['history.undo', 'history.redo'] as const) {
    dispatch('workspace.setPanelOpen' as CommandId, { panel: 'timeline', open: 'close' });
    expect(keyframeTarget(store.getState())).toBeNull();
    dispatch(step as CommandId, {});
    expect(keyframeTarget(store.getState()), `${step} devolve o quadro-chave`).toEqual(made);
  }
});

it('os comandos de estilo seguem o modelo do manifesto e gravam no contexto em que foram pedidos', () => {
  const summary = runModel('style', STEPS);
  expect(summary.failure).toBeNull();
});
