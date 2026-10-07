// G1 and G2 (CLAUDE.md, the editor's rules): a value typed in a field of the Inspector and not kept yet is kept once,
// in the context it was typed in — its elements and the breakpoint of the canvas then — before whatever the person does
// next, whatever door that is. One door of each kind that can come next is tried: a breakpoint tab, another tab of the
// Inspector, a press on another element (on the canvas and in Layers), a handle dragged on the canvas (a gesture that
// never leaves the field first), a menu command, and Undo (which then takes back the value just kept). Each field
// kind the Inspector types in is tried with each: a number, a style text, an attribute.
import { expect, nextFrames, test, type Page } from '../support/test.ts';
import { openEditor } from '../support/editor.ts';
import { door, openMenu, runs } from './door.ts';
import { NODE_PATH, type TestBootCommand } from '../../src/editor/test-boot.ts';

interface DocNode {
  readonly id: string;
  readonly name: string;
  readonly styles?: Readonly<Record<string, Readonly<Record<string, Readonly<Record<string, string>>>>>>;
  readonly attributes?: Readonly<Record<string, string>>;
  readonly children: readonly DocNode[];
}
interface Port {
  readonly document: () => { readonly pages: readonly { readonly tree: DocNode }[] };
  readonly selection: () => readonly string[];
  readonly history: () => { readonly undoSteps: number; readonly redoSteps: number };
}
interface Read {
  readonly nodes: readonly DocNode[];
  readonly selection: readonly string[];
  readonly undo: number;
  readonly redo: number;
}

const run = (ref: string, args: Readonly<Record<string, unknown>> = {}): TestBootCommand => ({ command: ref.split('#')[0] ?? '', args: { ...door(ref).args, ...args } });
const at = (path: string) => ({ [NODE_PATH]: path });

// the document's nodes in one list, the selection and the history, through the read-only test port
const read = (page: Page): Promise<Read> =>
  page.evaluate(() => {
    const port = (window as unknown as { __builderTestPort: Port }).__builderTestPort;
    const nodes: DocNode[] = [];
    const walk = (n: DocNode) => {
      nodes.push(n);
      n.children.forEach(walk);
    };
    walk(port.document().pages[0]?.tree as DocNode);
    const history = port.history();
    return { nodes, selection: port.selection(), undo: history.undoSteps, redo: history.redoSteps };
  });
const named = (state: Read, name: string): DocNode => {
  const found = state.nodes.find((n) => n.name === name);
  if (found === undefined) throw new Error(`no node named ${name}`);
  return found;
};

// a point of a node on the zoomed canvas, near its start, where a person aims at it
const pointOf = (page: Page, id: string) =>
  page.evaluate((nodeId) => {
    const frame = document.querySelector<HTMLIFrameElement>('.frame__page');
    const el = frame?.contentDocument?.querySelector(`[data-node="${nodeId}"]`);
    if (!frame || !el) throw new Error(`the canvas does not draw ${nodeId}`);
    const zoom = frame.currentCSSZoom;
    const f = frame.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: f.x + (r.x + Math.min(16, r.width / 2)) * zoom, y: f.y + (r.y + r.height / 2) * zoom };
  }, id);

interface Field {
  readonly name: string;
  readonly ref: string;
  readonly tab: 'style' | 'settings';
  readonly typed: string;
  // what the document holds for the field on a node, at a breakpoint
  readonly held: (node: DocNode, breakpoint: string) => string | undefined;
  readonly kept: string;
  // whether its value is held per breakpoint (a style) or once for every breakpoint (an attribute)
  readonly layered: boolean;
}
const style = (property: string) => (node: DocNode, breakpoint: string) => node.styles?.[breakpoint]?.base?.[property];
const FIELDS: readonly Field[] = [
  { name: 'a number field', ref: 'style.set#inspector-font-size', tab: 'style', typed: '48', held: style('font-size'), kept: '48px', layered: true },
  { name: 'a style text field', ref: 'style.set#inspector-font-family', tab: 'style', typed: 'Georgia', held: style('font-family'), kept: 'Georgia', layered: true },
  { name: 'an attribute field', ref: 'element.setAttribute#inspector-title', tab: 'settings', typed: 'Pour-over', held: (node) => node.attributes?.title, kept: 'Pour-over', layered: false },
];

interface Next {
  readonly name: string;
  readonly ref: string;
  // the undo steps the door itself makes
  readonly steps: number;
  readonly act: (page: Page, field: Field, state: Read) => Promise<void>;
}
const NEXT: readonly Next[] = [
  { name: 'a breakpoint tab', ref: 'view.setBreakpoint#toolbar-breakpoint-tabs-phone', steps: 0, act: (page) => page.locator('[data-door="view.setBreakpoint#toolbar-breakpoint-tabs-phone"]').click() },
  {
    name: 'another tab of the Inspector',
    ref: 'workspace.setActiveTab#inspector-tab-interactions',
    steps: 0,
    act: (page) => page.locator('[data-door="workspace.setActiveTab#inspector-tab-interactions"]').click(),
  },
  {
    name: 'a press on another element of the canvas',
    ref: 'selection.select#canvas-click-element-or-page',
    steps: 0,
    act: async (page, _field, state) => {
      const p = await pointOf(page, named(state, 'Intro').id);
      await page.mouse.click(p.x, p.y);
    },
  },
  {
    name: 'a row of Layers',
    ref: 'selection.select#layers-row',
    steps: 0,
    act: (page, _field, state) => page.locator(`[data-door="selection.select#layers-row"][data-args*='${named(state, 'Intro').id}']`).first().click(),
  },
  {
    name: 'a handle dragged on the canvas',
    ref: 'geometry.resize#handle-resize-e',
    steps: 1,
    act: async (page) => {
      const handle = await page.locator('[data-door="geometry.resize#handle-resize-e"]').first().boundingBox();
      if (handle === null) throw new Error('the selection draws no east handle');
      const from = { x: handle.x + handle.width / 2, y: handle.y + handle.height / 2 };
      await page.mouse.move(from.x, from.y);
      await page.mouse.down();
      await page.mouse.move(from.x - 60, from.y, { steps: 6 });
      await page.mouse.up();
    },
  },
  {
    name: 'a menu command',
    ref: 'element.duplicate#menu-edit',
    steps: 1,
    act: async (page) => {
      await openMenu(page, 'edit');
      await page.locator('[data-door="element.duplicate#menu-edit"]').click();
    },
  },
];

// a toolbar button pressed as a person presses it: at its centre, whatever it looked like a moment before (Undo looks
// unavailable while the typing is not kept yet, and the press keeps it first)
async function press(page: Page, ref: string): Promise<void> {
  const box = await page.locator(`[data-door="${ref}"]`).first().boundingBox();
  if (box === null) throw new Error(`${ref} is not drawn`);
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

async function typeInto(page: Page, field: Field): Promise<void> {
  const input = page.locator(`[data-door="${field.ref}"]`).first().locator('input').first();
  await input.click();
  await page.keyboard.press('Control+a');
  await page.keyboard.type(field.typed);
  await expect(input, 'the field holds what was typed, not kept yet').toHaveValue(field.typed);
}

async function setUp(page: Page, field: Field): Promise<Read> {
  await openEditor(page, {
    project: 'aurora',
    commands: [run('inspector.setMode#inspector-mode-all'), run('selection.select#layers-row', { target: at('/Page/Hero/Title') }), ...(field.tab === 'settings' ? [run('workspace.setActiveTab#inspector-tab-settings')] : [])],
  });
  await nextFrames(page);
  return read(page);
}

for (const field of FIELDS) {
  test.describe(field.name, () => {
    for (const next of NEXT) {
      test(`typed and then ${next.name}: kept once, where it was typed, before the door`, runs(field.ref, next.ref), async ({ page }) => {
        const before = await setUp(page, field);
        const title = named(before, 'Title');
        await typeInto(page, field);
        await next.act(page, field, before);
        await expect.poll(async () => field.held(named(await read(page), 'Title'), 'desktop'), { message: 'the value typed is kept on the element it was typed for, at the breakpoint it was typed at' }).toBe(field.kept);
        const after = await read(page);
        // at no other breakpoint (a tab of another breakpoint was the door: the value stays where it was typed)
        if (field.layered) expect(field.held(named(after, 'Title'), 'phone'), 'the value typed is not kept at another breakpoint').toBeUndefined();
        expect(after.undo, 'one undo step for the value kept, and the door its own').toBe(before.undo + 1 + next.steps);
        // the value was kept before the door ran: undoing the door's own step leaves it, one more undo takes it back
        if (next.steps > 0) {
          await press(page, 'history.undo#toolbar-top-bar');
          await expect.poll(async () => field.held(named(await read(page), 'Title'), 'desktop'), { message: 'undoing the door keeps the value typed before it' }).toBe(field.kept);
        }
        expect(after.nodes.some((n) => n.id === title.id), 'the element typed for is still there').toBe(true);
      });
    }
    test('typed and then Undo: the value is kept first, and Undo takes it back', runs(field.ref, 'history.undo#toolbar-top-bar', 'history.redo#toolbar-top-bar'), async ({ page }) => {
      const before = await setUp(page, field);
      const held = field.held(named(before, 'Title'), 'desktop');
      await typeInto(page, field);
      await press(page, 'history.undo#toolbar-top-bar');
      await expect.poll(async () => (await read(page)).redo, { message: 'Undo took back the value kept before it' }).toBe(1);
      expect(field.held(named(await read(page), 'Title'), 'desktop'), 'after Undo the element holds what it held before the typing').toBe(held);
      await press(page, 'history.redo#toolbar-top-bar');
      await expect.poll(async () => field.held(named(await read(page), 'Title'), 'desktop'), { message: 'Redo gives the value typed back' }).toBe(field.kept);
    });
  });
}
