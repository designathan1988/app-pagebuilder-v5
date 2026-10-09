// The modes of interaction the editor is in (the investigation's C6, option A), read from the state that already holds
// each one, never kept again: the pointer owner's gesture and the colour picker's session (input/pointer/shared.ts,
// sharedOf, a module whose loading runs nothing, since the editor's store imports this file), the typing a field holds
// (input/pending.ts), and the layers the store holds open (the context menu, the command bar, a dialog, a picker, a
// rename, a text edit, the preview, a confirmation). REFUSED_WHILE is the table of what never opens while another mode
// is on: during a pointer gesture the keys are the gesture's (input/keymap.ts), and a command from outside it (a file
// read that resolved, the assistant, a timer) runs through it. The editor's store reads the table before a command
// that changes no document runs inside an open gesture, from the editor state it would leave (modesWith): one that
// would open a refused mode waits for the gesture's end (DEF-0555); every command is checked again once it ran
// (store.ts, gestureSafe), and the generated map shows the table (tools/map/behavior.ts).
import type { EditorStore } from '../store.ts';
import type { EditorUi } from '../state.ts';
import { openContextMenu } from '../menus/context-menu.ts';
import { previewing } from '../view/preview.ts';
import { heldTyping } from './pending.ts';
import { sharedOf } from './pointer/shared.ts';

export type Mode = 'pointer-gesture' | 'picker-session' | 'typing' | 'context-menu' | 'command-bar' | 'dialog' | 'picker' | 'rename' | 'text-edit' | 'preview' | 'confirmation';

export const MODES: readonly Mode[] = ['pointer-gesture', 'picker-session', 'typing', 'context-menu', 'command-bar', 'dialog', 'picker', 'rename', 'text-edit', 'preview', 'confirmation'];

// What never opens while a mode is on. A pointer gesture (a drag, a resize, a marquee) holds the pointer and the keys
// until it ends: no layer opens under it, and a command that would open one is a command from outside the gesture.
export const REFUSED_WHILE = {
  'pointer-gesture': ['context-menu', 'command-bar', 'dialog', 'picker', 'rename', 'text-edit', 'preview', 'confirmation'],
} as const satisfies Partial<Record<Mode, readonly Mode[]>>;

// the modes a store is in now
export function modesOf(store: EditorStore): ReadonlySet<Mode> {
  return modesWith(store, store.getState().ui);
}

// the modes a store would be in with this editor state (what a command would leave: Store.uiAfter), the rest as it is
export function modesWith(store: EditorStore, ui: EditorUi): ReadonlySet<Mode> {
  const state = store.getState();
  const shared = sharedOf(store);
  const on: Record<Mode, boolean> = {
    'pointer-gesture': shared.open !== null && shared.open !== shared.session,
    'picker-session': shared.session !== null,
    typing: heldTyping() !== null,
    'context-menu': openContextMenu(ui) !== null,
    'command-bar': ui.commandBar === true,
    dialog: ui.dialog !== undefined,
    picker: ui.colorPicker !== null || ui.assetPicker !== null || ui.linkPicker !== null || ui.componentPrompt !== null,
    rename: ui.rename.node !== null,
    'text-edit': ui.textEdit.node !== null,
    preview: previewing(ui),
    confirmation: state.confirmation !== undefined && state.confirmation !== null,
  };
  return new Set(MODES.filter((mode) => on[mode]));
}

// the modes that opened between two moments although a mode on at both refuses them, in words
export function modeBreaches(before: ReadonlySet<Mode>, after: ReadonlySet<Mode>): string[] {
  const breaches: string[] = [];
  for (const [held, refused] of Object.entries(REFUSED_WHILE) as [Mode, readonly Mode[]][]) {
    if (!before.has(held) || !after.has(held)) continue;
    for (const mode of refused) if (!before.has(mode) && after.has(mode)) breaches.push(`${mode} opened during ${held}`);
  }
  return breaches;
}
