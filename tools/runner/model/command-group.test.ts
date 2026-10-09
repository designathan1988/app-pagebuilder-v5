// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableCSSFileLoading":true,"handleDisabledFileLoadingAsSuccess":true,"disableJavaScriptFileLoading":true}}
// The command group (the assistant's turn: src/core/store/store.ts commandGroup, wrapped by the editor store,
// src/editor/store.ts) against the rules every other way a command runs keeps: its undo gives back the context its
// change was made in (DCS-009, DEF-0527), and the typing a field holds while the group holds the editor is never
// dropped — a keep asked meanwhile waits for the group's end and runs in the context the typing began in (G1, G2,
// DEF-0528). The field is the one the model's Type step stands for (tools/runner/model/harness.ts): its first key takes
// the edit context, and its keep writes style.set in it.
import { describe, expect, it } from 'vitest';
import { breakpointsOf } from '../../../src/core/document/breakpoints.ts';
import { walk } from '../../../src/core/document/model.ts';
import { message } from '../../../src/core/commands/registry.ts';
import { manualClock } from '../../../src/core/ports/clock.ts';
import { sequentialIds } from '../../../src/core/ports/ids.ts';
import type { EditContext } from '../../../src/core/store/store.ts';
import { heldTyping, holdTyping, keepTypingBefore } from '../../../src/editor/input/pending.ts';
import { createEditorStore, editContextOf, MODEL_RULES, type EditorStore } from '../../../src/editor/store.ts';
import { keyframeTarget } from '../../../src/editor/timeline/playhead.ts';
import { activeLayer } from '../../../src/editor/view/style-state.ts';
import { isPanelOpen } from '../../../src/editor/workspace/panels.ts';
import type { CommandId } from '../../../src/generated/ids.ts';
import { fixture } from './harness.ts';

const memory = (): { read(): string | null; write(text: string): void } => ({ read: () => null, write: () => undefined });
const make = (): EditorStore => createEditorStore({ storage: memory(), workspace: memory(), clock: manualClock(1_000_000), ids: sequentialIds('g'), restored: { document: fixture('aurora'), selection: [] }, ports: { readOnly: () => false }, freeze: true });
const run = (store: EditorStore, id: string, args: unknown, context?: EditContext) => (store.dispatch as (i: CommandId, a: unknown, c?: EditContext) => { status: string })(id as CommandId, args, context);
const busy = message('assistant.busy');
const leaf = (store: EditorStore): string => [...walk(store.getState().document.pages[0]?.tree ?? ({ children: [] } as never))].find((n) => n.children.length === 0 && n.type !== MODEL_RULES.root.type)?.id ?? '';
type Layers = Readonly<Record<string, Readonly<Record<string, Readonly<Record<string, string>>>>>>;
const styleAt = (store: EditorStore, id: string, breakpoint: string, property: string): string | undefined => {
  for (const page of store.getState().document.pages) for (const n of walk(page.tree)) if (n.id === id) return (n.styles as Layers | undefined)?.[breakpoint]?.base?.[property];
  return undefined;
};
// the store with a leaf selected, the breakpoint shown and another one of the project's
const ready = (): { readonly store: EditorStore; readonly node: string; readonly shown: string; readonly other: string } => {
  const store = make();
  const node = leaf(store);
  run(store, 'selection.select', { target: node });
  const shown = activeLayer(store.getState()).breakpoint;
  const other = breakpointsOf(store.getState().document).find((b) => b.id !== shown)?.id ?? '';
  return { store, node, shown, other };
};
// a field typed in: its typing held with the context of its first key, its keep writing the opacity there
function typed(store: EditorStore, value: string): { readonly kept: () => number } {
  const region = document.createElement('div');
  const field = document.createElement('input');
  region.append(field);
  document.body.append(region);
  const context = editContextOf(store.getState());
  let kept = 0;
  holdTyping({ field, region, context, owns: (id, args) => id === 'style.set' && args.property === 'opacity', keep: () => {
    kept += 1;
    run(store, 'style.set', { property: 'opacity', value }, context);
  } });
  field.focus();
  return { kept: () => kept };
}

describe('o grupo de comandos contra as regras de todo comando', () => {
  it('o desfazer de um grupo devolve o contexto em que a mudança foi feita (DCS-009)', () => {
    const { store, node, other } = ready();
    const group = store.commandGroup(busy);
    group.dispatch('view.setBreakpoint' as CommandId, { breakpoint: other } as never);
    expect(group.dispatch('style.set' as CommandId, { property: 'width', value: '33px' } as never).status).toBe('done');
    group.commit();
    expect(styleAt(store, node, other, 'width'), 'o grupo gravou a largura no breakpoint para onde foi').toBe('33px');
    expect(run(store, 'history.undo', {}).status).toBe('done');
    expect(activeLayer(store.getState()).breakpoint, 'o desfazer mostra o breakpoint em que a mudança foi feita').toBe(other);
  });

  it('um toque fora do campo durante o grupo não perde a digitação: ela é gravada quando o grupo termina (G2)', () => {
    const { store, node, shown } = ready();
    const group = store.commandGroup(busy);
    const field = typed(store, '0.6');
    keepTypingBefore(document.body);
    expect(heldTyping(), 'a digitação continua no registro enquanto o grupo segura o editor').not.toBeNull();
    expect(styleAt(store, node, shown, 'opacity'), 'nada é gravado durante o grupo').toBeUndefined();
    group.commit();
    expect(field.kept(), 'a gravação pedida durante o grupo rodou uma vez, depois dele').toBe(1);
    expect(styleAt(store, node, shown, 'opacity'), 'o valor digitado está no documento').toBe('0.6');
    expect(heldTyping()).toBeNull();
  });

  it('a troca de breakpoint pelo grupo grava a digitação no contexto em que ela começou, quando o grupo termina (G1)', () => {
    const { store, node, shown, other } = ready();
    const group = store.commandGroup(busy);
    const field = typed(store, '0.4');
    group.dispatch('view.setBreakpoint' as CommandId, { breakpoint: other } as never);
    group.dispatch('style.set' as CommandId, { property: 'width', value: '33px' } as never);
    group.commit();
    expect(field.kept(), 'a troca do que o campo edita pediu a gravação, que rodou no fim do grupo').toBe(1);
    expect(styleAt(store, node, shown, 'opacity'), 'gravado no breakpoint em que a digitação começou').toBe('0.4');
    expect(styleAt(store, node, other, 'opacity'), 'nada no breakpoint para onde o grupo foi').toBeUndefined();
    expect(heldTyping()).toBeNull();
  });

  it('um campo que começa a digitar durante o grupo não descarta a digitação do anterior (G2)', () => {
    const { store, node, shown } = ready();
    const group = store.commandGroup(busy);
    const first = typed(store, '0.3');
    typed(store, '0.9');
    group.cancel();
    expect(first.kept(), 'a digitação do primeiro campo foi gravada no fim do grupo').toBe(1);
    expect(styleAt(store, node, shown, 'opacity'), 'o valor do primeiro campo está no documento').toBe('0.3');
    expect(heldTyping(), 'o segundo campo continua segurando a sua digitação').not.toBeNull();
  });
});

// What an undo gives back of the keyframe (DCS-016, option b): the keyframe only when the change was made on it; a
// change made off it — with the playhead on one, any command that writes no keyframe — leaves the Timeline as the
// person has it (DEF-0532).
describe('o quadro-chave que o desfazer devolve', () => {
  // the leaf with an animation, the Timeline open and the playhead on the animation's last keyframe
  const onKeyframe = (): EditorStore => {
    const { store } = ready();
    expect(run(store, 'animation.create', { name: 'Entrada' }).status).toBe('done');
    run(store, 'workspace.setPanelOpen', { panel: 'timeline', open: 'open' });
    run(store, 'timeline.setPlayhead', { time: 100_000 });
    expect(keyframeTarget(store.getState()), 'o playhead está sobre um quadro-chave').not.toBeNull();
    return store;
  };
  it('uma mudança feita fora do quadro-chave: o desfazer deixa a Timeline fechada como a pessoa a deixou', () => {
    const store = onKeyframe();
    expect(run(store, 'element.duplicate', {}).status).toBe('done');
    run(store, 'workspace.setPanelOpen', { panel: 'timeline', open: 'close' });
    expect(run(store, 'history.undo', {}).status).toBe('done');
    expect(isPanelOpen(store.getState().ui, 'timeline'), 'o desfazer da duplicação reabriu a Timeline').toBe(false);
  });
  it('uma mudança feita no quadro-chave: o desfazer reabre a Timeline nele (controle)', () => {
    const store = onKeyframe();
    const on = keyframeTarget(store.getState());
    expect(run(store, 'style.set', { property: 'opacity', value: '0.5' }).status).toBe('done');
    run(store, 'workspace.setPanelOpen', { panel: 'timeline', open: 'close' });
    expect(run(store, 'history.undo', {}).status).toBe('done');
    expect(keyframeTarget(store.getState()), 'o desfazer mostra o quadro-chave em que a mudança foi feita').toEqual(on);
  });
});
