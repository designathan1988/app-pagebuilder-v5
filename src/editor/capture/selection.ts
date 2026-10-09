import { message, registerHandler } from '../../core/commands/registry.ts';
import { findCaptured } from '../../core/capture/edits.ts';
import type { StoreState } from '../../core/store/store.ts';
import type { EditorUi } from '../state.ts';

// Captured content shares the document store but has a distinct editing vocabulary. Keeping its
// selected id in editor UI avoids dispatching authored-element commands on an arbitrary HTML node.
export const selectCapturedCommand = registerHandler<'capture.select', EditorUi>('capture.select', ({ state }, { target }) => {
  const found = findCaptured(state.document, target);
  if (found === null) return { kind: 'refused', message: message('status.capture.nodeMissing') };
  const name = found.node.kind === 'element' ? found.node.tag : found.node.kind;
  return { kind: 'change', ui: { ...state.ui, capturedNode: target }, selection: [], message: message('status.selected', { name }) };
});

// The selection of a captured element follows the store's one selection (rule G6): a selection of the document's own
// elements takes it away, and so does a document that no longer holds it (another project opened, a step undone), so
// two selections never stand at once (DEF-0542).
export function capturedFollowsSelection(state: StoreState<EditorUi>): EditorUi {
  const id = state.ui.capturedNode;
  if (id === undefined) return state.ui;
  if (state.selection.length === 0 && findCaptured(state.document, id) !== null) return state.ui;
  const { capturedNode: _gone, ...rest } = state.ui;
  void _gone;
  return rest;
}
