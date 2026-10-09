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
import { TypedBand } from '../../../src/editor/canvas/edit-handles.tsx';
import { QuickPanel } from '../../../src/editor/canvas/quick-panel.tsx';
import { installKeymap } from '../../../src/editor/input/keymap.ts';
import { quickPanelOpen } from '../../../src/editor/quick-panel/quick-panel.ts';
import { heldTyping, keepTypingBefore } from '../../../src/editor/input/pending.ts';
import { GuidesGridsDialog } from '../../../src/editor/shell/guides-grids.tsx';
import { PanelField } from '../../../src/editor/shell/panel-field.tsx';
import { createEditorStore, MODEL_RULES, StoreContext, type EditorStore } from '../../../src/editor/store.ts';
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
