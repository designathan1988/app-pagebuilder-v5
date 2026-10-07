// A narrow window (the plan's stage 5, jornada03 J25 and H17: at 1280 x 720 the canvas had 41 % of the window): below
// the manifest's width (interactions.json workspace.narrowWindow) a first visit opens with the sidebar closed, so the
// canvas takes the room (src/editor/store.ts narrowStart). Opened, the sidebar takes its column as in any window: it
// once opened over the canvas here, and the elements inserted from it, the canvas toolbar and the dock lay under it
// (CLAUDE.md, rule G4). Whether the window is narrow is the window's, not the document's nor the editor state's: read
// from the browser, as the canvas's fit is.
import { manifest } from '../../manifest/runtime.ts';

const width = manifest.interactions.constants.find((c) => c.id === 'workspace.narrowWindow')?.value;
if (typeof width !== 'number') throw new Error('interactions.json has no number workspace.narrowWindow');
const QUERY = `(max-width: ${width - 1}px)`;

// whether the window is narrow now (outside a browser: never)
export function windowIsNarrow(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(QUERY).matches;
}
