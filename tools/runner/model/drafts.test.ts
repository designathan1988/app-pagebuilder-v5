// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableCSSFileLoading":true,"handleDisabledFileLoadingAsSuccess":true,"disableJavaScriptFileLoading":true}}
// The value fields that keep a draft of their own, against the one registry of typing (rule G2,
// src/editor/input/pending.ts) and against their command's handler (rule G3): a panel's field (the host of the
// easing curve's button), the typed field of a spacing band and a value field of the Guides & Grids dialog, mounted in
// happy-dom. A value typed is kept when a press begins outside the field and when the field is left (G2), Enter
// keeping it in every field being the control that the test sees a keep; Enter with an empty or non-numeric text
// reaches the command, which refuses it with words (its argument check or its handler: G3). auditoria/defeitos.md,
// DEF-0514 and DEF-0515.
import { act, createElement, createRef, type ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { manualClock } from '../../../src/core/ports/clock.ts';
import { sequentialIds } from '../../../src/core/ports/ids.ts';
import { walk } from '../../../src/core/document/model.ts';
import { message } from '../../../src/core/commands/registry.ts';
import { storedValue } from '../../../src/core/style/stored.ts';
import { TypedBand } from '../../../src/editor/canvas/edit-handles.tsx';
import { QuickPanel } from '../../../src/editor/canvas/quick-panel.tsx';
import { installKeymap } from '../../../src/editor/input/keymap.ts';
import { installPointer } from '../../../src/editor/input/pointer.ts';
import { sharedOf } from '../../../src/editor/input/pointer/shared.ts';
import { quickPanelOpen } from '../../../src/editor/quick-panel/quick-panel.ts';
import { saveFieldDraft, startDrafts } from '../../../src/editor/persistence/drafts.ts';
import { keyframeTarget } from '../../../src/editor/timeline/playhead.ts';
import { heldTyping, keepTypingBefore } from '../../../src/editor/input/pending.ts';
import { GuidesGridsDialog } from '../../../src/editor/shell/guides-grids.tsx';
import { PanelField } from '../../../src/editor/shell/panel-field.tsx';
import { Field } from '../../../src/editor/shell/inspector-controls.tsx';
import { createEditorStore, editContextOf, MODEL_RULES, StoreContext, type EditorStore } from '../../../src/editor/store.ts';
import type { CommandId } from '../../../src/generated/ids.ts';
import { manifest } from '../../../src/manifest/runtime.ts';
import { fixture } from './harness.ts';

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const memory = (): { read(): string | null; write(text: string): void } => ({ read: () => null, write: () => undefined });
const storeOf = (): EditorStore => createEditorStore({ storage: memory(), workspace: memory(), clock: manualClock(1_000_000), ids: sequentialIds('d'), restored: { document: fixture('aurora'), selection: [] }, ports: { readOnly: () => false }, freeze: true });
const dispatch = (store: EditorStore, id: string, args: unknown) => (store.dispatch as (i: CommandId, a: unknown) => unknown)(id as CommandId, args);
const door = (ref: string) => {
  const found = manifest.doors.find((d) => d.ref === ref || d.ref.endsWith(`#${ref}`) || (d.command.id === ref && d.door.kind === 'panel-control'));
  if (found === undefined) throw new Error(`no door ${ref}`);
  return found;
};
const said = (store: EditorStore): string | null => store.getState().message?.key ?? null;
// the command refused what it was given, with words: its argument check (core/store/args.ts) or its handler
const refusedWithWords = (store: EditorStore): boolean => store.getState().refused === true && said(store) !== null;

function mount(store: EditorStore, element: ReactElement): { readonly host: HTMLElement; readonly stop: () => void } {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  act(() => root.render(createElement(StoreContext.Provider, { value: store }, element)));
  return {
    host,
    stop: () => {
      act(() => root.unmount());
      host.remove();
    },
  };
}
// a text typed into an input as a person types it (React reads the value setter and the input event)
function type(input: HTMLInputElement, text: string): void {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  act(() => {
    input.focus();
    setter?.call(input, text);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
// the focus leaves the field, as a press elsewhere takes it
function leave(input: HTMLInputElement): void {
  act(() => {
    input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    input.dispatchEvent(new FocusEvent('blur'));
    input.blur();
  });
}
// a timer the field leaves for the keep (field.tsx keepSoon waits one task)
const settle = () => act(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));
const submit = (input: HTMLInputElement) => act(() => void input.form?.requestSubmit());

// what each value field keeps, typed and then left two ways: a press outside the field, and the focus leaving
interface Case {
  readonly name: string;
  readonly mount: (store: EditorStore) => { readonly host: HTMLElement; readonly stop: () => void };
  readonly input: (host: HTMLElement) => HTMLInputElement;
  readonly typed: string;
  readonly kept: (store: EditorStore) => boolean;
}
const LANGUAGE = door('project.setLanguage');
const BAND = door('handle-padding-top-band');
const firstElement = (store: EditorStore): string => store.getState().document.pages[0]?.tree.children[0]?.id ?? '';
// the value field of the columns' count in the Guides & Grids dialog (its form carries the door's arguments)
const GRID_COUNT = `form[data-args='${JSON.stringify({ grid: 'columns', setting: 'count' })}'] input`;
const openGuides = (store: EditorStore) => dispatch(store, 'workspace.openDialog', { dialog: 'guides-grids' });
const CASES: readonly Case[] = [
  {
    name: 'campo de painel (o idioma do projeto)',
    mount: (store) => mount(store, createElement(PanelField, { entry: LANGUAGE, value: 'en', label: LANGUAGE.ref })),
    input: (host) => host.querySelector('input') as HTMLInputElement,
    typed: 'fr',
    kept: (store) => said(store) === 'status.project.languageSet',
  },
  {
    name: 'banda digitada (preenchimento de cima)',
    mount: (store) => {
      dispatch(store, 'selection.select', { target: firstElement(store) });
      return mount(store, createElement(TypedBand, { entry: BAND, box: { x: 0, y: 0, width: 100, height: 10 }, value: 0 }));
    },
    input: (host) => host.querySelector('input') as HTMLInputElement,
    typed: '12',
    kept: (store) => JSON.stringify(store.getState().document).includes('"padding-top":"12px"'),
  },
  {
    name: 'campo de valor das grades (o número de colunas)',
    mount: (store) => {
      openGuides(store);
      return mount(store, createElement(GuidesGridsDialog));
    },
    input: (host) => host.querySelector(GRID_COUNT) as HTMLInputElement,
    typed: '7',
    kept: (store) => said(store)?.startsWith('status.grid.set') === true,
  },
];

describe('os campos de valor contra o registro de pendências e o tratador', () => {
  for (const one of CASES) {
    // the control: Enter keeps the value in every field as it is, so a failure below is the field, not the test
    it(`${one.name}: Enter grava o valor digitado (controle)`, async () => {
      const store = storeOf();
      const drawn = one.mount(store);
      const input = one.input(drawn.host);
      type(input, one.typed);
      submit(input);
      await settle();
      expect(one.kept(store), `${one.name}: Enter não gravou o valor digitado`).toBe(true);
      drawn.stop();
    });
    it(`${one.name}: o valor digitado é gravado quando um toque começa fora do campo (G2)`, async () => {
      const store = storeOf();
      const drawn = one.mount(store);
      const input = one.input(drawn.host);
      expect(input, 'o campo foi desenhado').not.toBeNull();
      type(input, one.typed);
      // the pointer owner's first word on every press (input/pointer/events.ts), on the page's body
      act(() => keepTypingBefore(document.body));
      await settle();
      expect(one.kept(store), `${one.name}: o toque começou fora do campo e o valor digitado não foi gravado`).toBe(true);
      drawn.stop();
    });
    it(`${one.name}: o valor digitado é gravado quando o campo perde o foco (G2)`, async () => {
      const store = storeOf();
      const drawn = one.mount(store);
      const input = one.input(drawn.host);
      type(input, one.typed);
      leave(input);
      await settle();
      expect(one.kept(store), `${one.name}: o campo perdeu o foco e o valor digitado não foi gravado`).toBe(true);
      drawn.stop();
    });
    // the field goes with its typing pending and the focus still in it: the dialog closed by its Escape, the panel or
    // the band unmounted (DEF-0526)
    it(`${one.name}: o valor digitado é gravado quando o campo sai da página (G2)`, async () => {
      const store = storeOf();
      const drawn = one.mount(store);
      const input = one.input(drawn.host);
      type(input, one.typed);
      drawn.stop();
      await settle();
      expect(one.kept(store), `${one.name}: o campo saiu da página e o valor digitado não foi gravado`).toBe(true);
    });
  }

  it('Enter com texto vazio ou não numérico chega ao tratador, que recusa com aviso (G3)', async () => {
    const found: string[] = [];
    for (const text of ['', 'abc']) {
      // the grids' value field
      const store = storeOf();
      openGuides(store);
      const grids = mount(store, createElement(GuidesGridsDialog));
      const count = grids.host.querySelector(GRID_COUNT) as HTMLInputElement;
      type(count, text);
      submit(count);
      await settle();
      if (!refusedWithWords(store)) found.push(`grades, "${text}": ${said(store) ?? 'sem aviso'}`);
      grids.stop();
      // the new guide's position
      const other = storeOf();
      openGuides(other);
      const guides = mount(other, createElement(GuidesGridsDialog));
      const add = guides.host.querySelector<HTMLButtonElement>('.guides-grids__add button');
      act(() => add?.click());
      const at = guides.host.querySelector('input[name="at"]') as HTMLInputElement | null;
      if (at === null) found.push('guia nova: o campo da posição não abriu');
      else {
        type(at, text);
        submit(at);
        await settle();
        if (!refusedWithWords(other)) found.push(`guia nova, "${text}": ${said(other) ?? 'sem aviso'}`);
      }
      guides.stop();
    }
    expect(found, 'textos que não chegaram ao tratador').toEqual([]);
  });
});

// The quick panel's fields drop what they hold only when the panel is dismissed by its Escape, the one exception rule
// G2 gives (CLAUDE.md; spec quick-panel); its shortcut and its close button close it with the typing kept (DEF-0529).
// The real panel, with the real keymap, its opacity field typed in and the panel closed each way.
const frames = async (count: number) => {
  for (let index = 0; index < count; index += 1) await act(() => new Promise<void>((resolve) => setTimeout(resolve, 20)));
};
type Close = 'Esc' | 'Ctrl+Shift+Q' | 'o botão de fechar';
async function typeAndClose(close: Close): Promise<{ readonly closed: boolean; readonly kept: boolean; readonly held: boolean }> {
  const store = storeOf();
  const tree = store.getState().document.pages[0]?.tree;
  const leaf = tree === undefined ? undefined : [...walk(tree)].find((n) => n.children.length === 0 && n.type !== MODEL_RULES.root.type && n.tag === 'div');
  dispatch(store, 'selection.select', { target: leaf?.id });
  dispatch(store, 'quickPanel.setOpen', { open: 'open' });
  const stop = installKeymap(store, window);
  const stage = createRef<HTMLDivElement>();
  const drawn = mount(store, createElement('div', { ref: stage }, createElement(QuickPanel, { stage })));
  await frames(2);
  const field = [...drawn.host.querySelectorAll<HTMLInputElement>('.quick-panel__fields input')].find((one) => (one.closest('[data-door]')?.getAttribute('data-door') ?? '').includes('opacity'));
  expect(field, 'o painel desenhou o campo da opacidade').toBeDefined();
  if (field === undefined) throw new Error('no opacity field');
  const before = JSON.stringify(store.getState().document);
  type(field, '0.37');
  expect(heldTyping()?.field, 'o campo segura a digitação').toBe(field);
  if (close === 'Esc') await act(async () => void field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true })));
  if (close === 'Ctrl+Shift+Q') await act(async () => void field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Q', code: 'KeyQ', ctrlKey: true, shiftKey: true, bubbles: true, cancelable: true })));
  if (close === 'o botão de fechar') {
    const button = drawn.host.querySelector<HTMLButtonElement>('.quick-panel__close');
    // the pointer owner's first word on every press (input/pointer/events.ts), then the click the button runs
    await act(async () => {
      keepTypingBefore(button);
      button?.click();
    });
  }
  const closed = !quickPanelOpen(store.getState().ui);
  await frames(4);
  const after = JSON.stringify(store.getState().document);
  const outcome = { closed, kept: after !== before && after.includes('"0.37"'), held: heldTyping() !== null };
  drawn.stop();
  stop();
  return outcome;
}

describe('o fecho do painel rápido com a digitação pendente', () => {
  for (const [close, kept] of [['Esc', false], ['Ctrl+Shift+Q', true], ['o botão de fechar', true]] as const) {
    it(`${close} fecha o painel e ${kept ? 'grava' : 'descarta (a exceção única da G2)'} o valor digitado`, async () => {
      const outcome = await typeAndClose(close);
      expect(outcome.closed, 'o painel fechou').toBe(true);
      expect(outcome.kept, kept ? 'o valor digitado não foi gravado' : 'o Esc gravou o valor digitado').toBe(kept);
      expect(outcome.held, 'nenhuma digitação ficou no registro').toBe(false);
    });
  }
});

// The band's value belongs to the elements it was typed for (rule G1: the context includes the elements): the selection
// changed with the focus still in the field keeps the value at once, on the element of the first key (DEF-0530).
describe('a banda digitada e a seleção que muda', () => {
  it('a seleção muda com o foco na banda: o valor vai ao elemento da primeira tecla (G1)', async () => {
    const store = storeOf();
    const first = firstElement(store);
    const drawn = CASES[1]?.mount(store);
    if (drawn === undefined) throw new Error('no band case');
    const input = drawn.host.querySelector('input') as HTMLInputElement;
    type(input, '12');
    const tree = store.getState().document.pages[0]?.tree;
    const other = tree === undefined ? undefined : [...walk(tree)].find((n) => n.id !== first && n.type !== MODEL_RULES.root.type)?.id;
    act(() => void dispatch(store, 'selection.select', { target: other }));
    await settle();
    const padding = (id: string | undefined) => JSON.stringify([...walk(store.getState().document.pages[0]?.tree ?? (tree as never))].find((n) => n.id === id)?.styles ?? {});
    expect(padding(first), 'o elemento da primeira tecla recebeu o valor').toContain('"padding-top":"12px"');
    expect(padding(other), 'o elemento selecionado depois não recebeu o valor').not.toContain('"padding-top":"12px"');
    drawn.stop();
  });

  it('todo comando de estilo de um campo toma os elementos para que o valor foi digitado (targets)', () => {
    // the doors a person types a style value into: the inspector's fields, the quick panel's and the canvas's handles
    // (a band's typed field); a command bound to one node by its own `target` has its element already
    const typedInto = manifest.doors.filter((d) => d.command.id.startsWith('style.') && ['inspector-field', 'quick-panel', 'canvas-handle'].includes(d.door.kind));
    expect(typedInto.length, 'a conferência alcança as portas de campo de estilo').toBeGreaterThan(200);
    const missing = [...new Set(typedInto.filter((d) => !('targets' in d.command.args) && !('target' in d.command.args)).map((d) => d.command.id))];
    expect(missing, 'comandos de campo de estilo sem targets: o campo descartaria a digitação ou gravaria noutro elemento').toEqual([]);
  });
});

// The session's draft keeps the context its typing began in, the keyframe the playhead sat on among it: a reloaded tab
// restores the field where it was typed (rule G1, "on the restoring of a draft"; DEF-0531).
describe('o rascunho da sessão e o contexto da digitação', () => {
  it('o rascunho restaurado volta ao quadro-chave em que foi digitado (G1)', () => {
    window.sessionStorage.clear();
    const kept = (() => {
      let held: string | null = null;
      return { read: () => held, write: (text: string) => void (held = text) };
    })();
    const make = (prefix: string, document = fixture('aurora'), selection: readonly string[] = []) =>
      createEditorStore({ storage: memory(), workspace: kept, clock: manualClock(1_000_000), ids: sequentialIds(prefix), restored: { document, selection: [...selection] }, ports: { readOnly: () => false }, freeze: true });
    const before = make('a');
    const stopBefore = startDrafts(before, () => 7, () => true);
    const tree = before.getState().document.pages[0]?.tree;
    const leaf = tree === undefined ? undefined : [...walk(tree)].find((n) => n.children.length === 0 && n.type !== MODEL_RULES.root.type);
    dispatch(before, 'selection.select', { target: leaf?.id });
    expect(dispatch(before, 'animation.create', { name: 'Entrada' }), 'a animação foi criada').toMatchObject({ status: 'done' });
    dispatch(before, 'workspace.setPanelOpen', { panel: 'timeline', open: 'open' });
    // the playhead on the animation's last keyframe (its time clamped to the duration)
    dispatch(before, 'timeline.setPlayhead', { time: 100_000 });
    const typedOn = keyframeTarget(before.getState());
    expect(typedOn, 'o playhead está sobre um quadro-chave').not.toBeNull();
    // an inspector field with a text typed and not kept: the session's draft
    const row = document.createElement('div');
    row.setAttribute('data-door', 'style.set#inspector-opacity');
    const input = document.createElement('input');
    input.setAttribute('aria-label', 'Opacity');
    row.append(input);
    document.body.append(row);
    input.dataset.shown = '';
    input.value = '0.2';
    saveFieldDraft(input);
    stopBefore();
    // the tab reloaded: the same work, the same selection, the same workspace kept
    const after = make('b', before.getState().document, before.getState().selection);
    const stopAfter = startDrafts(after, () => 7, () => true);
    const restored = editContextOf(after.getState()).keyframe ?? null;
    stopAfter();
    row.remove();
    expect(restored, 'o contexto restaurado é o quadro-chave em que o valor foi digitado').toEqual(typedOn);
  });
});

// A field's own command keeps or cancels its typing itself: what the command moves never keeps the typing again (the
// New animation field's Enter: the animation it makes puts a keyframe under the playhead, the context of the edit
// moves, and the typing was kept a second time — the command ran twice and was refused; DEF-0535).
describe('o comando do próprio campo e o contexto que ele muda', () => {
  it('o Enter do campo de nova animação cria a animação uma vez', async () => {
    const store = storeOf();
    dispatch(store, 'selection.select', { target: 'n-title' });
    dispatch(store, 'workspace.setPanelOpen', { panel: 'timeline', open: 'open' });
    const drawn = mount(store, createElement(PanelField, { entry: door('animation.create#timeline-new-animation'), value: '', label: 'name' }));
    const input = drawn.host.querySelector('input') as HTMLInputElement;
    type(input, 'fade-in');
    submit(input);
    await settle();
    const node = [...walk(store.getState().document.pages[0]?.tree ?? (undefined as never))].find((n) => n.id === 'n-title');
    expect(node?.animations?.map((a) => a.name), 'uma animação fade-in').toEqual(['fade-in']);
    expect(store.getState().refused, `o comando não rodou de novo e foi recusado: ${said(store) ?? ''}`).not.toBe(true);
    drawn.stop();
  });

  // DEF-0607 (DCS-032): a new animation's name refused (a space in it) emptied the field, what was typed lost. A name
  // for something new stays, marked, to be mended; a field with a value of the document shows it again (FD2).
  it('o nome de animação recusado fica no campo, marcado', async () => {
    const store = storeOf();
    dispatch(store, 'selection.select', { target: 'n-title' });
    dispatch(store, 'workspace.setPanelOpen', { panel: 'timeline', open: 'open' });
    const drawn = mount(store, createElement(PanelField, { entry: door('animation.create#timeline-new-animation'), value: '', label: 'name' }));
    const input = drawn.host.querySelector('input') as HTMLInputElement;
    type(input, 'Entrada suave');
    submit(input);
    await settle();
    const kept = { value: input.value, invalid: input.getAttribute('aria-invalid') };
    drawn.stop();
    expect(kept, 'o nome recusado no campo').toEqual({ value: 'Entrada suave', invalid: 'true' });
    expect(store.getState().refused, 'o comando recusou').toBe(true);
  });
});

// A field shows the document's value again after its command refused what it held (the audit's FD2); the keys typed
// next are the person's, every one of them (rule G2; DEF-0562: the first key after a refusal was wiped, 120px kept as
// 20px). The real quick panel and keymap, a value field typed in key by key as a person types it, Enter after each.
describe('a digitação depois de uma recusa', () => {
  // keys typed one at a time over what the field holds, all of it selected first (Ctrl+A), as the browser inserts them:
  // the first key replaces the selection, the others go at the end
  const keys = (input: HTMLInputElement, text: string) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    for (const [index, key] of [...text].entries()) {
      act(() => {
        input.focus();
        setter?.call(input, index === 0 ? key : `${input.value}${key}`);
        input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: key }));
      });
    }
  };
  const enter = (input: HTMLInputElement) => act(async () => void input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true, cancelable: true })));
  it('as teclas digitadas depois de um valor recusado chegam inteiras ao comando', async () => {
    const store = storeOf();
    const tree = store.getState().document.pages[0]?.tree;
    const leaf = tree === undefined ? undefined : [...walk(tree)].find((n) => n.children.length === 0 && n.type !== MODEL_RULES.root.type && n.tag === 'div');
    dispatch(store, 'selection.select', { target: leaf?.id });
    dispatch(store, 'quickPanel.setOpen', { open: 'open' });
    const stop = installKeymap(store, window);
    const stage = createRef<HTMLDivElement>();
    const drawn = mount(store, createElement('div', { ref: stage }, createElement(QuickPanel, { stage })));
    await frames(2);
    const field = [...drawn.host.querySelectorAll<HTMLInputElement>('.quick-panel__fields input')].find((one) => (one.closest('[data-door]')?.getAttribute('data-door') ?? '').includes('quick-panel-width'));
    expect(field, 'o painel desenhou o campo da largura').toBeDefined();
    if (field === undefined) throw new Error('no width field');
    const width = () => {
      const node = [...walk(store.getState().document.pages[0]?.tree ?? ({ children: [] } as never))].find((n) => n.id === leaf?.id);
      return node === undefined ? null : (storedValue(node, 'width', MODEL_RULES) ?? null);
    };
    const found: string[] = [];
    for (const [refused, kept] of [['abc', '120px'], ['xyz', '64px']] as const) {
      keys(field, refused);
      await enter(field);
      if (store.getState().refused !== true) found.push(`"${refused}" não foi recusado`);
      keys(field, kept);
      await enter(field);
      await frames(2);
      if (width() !== kept) found.push(`depois de "${refused}" recusado, "${kept}" digitado gravou ${String(width())}`);
    }
    drawn.stop();
    stop();
    expect(found, 'teclas perdidas depois de uma recusa').toEqual([]);
  });
});

// The pointer owner (src/editor/input/pointer.ts), installed on happy-dom's window, its events dispatched as the
// browser sends them: the typing a field holds is kept at the very start of a press outside the field (rule G2,
// input/pointer/events.ts onDown; the verification's finding: removed, no detector saw it), and a press of a pointer
// whose release was lost ends the gesture it left open before its own begins (DCS-013, DEF-0510, DEF-0556, DEF-0563).
describe('o dono do ponteiro', () => {
  const pointer = (type: string, target: EventTarget, pointerId: number) =>
    act(() => void target.dispatchEvent(new PointerEvent(type, { pointerId, button: 0, buttons: type === 'pointerup' ? 0 : 1, clientX: 10, clientY: 10, bubbles: true, cancelable: true })));
  const openPanel = async () => {
    const store = storeOf();
    const tree = store.getState().document.pages[0]?.tree;
    const leaf = tree === undefined ? undefined : [...walk(tree)].find((n) => n.children.length === 0 && n.type !== MODEL_RULES.root.type && n.tag === 'div');
    dispatch(store, 'selection.select', { target: leaf?.id });
    dispatch(store, 'quickPanel.setOpen', { open: 'open' });
    const stopKeys = installKeymap(store, window);
    const stopPointer = installPointer(store, window);
    const stage = createRef<HTMLDivElement>();
    const drawn = mount(store, createElement('div', { ref: stage }, createElement(QuickPanel, { stage })));
    await frames(2);
    const width = drawn.host.querySelector<HTMLElement>('[data-door*="quick-panel-width"]');
    const stop = () => {
      drawn.stop();
      stopPointer();
      stopKeys();
    };
    return { store, leaf, width, stop };
  };

  it('a digitação de um campo é gravada no começo de um toque fora dele', async () => {
    const { store, leaf, width, stop } = await openPanel();
    try {
      const field = width?.querySelector('input') ?? null;
      expect(field, 'o painel desenhou o campo da largura').not.toBeNull();
      if (field === null) return;
      type(field, '77px');
      expect(heldTyping()?.field, 'o campo segura a digitação').toBe(field);
      pointer('pointerdown', document.body, 1);
      const node = [...walk(store.getState().document.pages[0]?.tree ?? ({ children: [] } as never))].find((n) => n.id === leaf?.id);
      expect(node === undefined ? null : storedValue(node, 'width', MODEL_RULES), 'a largura gravada logo no toque').toBe('77px');
      pointer('pointerup', document.body, 1);
    } finally {
      stop();
    }
  });

  it('o toque de um ponteiro cuja soltura se perdeu encerra o gesto aberto antes de abrir o seu', async () => {
    const { store, stop } = await openPanel();
    try {
      // the canvas's stage as the pointer owner reads it (data-canvas-stage): a press on it is a gesture of the machine
      const label = document.createElement('div');
      label.setAttribute('data-canvas-stage', '');
      document.body.append(label);
      pointer('pointerdown', label, 1);
      const first = sharedOf(store).open;
      expect(first, 'o toque abriu um gesto').not.toBeNull();
      // another pointer's release turns pressing off; the first pointer's own release never comes
      pointer('pointerup', window, 2);
      pointer('pointerdown', label, 1);
      const second = sharedOf(store).open;
      expect(second === null || second === first ? 'o gesto perdido continua aberto' : 'um gesto novo', 'o gesto depois do segundo toque').toBe('um gesto novo');
      pointer('pointerup', label, 1);
      label.remove();
    } finally {
      stop();
    }
  });
});

// Rule G1 with the real field (the quick panel's Width, a NumberField) and the real store: the typing is kept in the
// context of its first key when what the field edits moves with the focus still in the field — the class the Style tab
// targets, the keyframe under the playhead, the selection (the verification's finding: the harness, tools/runner/model/
// harness.ts, never changes the class nor the keyframe, nor the selection with the focus in the field; DEF-0564).
describe('o contexto da primeira tecla (G1)', () => {
  const nodes = (store: EditorStore) => [...walk(store.getState().document.pages[0]?.tree ?? ({ children: [] } as never))];
  const leaves = (store: EditorStore) => nodes(store).filter((n) => n.children.length === 0 && n.type !== MODEL_RULES.root.type && n.tag === 'div');
  async function typedThen(prepare: (store: EditorStore) => void, move: (store: EditorStore) => void): Promise<EditorStore> {
    const store = storeOf();
    dispatch(store, 'selection.select', { target: leaves(store)[0]?.id });
    prepare(store);
    dispatch(store, 'quickPanel.setOpen', { open: 'open' });
    const stop = installKeymap(store, window);
    const stage = createRef<HTMLDivElement>();
    const drawn = mount(store, createElement('div', { ref: stage }, createElement(QuickPanel, { stage })));
    await frames(2);
    const field = [...drawn.host.querySelectorAll<HTMLInputElement>('.quick-panel__fields input')].find((one) => (one.closest('[data-door]')?.getAttribute('data-door') ?? '').includes('quick-panel-width'));
    if (field === undefined) throw new Error('no width field');
    type(field, '33px');
    expect(heldTyping()?.field, 'o campo segura a digitação').toBe(field);
    // what the field edits moves, the focus still in the field (a key, a command from the field's own region)
    act(() => {
      field.focus();
      move(store);
    });
    await frames(2);
    drawn.stop();
    stop();
    return store;
  }

  it('a classe-alvo trocada com a digitação pendente: o valor vai à classe em que foi digitado', async () => {
    const store = await typedThen(
      (s) => {
        dispatch(s, 'classes.create', { name: 'destaque' });
        dispatch(s, 'classes.apply', { className: 'destaque' });
        dispatch(s, 'inspector.setStyleTarget', { target: 'class', className: 'destaque' });
      },
      (s) => void dispatch(s, 'inspector.setStyleTarget', { target: 'element' }),
    );
    const own = leaves(store)[0];
    const cls = (store.getState().document.classes ?? []).find((c) => c.name === 'destaque');
    expect({ classe: JSON.stringify(cls?.styles ?? {}).includes('"33px"'), elemento: own === undefined ? null : (storedValue(own, 'width', MODEL_RULES) ?? null) }, 'onde o valor foi gravado').toEqual({ classe: true, elemento: null });
  });

  it('o playhead movido para outro quadro-chave com a digitação pendente: o valor vai ao quadro-chave em que foi digitado', async () => {
    let typedOn: unknown = null;
    const store = await typedThen(
      (s) => {
        dispatch(s, 'animation.create', { name: 'Entrada' });
        dispatch(s, 'workspace.setPanelOpen', { panel: 'timeline', open: 'open' });
        dispatch(s, 'timeline.setPlayhead', { time: 0 });
        typedOn = keyframeTarget(s.getState());
      },
      (s) => void dispatch(s, 'timeline.setPlayhead', { time: 100_000 }),
    );
    expect(typedOn, 'o playhead estava sobre o quadro-chave de 0%').not.toBeNull();
    const animation = leaves(store)[0]?.animations?.[0];
    const holding = (animation?.keyframes ?? []).filter((k) => JSON.stringify(k).includes('"33px"')).map((k) => k.offset);
    expect(holding, 'os quadros-chave que guardam o valor').toEqual([0]);
  });

  it('a seleção trocada com a classe como alvo e o foco no campo: o valor vai à classe em que foi digitado', async () => {
    let other: string | undefined;
    const store = await typedThen(
      (s) => {
        dispatch(s, 'classes.create', { name: 'destaque' });
        dispatch(s, 'classes.apply', { className: 'destaque' });
        dispatch(s, 'inspector.setStyleTarget', { target: 'class', className: 'destaque' });
        other = nodes(s).find((n) => n.children.length === 0 && n.type !== MODEL_RULES.root.type && n.id !== leaves(s)[0]?.id)?.id;
      },
      (s) => void dispatch(s, 'selection.select', { target: other }),
    );
    const first = leaves(store)[0];
    const second = nodes(store).find((n) => n.id === other);
    const cls = (store.getState().document.classes ?? []).find((c) => c.name === 'destaque');
    expect({ classe: JSON.stringify(cls?.styles ?? {}).includes('"33px"'), primeiro: first === undefined ? null : (storedValue(first, 'width', MODEL_RULES) ?? null), segundo: second === undefined ? null : (storedValue(second, 'width', MODEL_RULES) ?? null) }, 'onde o valor foi gravado').toEqual({ classe: true, primeiro: null, segundo: null });
  });

  it('a seleção trocada com o foco no campo: o valor vai ao elemento em que foi digitado', async () => {
    let other: string | undefined;
    const store = await typedThen(
      (s) => {
        other = nodes(s).find((n) => n.children.length === 0 && n.type !== MODEL_RULES.root.type && n.id !== leaves(s)[0]?.id)?.id;
      },
      (s) => void dispatch(s, 'selection.select', { target: other }),
    );
    const first = leaves(store)[0];
    const second = nodes(store).find((n) => n.id === other);
    expect({ primeiro: first === undefined ? null : (storedValue(first, 'width', MODEL_RULES) ?? null), segundo: second === undefined ? null : (storedValue(second, 'width', MODEL_RULES) ?? null) }, 'onde o valor foi gravado').toEqual({ primeiro: '33px', segundo: null });
  });

  // DEF-0604: the field kept the text typed for the first element once the selection moved to a second that shows the
  // same (both unset): it read "33px" there, and an Enter wrote it to the second. It shows the second's own value.
  it('a seleção trocada com o foco no campo: o campo mostra o valor do novo elemento, não o texto digitado', async () => {
    const store = storeOf();
    const first = leaves(store)[0]?.id;
    const other = nodes(store).find((n) => n.children.length === 0 && n.type !== MODEL_RULES.root.type && n.id !== first)?.id;
    dispatch(store, 'selection.select', { target: first });
    dispatch(store, 'quickPanel.setOpen', { open: 'open' });
    const stop = installKeymap(store, window);
    const stage = createRef<HTMLDivElement>();
    const drawn = mount(store, createElement('div', { ref: stage }, createElement(QuickPanel, { stage })));
    await frames(2);
    const width = () => [...drawn.host.querySelectorAll<HTMLInputElement>('.quick-panel__fields input')].find((one) => (one.closest('[data-door]')?.getAttribute('data-door') ?? '').includes('quick-panel-width'));
    const field = width();
    if (field === undefined) throw new Error('no width field');
    type(field, '33px');
    act(() => {
      field.focus();
      dispatch(store, 'selection.select', { target: other });
    });
    await frames(2);
    const second = nodes(store).find((n) => n.id === other);
    const shown = width()?.value ?? null;
    drawn.stop();
    stop();
    expect(second === undefined ? null : (storedValue(second, 'width', MODEL_RULES) ?? null), 'o segundo sem largura própria (o caso)').toBeNull();
    expect(shown, 'o campo do segundo elemento').toBe('');
  });

  // the same in the Style tab's length field (a NumberField: Letter spacing), as the use session met it (DEF-0604)
  it('a seleção trocada com o foco no campo de comprimento do inspector: o campo mostra o valor do novo elemento', async () => {
    const store = storeOf();
    const first = leaves(store)[0]?.id;
    const other = nodes(store).find((n) => n.children.length === 0 && n.type !== MODEL_RULES.root.type && n.id !== first)?.id;
    dispatch(store, 'selection.select', { target: first });
    const stop = installKeymap(store, window);
    const drawn = mount(store, createElement(Field, { entry: door('style.set#inspector-letter-spacing') }));
    await frames(2);
    const field = drawn.host.querySelector<HTMLInputElement>('input');
    if (field === null) throw new Error('no letter-spacing field');
    type(field, '3');
    act(() => {
      field.focus();
      dispatch(store, 'selection.select', { target: other });
    });
    await frames(2);
    const shown = drawn.host.querySelector<HTMLInputElement>('input')?.value ?? null;
    drawn.stop();
    stop();
    expect(shown, 'o campo do segundo elemento').toBe('');
  });

  // DEF-0608: the opacity's face said 100 % and, focused, its input held 1; it holds the face's text, read back alike
  it('o campo de opacidade guarda o texto do rosto: 0.5 é 50%', async () => {
    const store = storeOf();
    const first = leaves(store)[0]?.id;
    dispatch(store, 'selection.select', { target: first });
    dispatch(store, 'style.set', { property: 'opacity', value: '0.5' });
    const drawn = mount(store, createElement(Field, { entry: door('style.set#inspector-opacity') }));
    await frames(2);
    const held = drawn.host.querySelector<HTMLInputElement>('input.input')?.value ?? null;
    drawn.stop();
    expect(held, 'o texto do campo').toBe('50%');
  });
});

// A word the editor says while a field holds typing — an autosave's notice, the motion runtime's, the assistant's, a
// capture's (store.notice) — is no change of what the field edits: the typing stays in the field, held, and is kept
// when the person keeps it (rule G2; DEF-0565: any message arriving during the typing put the document's value back
// and let the typing go). The field's own refusal still shows the document again (FD2).
describe('um aviso do editor durante a digitação', () => {
  it('não apaga nem solta o que a pessoa digita', async () => {
    const store = storeOf();
    const tree = store.getState().document.pages[0]?.tree;
    const leaf = tree === undefined ? undefined : [...walk(tree)].find((n) => n.children.length === 0 && n.type !== MODEL_RULES.root.type && n.tag === 'div');
    dispatch(store, 'selection.select', { target: leaf?.id });
    dispatch(store, 'quickPanel.setOpen', { open: 'open' });
    const stop = installKeymap(store, window);
    const stage = createRef<HTMLDivElement>();
    const drawn = mount(store, createElement('div', { ref: stage }, createElement(QuickPanel, { stage })));
    await frames(2);
    const field = [...drawn.host.querySelectorAll<HTMLInputElement>('.quick-panel__fields input')].find((one) => (one.closest('[data-door]')?.getAttribute('data-door') ?? '').includes('quick-panel-width'));
    if (field === undefined) throw new Error('no width field');
    type(field, '33px');
    act(() => store.notice(message('status.save.journalInDatabase')));
    await frames(2);
    const during = { value: field.value, held: heldTyping()?.field === field };
    act(() => {
      field.focus();
      field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true, cancelable: true }));
    });
    await frames(2);
    const node = [...walk(store.getState().document.pages[0]?.tree ?? ({ children: [] } as never))].find((n) => n.id === leaf?.id);
    const kept = node === undefined ? null : (storedValue(node, 'width', MODEL_RULES) ?? null);
    drawn.stop();
    stop();
    expect({ ...during, kept }, 'a digitação depois do aviso').toEqual({ value: '33px', held: true, kept: '33px' });
  });

  // the field's own word still puts the document's value back (FD2): Escape in the field runs field.cancel, its own
  it('o Esc do próprio campo ainda devolve o valor do documento e solta a digitação', async () => {
    const store = storeOf();
    const tree = store.getState().document.pages[0]?.tree;
    const leaf = tree === undefined ? undefined : [...walk(tree)].find((n) => n.children.length === 0 && n.type !== MODEL_RULES.root.type && n.tag === 'div');
    dispatch(store, 'selection.select', { target: leaf?.id });
    dispatch(store, 'quickPanel.setOpen', { open: 'open' });
    const stop = installKeymap(store, window);
    const stage = createRef<HTMLDivElement>();
    const drawn = mount(store, createElement('div', { ref: stage }, createElement(QuickPanel, { stage })));
    await frames(2);
    const field = [...drawn.host.querySelectorAll<HTMLInputElement>('.quick-panel__fields input')].find((one) => (one.closest('[data-door]')?.getAttribute('data-door') ?? '').includes('quick-panel-width'));
    if (field === undefined) throw new Error('no width field');
    type(field, '33px');
    // the field's own Escape (its key context's, field.cancel), not the quick panel's: the panel's Escape closes it
    act(() => store.dispatch('field.cancel' as CommandId, { property: 'width' } as never));
    await frames(2);
    const after = { value: field.value, held: heldTyping()?.field === field };
    drawn.stop();
    stop();
    expect(after, 'o campo depois do seu próprio cancelamento').toEqual({ value: '', held: false });
  });
});
