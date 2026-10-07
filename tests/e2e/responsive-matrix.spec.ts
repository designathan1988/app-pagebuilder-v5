// The editor's screens under the conditions a person meets them: the four windows the product supports (1280 x 720,
// 1366 x 768, 1440 x 900, 1920 x 1080), English and Portuguese (whose words are longer), the dark and the light theme,
// an empty project and a full one. Every surface a person opens is checked by the screen guard (tests/support/
// screen-guard.ts): a text cut, a one-line name on two lines, a control out of the window or under another, English left
// in the Portuguese editor.
//
// Not every combination: a pairwise covering array, where every pair of two conditions' values meets in some row (a
// defect needs one or two conditions together far more often than three: NIST's combinatorial testing), and the
// adverse one — the narrowest window in Portuguese, little room for the longest words — in both themes and both
// projects. The surfaces a state opens (the Data panel's mapping, the shared regions, the Motion dock, the gradient, the
// grid editor, the radius editor, a number field holding the focus) run each under four rows that cover every window,
// both languages and both themes, the adverse one among them. Every state is handed to the editor before it starts
// (tests/support/editor.ts): what this proves is the screen, never the way there.
import { expect, nextFrames, test, type Page, type TestInfo } from '../support/test.ts';
import { openEditor, type EditorSetup } from '../support/editor.ts';
import { guardScreen } from '../support/screen-guard.ts';
import { control, door, openMenu, openQuickPanel, runDoor } from './door.ts';
import type { TestBootCommand } from '../../src/editor/test-boot.ts';
import { NODE_PATH } from '../../src/editor/test-boot.ts';

interface Condition {
  readonly width: number;
  readonly height: number;
  readonly language: 'en' | 'pt-BR';
  readonly theme: 'dark' | 'light';
  readonly project: 'empty' | 'canonical';
}
const WINDOWS = { 1280: 720, 1366: 768, 1440: 900, 1920: 1080 } as const;
type Width = keyof typeof WINDOWS;
const row = ([width, language, theme, project]: readonly [Width, Condition['language'], Condition['theme'], Condition['project']]): Condition => ({ width, height: WINDOWS[width], language, theme, project });
// every pair of window, language, theme and project in some row; the last row completes the adverse condition (1280,
// Portuguese) in both themes and both projects
export const CONDITIONS: readonly Condition[] = (
  [
    [1280, 'en', 'dark', 'empty'],
    [1280, 'pt-BR', 'light', 'canonical'],
    [1366, 'en', 'light', 'canonical'],
    [1366, 'pt-BR', 'dark', 'empty'],
    [1440, 'en', 'dark', 'canonical'],
    [1440, 'pt-BR', 'light', 'empty'],
    [1920, 'en', 'light', 'empty'],
    [1920, 'pt-BR', 'dark', 'canonical'],
    [1280, 'pt-BR', 'dark', 'empty'],
  ] as const
).map(row);
// the rows the surfaces of a state run under: every window, both languages, both themes, the adverse one first
const SURFACE_CONDITIONS: readonly Condition[] = (
  [
    [1280, 'pt-BR', 'dark', 'canonical'],
    [1366, 'en', 'light', 'canonical'],
    [1440, 'pt-BR', 'light', 'canonical'],
    [1920, 'en', 'dark', 'canonical'],
  ] as const
).map(row);

// one element of each kind of the canonical page
const CANONICAL_KINDS: Readonly<Record<string, string>> = { header: 'c-header', paragraph: 'c-logo', navigation: 'c-nav', link: 'c-nav-0', section: 'c-hero', heading: 'c-title', image: 'c-hero-image', article: 'c-card-subscription', container: 'c-grid' };
// the kinds the empty project gets, inserted as the Insert panel's tiles insert them
const INSERTED = ['container', 'heading', 'paragraph', 'button', 'image', 'link', 'blockquote', 'input-text', 'select', 'table'];
const MENUS = ['file', 'edit', 'arrange', 'view', 'help'];
const VIEWS = ['insert', 'explorer', 'styles', 'data', 'assistant'];
const DOCKS = ['timeline', 'motion', 'checks'];
const DIALOGS = ['workspace.openDialog#menu-view-breakpoints', 'workspace.openDialog#menu-view-guides-grids', 'workspace.openDialog#menu-file-capture-url', 'workspace.openDialog#menu-snap-snap-settings'];
const BREAKPOINTS = ['laptop', 'tablet', 'phone', 'desktop'];
const ZOOMS = [25, 200, 100];
const TABS = ['style', 'settings', 'interactions'];

// a door's command with the arguments its control gives, and the ones a step adds
const run = (ref: string, args: Readonly<Record<string, unknown>> = {}): TestBootCommand => ({ command: ref.split('#')[0] ?? '', args: { ...door(ref).args, ...args } });
const node = (path: string) => ({ [NODE_PATH]: path });
// the commands that put the editor in a condition's language and theme
const conditionCommands = (c: Condition): TestBootCommand[] => [
  ...(c.theme === 'light' ? [run('preferences.setTheme#menu-theme-light')] : []),
  ...(c.language === 'pt-BR' ? [run('preferences.setLanguage#menu-language-pt-br')] : []),
];

const selection = (page: Page) => page.evaluate(() => (window as unknown as { __builderTestPort: { selection: () => string[] } }).__builderTestPort.selection());

// the screen as it stands, checked by the guard under the step's name
async function check(page: Page, info: TestInfo, step: string): Promise<void> {
  await nextFrames(page);
  expect(await guardScreen(page, info, step), `the screen at ${step}`).toEqual([]);
}
async function closeAll(page: Page): Promise<void> {
  for (let i = 0; i < 3; i += 1) await page.keyboard.press('Escape');
}

// the editor under a condition, with its project, and the elements a sweep selects (by kind)
async function setUp(page: Page, c: Condition): Promise<Record<string, string>> {
  await page.setViewportSize({ width: c.width, height: c.height });
  // each kind inserted at the page's end, as a tile inserts it with nothing selected (an insertion selects what it made)
  const clear = run('selection.clear#key-escape-in-canvas');
  const inserts = c.project === 'empty' ? INSERTED.flatMap((entry) => [run('element.insert#elements-tile', { entry }), clear]) : [];
  await openEditor(page, { ...(c.project === 'canonical' ? { project: 'canonical' } : {}), commands: [...inserts, ...conditionCommands(c)] });
  await expect.poll(() => page.evaluate(() => document.documentElement.lang)).toBe(c.language);
  if (c.project === 'canonical') return { ...CANONICAL_KINDS };
  // the inserted elements, by their kind, read from the document
  return page.evaluate((kinds) => {
    const found: Record<string, string> = {};
    const walk = (n: { id: string; type: string; children: unknown[] }) => {
      if (kinds.includes(n.type) && found[n.type] === undefined) found[n.type] = n.id;
      for (const child of n.children) walk(child as never);
    };
    const doc = (window as unknown as { __builderTestPort: { document: () => { pages: { tree: never }[] } } }).__builderTestPort.document();
    walk(doc.pages[0]?.tree as never);
    return found;
  }, INSERTED);
}

// Below the narrow window's width the sidebar opens over the canvas and the dock (src/editor/workspace/narrow.ts): a
// person puts it away (Ctrl+B) to reach what it lies over
async function sidebarAway(page: Page, ref: string): Promise<void> {
  const target = page.locator(`[data-door="${ref}"]`).first();
  if (!(await target.isVisible())) return;
  const covered = await target.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return hit !== null && !el.contains(hit) && hit.closest('.sidebar') !== null;
  });
  if (covered) await runDoor(page, 'workspace.toggleLeftDock#key-ctrl-b-in-global');
}

// an element of the page brought into the canvas's view with the wheel, as a person scrolls to it, and its centre
async function inView(page: Page, id: string): Promise<{ readonly x: number; readonly y: number }> {
  const view = await page.locator('.frame__view').boundingBox();
  if (view === null) throw new Error('no canvas view');
  for (let i = 0; i < 20; i += 1) {
    await nextFrames(page);
    const at = await page.evaluate((nodeId) => {
      const frame = document.querySelector<HTMLIFrameElement>('.frame__page');
      const el = frame?.contentDocument?.querySelector(`[data-node="${nodeId}"]`);
      if (!frame || !el) return null;
      const r = el.getBoundingClientRect();
      const f = frame.getBoundingClientRect();
      const zoom = frame.currentCSSZoom;
      return { x: f.x + (r.x + r.width / 2) * zoom, y: f.y + (r.y + r.height / 2) * zoom };
    }, id);
    if (at === null) throw new Error(`no element ${id} on the canvas`);
    const off = at.y > view.y + 4 && at.y < view.y + view.height - 4 ? 0 : at.y - (view.y + view.height / 2);
    if (off === 0) return at;
    await page.mouse.move(view.x + view.width / 2, view.y + view.height / 2);
    await page.mouse.wheel(0, off);
  }
  throw new Error(`${id}: the wheel did not bring it into the canvas's view`);
}

// an element selected through its Layers row, the Explorer opened first where it is closed
async function select(page: Page, id: string): Promise<void> {
  const target = control(page, 'selection.select#layers-row', { args: { target: id } }).first();
  if (!(await target.isVisible())) await runDoor(page, 'workspace.setPanelOpen#toolbar-activity-bar-explorer');
  await target.scrollIntoViewIfNeeded();
  await target.click();
  await expect.poll(() => selection(page)).toEqual([id]);
}

const named = (c: Condition) => `${c.width}, ${c.language}, ${c.theme}, ${c.project} project`;

for (const c of CONDITIONS) {
  test.describe(named(c), () => {
    test('the menus and their submenus', async ({ page }, info) => {
      await setUp(page, c);
      for (const menu of MENUS) {
        await openMenu(page, menu);
        await check(page, info, `menu ${menu}`);
        const subs = page.locator('[role="menu"] [aria-haspopup="menu"]');
        for (let i = 0; i < (await subs.count()); i += 1) {
          await subs.nth(i).hover();
          await check(page, info, `menu ${menu} submenu ${i + 1}`);
        }
        await closeAll(page);
      }
    });

    test('the sidebar views, the docks and the command bar', async ({ page }, info) => {
      await setUp(page, c);
      for (const view of VIEWS) {
        await runDoor(page, `workspace.setPanelOpen#toolbar-activity-bar-${view}`);
        await check(page, info, `view ${view}`);
      }
      await closeAll(page);
      for (const dock of DOCKS) {
        await sidebarAway(page, `workspace.setPanelOpen#dock-strip-${dock}`);
        const strip = page.locator(`[data-door="workspace.setPanelOpen#dock-strip-${dock}"]`).first();
        if (await strip.isVisible()) await strip.click();
        else await control(page, 'workspace.setActiveTab#tab-strip-tab', { args: { panel: dock } }).first().click();
        await check(page, info, `dock ${dock}`);
      }
      await runDoor(page, 'commandBar.open#toolbar-top-bar-search');
      await check(page, info, 'command bar');
      await page.keyboard.type(c.language === 'en' ? 'card' : 'cart');
      await check(page, info, 'command bar, typed');
      await closeAll(page);
    });

    test('the dialogs', async ({ page }, info) => {
      await setUp(page, c);
      for (const ref of DIALOGS) {
        await runDoor(page, ref);
        await expect(page.locator('[role="dialog"][aria-modal="true"]').last()).toBeVisible();
        await check(page, info, `dialog ${ref.split('#')[1] ?? ref}`);
        await closeAll(page);
      }
    });

    test('the breakpoints and the zoom levels', async ({ page }, info) => {
      const ids = await setUp(page, c);
      const first = Object.values(ids)[0];
      if (first !== undefined) await select(page, first);
      for (const breakpoint of BREAKPOINTS) {
        await runDoor(page, `view.setBreakpoint#toolbar-breakpoint-tabs-${breakpoint}`);
        await check(page, info, `breakpoint ${breakpoint}`);
      }
      for (const zoom of ZOOMS) {
        await runDoor(page, `view.zoomTo#menu-zoom-${zoom}`);
        await check(page, info, `zoom ${zoom}`);
      }
    });

    test("each kind of element's inspector tabs and quick panel, and a text edited in place", async ({ page }, info) => {
      const ids = await setUp(page, c);
      for (const [kind, id] of Object.entries(ids)) {
        await select(page, id);
        for (const tab of TABS) {
          await runDoor(page, `workspace.setActiveTab#inspector-tab-${tab}`);
          await check(page, info, `${kind}: ${tab}`);
        }
        await openQuickPanel(page);
        await check(page, info, `${kind}: quick panel`);
        // closed through its own control: its open state stays across selections
        await page.locator('[data-quick-panel-chip][aria-expanded="true"]').click();
        await expect(page.locator('[data-quick-panel-chip][aria-expanded="true"]')).toHaveCount(0);
      }
      const heading = ids.heading;
      if (heading !== undefined) {
        await select(page, heading);
        // a click on the text in the canvas (its selection and the canvas's focus), then Enter, as a person starts editing
        const at = await inView(page, heading);
        await page.mouse.click(at.x, at.y);
        await expect.poll(() => selection(page)).toEqual([heading]);
        await page.keyboard.press('Enter');
        await expect(page.frameLocator('.frame__page').locator(`[data-node="${heading}"]`)).toHaveAttribute('contenteditable', 'plaintext-only');
        await check(page, info, 'heading: text edited in place');
        await closeAll(page);
      }
    });
  });
}

// The surfaces a state opens: the project, the commands that reach the state, and what a person does there last
interface Surface {
  readonly name: string;
  readonly setup: (c: Condition) => EditorSetup;
  readonly then?: (page: Page) => Promise<void>;
}
const at = (path: string) => run('selection.select#layers-row', { target: node(path) });
const SURFACES: readonly Surface[] = [
  {
    name: "the Data panel's mapping of a card",
    setup: (c) => ({ project: 'content-menu', commands: [at('/Page/Menu/Card'), run('workspace.setPanelOpen#toolbar-activity-bar-data'), ...conditionCommands(c)] }),
  },
  {
    name: 'the shared regions of a header',
    setup: (c) => ({ project: 'content-site', commands: [at('/Page/Header'), run('workspace.setPanelOpen#toolbar-activity-bar-data'), ...conditionCommands(c)] }),
  },
  {
    name: 'the Motion dock with its actions',
    setup: (c) => ({
      project: 'motion',
      commands: [at('/Page/Hero'), run('workspace.setActiveTab#inspector-tab-interactions'), run('motion.add#inspector-motion-add'), run('workspace.setPanelOpen#dock-strip-motion', { open: 'open' }), ...conditionCommands(c)],
      drawn: [run('motion.addAction#timeline-motion-add-action-after', { timeline: 'Hero click', kind: 'display' })],
    }),
  },
  {
    name: 'the gradient editor',
    setup: (c) => ({ project: 'aurora', commands: [at('/Page/Hero'), run('style.setBackgroundImage#inspector-background-image-gradient-add'), ...conditionCommands(c)] }),
  },
  {
    name: 'the grid editor',
    setup: (c) => ({ project: 'grid-page', commands: [at('/Page/Grid'), run('grid.enterEdit#canvas-double-click-grid-container', { target: node('/Page/Grid') }), at('/Page/Grid/Cell'), ...conditionCommands(c)] }),
  },
  {
    name: 'the radius editor with a corner of its own',
    setup: (c) => ({ project: 'aurora', commands: [at('/Page/Hero/Actions'), run('style.setRadius#inspector-border-bottom-left-radius-radius-editor', { corners: 'bottom-left', value: '24px' }), ...conditionCommands(c)] }),
  },
  {
    name: 'a size field holding the focus',
    setup: (c) => ({ project: 'aurora', commands: [at('/Page/Hero/Actions'), run('style.set#inspector-width', { property: 'width', value: '320px' }), ...conditionCommands(c)] }),
    then: async (page) => {
      // the field's value, then its unit menu's button, as Tab walks them
      await control(page, 'style.set#inspector-width').locator('input').first().click();
      await page.keyboard.press('Tab');
    },
  },
];

for (const surface of SURFACES) {
  test.describe(surface.name, () => {
    for (const c of SURFACE_CONDITIONS) {
      test(`${c.width}, ${c.language}, ${c.theme}`, async ({ page }, info) => {
        await page.setViewportSize({ width: c.width, height: c.height });
        await openEditor(page, surface.setup(c));
        await surface.then?.(page);
        await check(page, info, surface.name);
      });
    }
  });
}
