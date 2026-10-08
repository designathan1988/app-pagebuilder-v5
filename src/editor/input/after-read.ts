// A command whose door reads something that arrives later runs in the context the input was made in (CLAUDE.md, rule
// G1). The system clipboard is such a read: the browser may first ask the person whether the editor may read it, and
// the page goes on taking clicks and keys meanwhile. The elements selected and the edit context (breakpoint, state,
// class, keyframe: the key the typing uses, store.ts editedKey) are taken when the key or the click comes; when the
// read arrives with another one, the command does not run and the status bar says the moment passed (status.stale),
// as a file dropped where its target is gone does (input/file-drop.ts; decisoes.md, DCS-019).
import { message } from '../../core/commands/registry.ts';
import { editedKey, type EditorStore } from '../store.ts';

export function afterRead<T>(store: EditorStore, read: Promise<T>, run: (value: T) => void): void {
  const taken = editedKey(store.getState());
  void read.then((value) => {
    if (editedKey(store.getState()) !== taken) {
      store.notice(message('status.stale'));
      return;
    }
    run(value);
  });
}
