// The browser classes of stage 5 (item 5 of "DeepSeek's task: the visual and browser part"): what only the browser
// answers, with the project's fixture (the screen guard, the incident feed and the console errors come from it).
//  - Long Animation Frames: inserting, dragging, typing in a field, undoing and switching pages, each one with a
//    `long-animation-frame` observer; a frame over 50 ms becomes a defect, with the frame's `scripts[]`. The run warms
//    up before measuring: the first frame of a session pays for the compilation. This file measures the browser's wall
//    time: run it alone, because with other browsers on the same machine a frame goes past 50 ms through contention
//    (measured: 70.2 ms in an `onUp` frame with fifteen files in flight, and no frame over 50 ms with this file alone,
//    in both conditions).
//  - Memory: a `WeakRef` to the element before each action, twenty repetitions, `HeapProfiler.collectGarbage` and every
//    `WeakRef` empty at the end (DEF-0571: only the last turn's was checked).
//  - Text composition (IME) through the CDP: during the composition the key that would choose an entry runs no command,
//    and the text goes in whole; the composition is of a text that matches entries, so only the keymap's guard stops the
//    Enter, and the same Enter after the composition commits runs the entry (the control).
//  - Clipboard: copying and pasting a node with a style gives back the same; pasting external HTML with `onclick` does
//    not let the attribute into the document, and the pasted node clicked on the canvas runs nothing.
//  - Forced colours and reduced motion: no control that could be seen stops being seen, nor vanishes against the
//    background (the control's colour equal to that of the background it has).
//  - Bidirectional text: a page with `dir="rtl"` (`pageDirection`) and a text of Hebrew characters and mixed Latin
//    content; the canvas draws the text right to left, and editing shows the same text.
//  - Quota: localStorage full; the autosave does not lose the document and says the journal moved to IndexedDB
//    (`status.save.journalInDatabase`, src/editor/persistence/autosave.ts).
import fs from 'node:fs';
import { expect, test, type Page } from '../support/test.ts';
import { openEditor } from '../support/editor.ts';
import { openQuickPanel, pagePoint, runDoor, runs } from './door.ts';

const FIXTURE = 'manifest/features/fixtures/aurora.json';
const OPEN = 'project.open#menu-file';
const INSERT = 'element.insert#elements-tile';
const DELETE = 'element.delete#key-delete-in-canvas';
// the delete through Edit › Delete: the canvas shortcut only acts with the canvas context (inserting leaves the focus on the palette)
const DELETE_MENU = 'element.delete#menu-edit';
const UNDO = 'history.undo#key-ctrl-z-in-global';
const COPY = 'clipboard.copy#key-ctrl-c-in-global';
const PASTE = 'clipboard.paste#key-ctrl-v-in-global';
const SELECT_ROW = 'selection.select#layers-row';
const EXPLORER = 'workspace.setPanelOpen#toolbar-activity-bar-explorer';
const INSERT_PANEL = 'workspace.setPanelOpen#toolbar-activity-bar-insert';

// aurora's document, as the test port reads it
const tree = (page: Page) =>
  page.evaluate(() => {
    const port = (window as unknown as { __builderTestPort: { document: () => { pages: { tree: unknown }[] }; selection: () => readonly string[] } }).__builderTestPort;
    return { tree: port.document().pages[0]?.tree ?? null, selection: port.selection() };
  });
const idsOf = (page: Page): Promise<readonly string[]> =>
  page.evaluate(() => {
    const walk = (n: { id: string; children: unknown[] }): string[] => [n.id, ...n.children.flatMap((c) => walk(c as never))];
    const port = (window as unknown as { __builderTestPort: { document: () => { pages: { tree: never }[] } } }).__builderTestPort;
    return walk(port.document().pages[0]?.tree as never);
  });
const stylesOf = (page: Page, id: string): Promise<unknown> =>
  page.evaluate((node) => {
    const walk = (n: { id: string; styles: unknown; children: unknown[] }): unknown => (n.id === node ? n.styles : (n.children.map((c) => walk(c as never)).find((s) => s !== null && s !== undefined) ?? null));
    const port = (window as unknown as { __builderTestPort: { document: () => { pages: { tree: never }[] } } }).__builderTestPort;
    return walk(port.document().pages[0]?.tree as never);
  }, id);

// the history's undo steps, as the test port reads them
const undoSteps = (page: Page): Promise<number> => page.evaluate(() => (window as unknown as { __builderTestPort: { history: () => { undoSteps: number } } }).__builderTestPort.history().undoSteps);
// the drag's undo when the drag made a step: a drag that moved nothing records none, and an undo then would take back
// what came before it (the page the case added)
const undoTheDrag = async (page: Page, before: number): Promise<void> => {
  if ((await undoSteps(page)) > before) await page.keyboard.press('Control+z');
};

const openAurora = async (page: Page): Promise<void> => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openEditor(page);
  const chooser = page.waitForEvent('filechooser');
  await runDoor(page, OPEN);
  await (await chooser).setFiles({ name: 'aurora.json', mimeType: 'application/json', buffer: fs.readFileSync(FIXTURE) });
  await expect(page.frameLocator('.frame__page').locator('[data-node="n-title"]')).toHaveCount(1);
  await runDoor(page, SELECT_ROW, { args: { target: 'n-hero' } });
};

// ---------------------------------------------------------------- long frames

interface Frame {
  readonly duration: number;
  readonly scripts: readonly string[];
}
const observeFrames = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    const held: { duration: number; scripts: string[] }[] = [];
    (window as unknown as { __frames: typeof held }).__frames = held;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const frame = entry as PerformanceEntry & { scripts?: readonly { sourceURL?: string; sourceFunctionName?: string }[] };
        held.push({ duration: frame.duration, scripts: (frame.scripts ?? []).map((s) => `${s.sourceFunctionName ?? '?'}@${s.sourceURL ?? '?'}`) });
      }
    }).observe({ type: 'long-animation-frame', buffered: true });
  });
};
const framesOf = (page: Page): Promise<readonly Frame[]> => page.evaluate(() => (window as unknown as { __frames: Frame[] }).__frames ?? []);

test('no animation frame goes past 50 ms when inserting, dragging, typing, undoing and switching pages', runs(OPEN, INSERT, UNDO, EXPLORER, 'pages.add#explorer-add-page', 'pages.switch#file-tab', INSERT_PANEL), async ({ page }) => {
  test.setTimeout(180_000);
  await observeFrames(page);
  await openAurora(page);

  // a warm-up run with the same actions: the first frame of each path pays for compiling the code
  await page.evaluate(() => ((window as unknown as { __frames: unknown[] }).__frames.length = 0));
  const tile = page.locator(`[data-door="${INSERT}"][data-args*='"entry":"section"']`).first();
  // the second page, for the measured page switch (DEF-0571: the case opened and closed the command bar instead)
  await runDoor(page, EXPLORER);
  await page.locator('[data-door="pages.add#explorer-add-page"]').first().click();
  const tabs = page.locator('[data-door="pages.switch#file-tab"]');
  await expect(tabs, 'the new page drew its tab').toHaveCount(2);
  // the page tabs stand in the Explorer and the tiles in the Insert panel, which share the side: each comes back when
  // its control is out of sight, as a person opens it
  const toPage = async (index: number): Promise<void> => {
    if (!(await tabs.nth(index).isVisible())) await runDoor(page, EXPLORER);
    await tabs.nth(index).click();
  };
  const insertSection = async (): Promise<void> => {
    if (!(await tile.isVisible())) await runDoor(page, INSERT_PANEL);
    await tile.click();
  };
  await toPage(0);
  await expect(page.frameLocator('.frame__page').locator('[data-node="n-hero"]')).toHaveCount(1);
  await insertSection();
  await page.keyboard.press('Control+z');
  const first = await pagePoint(page, 'centre');
  const beforeWarmDrag = await undoSteps(page);
  await page.mouse.move(first.x, first.y);
  await page.mouse.down();
  await page.mouse.move(first.x + 60, first.y + 30, { steps: 8 });
  await page.mouse.up();
  await undoTheDrag(page, beforeWarmDrag);
  await toPage(1);
  await toPage(0);
  await expect(page.frameLocator('.frame__page').locator('[data-node="n-hero"]')).toHaveCount(1);
  await page.waitForTimeout(200);
  await page.evaluate(() => ((window as unknown as { __frames: unknown[] }).__frames.length = 0));

  await insertSection();
  await page.keyboard.press('Control+z');
  const at = await pagePoint(page, 'centre');
  const beforeDrag = await undoSteps(page);
  await page.mouse.move(at.x, at.y);
  await page.mouse.down();
  // a person's drag: one step per frame (~60 per second), and not the burst the synthetic mouse delivers
  for (let step = 1; step <= 10; step++) {
    await page.mouse.move(at.x + 16 * step, at.y + 9 * step);
    await page.waitForTimeout(16);
  }
  await page.mouse.up();
  await undoTheDrag(page, beforeDrag);
  // typing in a field: the inspector's search field
  const field = page.locator('aside.inspector input[type="search"], aside.inspector input[type="text"]').first();
  if ((await field.count()) > 0) {
    await field.click();
    await page.keyboard.type('padding');
    await page.keyboard.press('Escape');
  }
  // switching pages: the other tab and back, each page drawn in the frame
  await toPage(1);
  await expect(page.frameLocator('.frame__page').locator('[data-node="n-hero"]'), 'the other page is in the frame').toHaveCount(0);
  await toPage(0);
  await expect(page.frameLocator('.frame__page').locator('[data-node="n-hero"]'), 'the first page came back to the frame').toHaveCount(1);
  await page.waitForTimeout(200);

  const long = (await framesOf(page)).filter((frame) => frame.duration > 50);
  expect(long.map((frame) => `${frame.duration.toFixed(1)} ms: ${frame.scripts.join(', ')}`), 'animation frames over 50 ms').toEqual([]);
});

// ---------------------------------------------------------------- memory

test('an unmounted control is not held: the WeakRef empties after collection', runs(OPEN, INSERT, DELETE_MENU), async ({ page, context }) => {
  test.setTimeout(600_000);
  await openAurora(page);
  const cdp = await context.newCDPSession(page);
  const alive: string[] = [];
  // every turn's element is held, not only the last one's (DEF-0571)
  const holdInPage = (selector: string): Promise<void> =>
    page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el === null) throw new Error(`the element ${sel} is not drawn`);
      const held = window as unknown as { __probes?: WeakRef<Element>[] };
      (held.__probes ??= []).push(new WeakRef(el));
    }, selector);
  // Each action twenty times; at the end, garbage collections in a loop (up to twelve, with a wait between them: a
  // single one is unstable, and it was an unstable measurement that brought down DEF-0522's first hypothesis) and the
  // WeakRefs of the twenty turns, which must be empty: a control out of the document cannot stay referenced.
  const cycle = async (what: string, action: () => Promise<void>): Promise<void> => {
    await page.evaluate(() => void ((window as unknown as { __probes?: WeakRef<Element>[] }).__probes = []));
    for (let i = 0; i < 20; i++) await action();
    const turns = await page.evaluate(() => (window as unknown as { __probes?: WeakRef<Element>[] }).__probes?.length ?? 0);
    expect(turns, `${what}: the twenty turns kept their element`).toBe(20);
    let held: readonly string[] = ['not measured'];
    for (let round = 0; round < 12 && held.length > 0; round++) {
      await cdp.send('HeapProfiler.collectGarbage');
      await page.waitForTimeout(60);
      held = await page.evaluate(() =>
        ((window as unknown as { __probes?: WeakRef<Element>[] }).__probes ?? []).flatMap((probe, turn) => {
          const el = probe.deref();
          return el === undefined ? [] : [`turn ${String(turn + 1)} ${el.isConnected ? 'connected' : 'leaked'}`];
        }),
      );
    }
    // the element on the page now (the last turn's, when the action leaves it drawn) is no leak
    const leaked = held.filter((one) => one.endsWith('leaked'));
    if (leaked.length > 0) alive.push(`${what} (${leaked.join(', ')})`);
  };

  await cycle('the menu', async () => {
    await page.locator('[data-menu="file"]').first().click();
    await holdInPage('[data-region="menu:file"]');
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-region="menu:file"]'), 'the menu closes').toHaveCount(0);
  });
  // The quick panel closed by Esc: DEF-0522's path, corrected (the focus goes back to the chip with the panel still
  // drawn, and only then does it leave the page).
  await cycle('the quick panel', async () => {
    await openQuickPanel(page);
    await holdInPage('.quick-panel');
    await page.keyboard.press('Escape');
    await expect(page.locator('.quick-panel'), 'the quick panel closes').toHaveCount(0);
    // the focus stays on the chip, the same element the close gave it to (DEF-0533: a frame later it was mounted again
    // and the focus fell to the body; measured in Chrome before and after the correction)
    await expect.poll(() => page.evaluate(() => document.activeElement?.matches('[data-quick-panel-chip][aria-expanded="false"]') === true), { message: 'the focus stays on the chip after the close' }).toBe(true);
    await page.waitForTimeout(50);
    expect(await page.evaluate(() => document.activeElement?.matches('[data-quick-panel-chip][aria-expanded="false"]') === true), 'the focus is still on the chip a moment later').toBe(true);
  });
  await cycle('the node inserted and deleted', async () => {
    await page.locator(`[data-door="${INSERT}"][data-args*='"entry":"section"']`).first().click();
    const id = await page.evaluate(() => (window as unknown as { __builderTestPort: { selection: () => readonly string[] } }).__builderTestPort.selection()[0] ?? null);
    if (id === null) throw new Error('the insert left no selection');
    await page.evaluate((node) => {
      const el = document.querySelector<HTMLIFrameElement>('.frame__page')?.contentDocument?.querySelector(`[data-node="${node}"]`);
      if (el === null || el === undefined) throw new Error(`the canvas does not draw ${node}`);
      ((window as unknown as { __probes?: WeakRef<Element>[] }).__probes ??= []).push(new WeakRef(el));
    }, id);
    await runDoor(page, DELETE_MENU);
    await expect.poll(() => idsOf(page), { message: `the deleted node ${id} leaves the document` }).not.toContain(id);
  });
  await runDoor(page, EXPLORER);
  await page.locator('[data-door="pages.add#explorer-add-page"]').first().click();
  const tabs = page.locator('[data-door="pages.switch#file-tab"]');
  await expect(tabs, 'the new page drew its tab').toHaveCount(2);
  await cycle('the switched page', async () => {
    await tabs.nth(0).click();
    await expect(page.locator('.frame__page')).toBeVisible();
    await page.evaluate(() => {
      // a node of the page that leaves, and not the frame's body (which the switch reuses)
      const el = document.querySelector<HTMLIFrameElement>('.frame__page')?.contentDocument?.querySelector('[data-node="n-hero"]');
      if (el === null || el === undefined) throw new Error('the page did not draw the hero');
      ((window as unknown as { __probes?: WeakRef<Element>[] }).__probes ??= []).push(new WeakRef(el));
    });
    await tabs.nth(1).click();
    // the page that left is no longer drawn: the frame shows the other one
    await expect(page.frameLocator('.frame__page').locator('[data-node="n-hero"]'), 'the switched page leaves the frame').toHaveCount(0);
  });

  expect(alive, 'controls that stay alive after garbage collection').toEqual([]);
});

// ---------------------------------------------------------------- text composition (IME)

test('during composition no shortcut fires and the text goes in whole', runs(OPEN), async ({ page, context }) => {
  test.setTimeout(120_000);
  await openAurora(page);
  const cdp = await context.newCDPSession(page);
  await page.keyboard.press('Control+k');
  const field = page.locator('[data-region="command-palette"] input[role="combobox"]');
  await expect(field, 'the command bar opens with its field').toBeVisible();
  await field.click();
  await field.press('Control+a');
  await field.press('Backspace');
  const nodesBefore = await idsOf(page);
  // The composition of a text that matches entries (measured in Chrome: "wrap" lists Wrap in a row, in a column, in a
  // container): the text is not committed yet, and the Enter, which arrives with isComposing, must not run the entry
  // (src/editor/input/keymap.ts, `if (event.isComposing || event.keyCode === 229) return;`). Without the guard, the
  // Enter would run the first listed entry (DEF-0571: the kana composition matched nothing and the case passed without it).
  await cdp.send('Input.imeSetComposition', { text: 'wrap', selectionStart: 4, selectionEnd: 4 });
  await expect(page.locator('[data-region="command-palette"] [role="option"]').first(), 'the query being composed lists entries').toBeVisible();
  await field.press('Enter');
  expect(await idsOf(page), 'the key pressed during composition ran a command').toEqual(nodesBefore);
  await expect(field, 'the bar stays open during composition').toBeVisible();
  // the composition commits the whole text
  await cdp.send('Input.insertText', { text: 'wrap' });
  await expect(field).toHaveValue('wrap');
  // the control: the same Enter, without composition, runs the first entry (a new wrapper in the document)
  await field.press('Enter');
  await expect.poll(() => idsOf(page).then((ids) => ids.length), { message: 'the Enter outside composition runs the listed entry' }).toBeGreaterThan(nodesBefore.length);
});

// ---------------------------------------------------------------- clipboard

test('copying and pasting a node with a style gives back the same, and external HTML with onclick does not get in', runs(OPEN, COPY, PASTE), async ({ page, context }) => {
  test.setTimeout(120_000);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await openAurora(page);
  await runDoor(page, SELECT_ROW, { args: { target: 'n-title' } });
  const before = await idsOf(page);
  await runDoor(page, COPY);
  // the copy settles in the clipboard before the paste reads it: without this wait, with the machine loaded the paste
  // read before the write and the command was refused (the battery runs with three processes)
  await expect.poll(() => page.evaluate(async () => (await navigator.clipboard.readText()).includes('builder/elements')), { message: 'the copy settles in the clipboard' }).toBe(true);
  await runDoor(page, PASTE);
  await expect.poll(() => idsOf(page).then((ids) => ids.length), { message: 'the paste leaves a new node' }).toEqual(before.length + 1);
  const after = await idsOf(page);
  const added = after.filter((id) => !before.includes(id));
  expect(added, 'the paste left one new node').toHaveLength(1);
  const copy = added[0] as string;
  expect(await stylesOf(page, copy), "the pasted node's style is the copied node's").toEqual(await stylesOf(page, 'n-title'));

  // external HTML with onclick: the attribute must not get through the paste
  const nodes = (await idsOf(page)).length;
  await page.evaluate(async () => {
    await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob(['<div onclick="window.pwned=1">x</div>'], { type: 'text/html' }) })]);
  });
  const beforeExternal = await idsOf(page);
  await runDoor(page, PASTE);
  await expect.poll(() => idsOf(page).then((ids) => ids.length), { message: 'pasting the external HTML leaves a node' }).toBeGreaterThan(nodes);
  // the attribute never enters the document: no attribute of the pasted nodes is an event handler (DEF-0571: the case
  // read only the editor's window, and nothing clicked the pasted node)
  const pasted = (await idsOf(page)).filter((id) => !beforeExternal.includes(id));
  const handlers = await page.evaluate((ids) => {
    const port = (window as unknown as { __builderTestPort: { document: () => { pages: { tree: unknown }[] } } }).__builderTestPort;
    type Node = { id: string; attributes: Record<string, unknown>; customAttributes?: Record<string, unknown>; children: Node[] };
    const all: Node[] = [];
    const walk = (n: Node) => {
      all.push(n);
      n.children.forEach(walk);
    };
    walk(port.document().pages[0]?.tree as Node);
    return all.filter((n) => ids.includes(n.id)).flatMap((n) => [...Object.keys(n.attributes), ...Object.keys(n.customAttributes ?? {})].filter((name) => /^on/i.test(name)).map((name) => `${n.id}.${name}`));
  }, pasted);
  expect(pasted.length, 'the paste left new nodes').toBeGreaterThan(0);
  expect(handlers, 'event attributes on the pasted nodes').toEqual([]);
  // the pasted node clicked on the canvas runs nothing, in the frame's window nor in the editor's
  const point = await page.evaluate((node) => {
    const iframe = document.querySelector<HTMLIFrameElement>('.frame__page');
    const el = iframe?.contentDocument?.querySelector(`[data-node="${node}"]`);
    if (iframe === null || iframe === undefined || el === null || el === undefined) throw new Error('the canvas did not draw the pasted node');
    const zoom = iframe.currentCSSZoom;
    const frame = iframe.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return { x: frame.left + (rect.left + rect.width / 2) * zoom, y: frame.top + (rect.top + rect.height / 2) * zoom };
  }, pasted[0] ?? '');
  await page.mouse.click(point.x, point.y);
  expect(await page.evaluate(() => (window as unknown as { pwned?: number }).pwned), "the pasted HTML's onclick ran in the editor").toBeUndefined();
  expect(await page.evaluate(() => (document.querySelector<HTMLIFrameElement>('.frame__page')?.contentWindow as unknown as { pwned?: number } | null)?.pwned), "the pasted HTML's onclick ran in the canvas").toBeUndefined();
});

// ---------------------------------------------------------------- forced colours and reduced motion

test('with forced colours and reduced motion no control that could be seen stops being seen', runs(OPEN), async ({ page }) => {
  test.setTimeout(120_000);
  await openAurora(page);
  // what forced colours change is colour: a control is seen when it is drawn and its colour (its text's and its
  // icons', which draw in currentColor) differs from the background it stands on, the first one not transparent up its
  // ancestors (DEF-0571: the case measured only visibility and display, which forced colours never change)
  const seen = () =>
    page.evaluate(() => {
      const opaque = (colour: string) => !/rgba\(.*,\s*0\)$/.test(colour) && colour !== 'transparent';
      const backgroundOf = (from: Element): string => {
        for (let at: Element | null = from; at !== null; at = at.parentElement) {
          const colour = getComputedStyle(at).backgroundColor;
          if (opaque(colour)) return colour;
        }
        return 'rgb(255, 255, 255)';
      };
      return [...document.querySelectorAll('[data-door], [data-local]')].map((control, index) => {
        const style = getComputedStyle(control);
        const drawn = style.visibility !== 'hidden' && style.display !== 'none' && control.getBoundingClientRect().width > 0;
        const marks = (control.textContent ?? '').trim() !== '' || control.querySelector('svg') !== null;
        return { key: `${control.getAttribute('data-door') ?? control.getAttribute('data-local') ?? '?'}#${index}`, drawn, apart: !marks || style.color !== backgroundOf(control), colour: `${style.color} on ${backgroundOf(control)}` };
      });
    });
  const before = await seen();
  await page.emulateMedia({ forcedColors: 'active' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const after = await seen();
  const wasSeen = new Map(before.map((one) => [one.key, one.drawn && one.apart]));
  const lost = after.filter((one) => wasSeen.get(one.key) === true && !(one.drawn && one.apart)).map((one) => `${one.key}: ${one.drawn ? one.colour : 'not drawn'}`);
  expect(lost, 'controls that could be seen and that forced colours hid or blended into the background').toEqual([]);
  await page.locator('.workbench').screenshot({ path: 'test-results/browser-only-forced-colours.png' });
});

// ---------------------------------------------------------------- bidirectional text

test('on a right-to-left page, a text with Hebrew characters and mixed content shows correctly on the canvas, in editing and in Layers', runs(SELECT_ROW, 'text.startEdit#canvas-double-click-text-element'), async ({ page }) => {
  test.setTimeout(120_000);
  const MIXED = 'שלום hello 123';
  const project = JSON.stringify({
    version: 4,
    pages: [
      {
        id: 'p-home',
        name: 'Início',
        file: 'index.html',
        tree: {
          id: 'r-page',
          type: 'page',
          name: 'Página',
          tag: 'body',
          // the page reads right to left (its dir: pageDirection, manifest/elements.json; DEF-0571)
          attributes: { pageDirection: 'rtl' },
          classes: [],
          styles: {},
          text: null,
          children: [
            {
              id: 'r-section',
              type: 'section',
              name: 'Seção',
              tag: 'section',
              attributes: {},
              classes: [],
              styles: {},
              text: null,
              children: [{ id: 'r-text', type: 'paragraph', name: 'Texto misto', tag: 'p', attributes: {}, classes: [], styles: {}, text: MIXED, children: [] }],
            },
          ],
        },
      },
    ],
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await openEditor(page, { project: { text: project } });
  const drawnText = page.frameLocator('.frame__page').locator('[data-node="r-text"]');
  expect(await drawnText.innerText()).toBe(MIXED);
  // the canvas draws it right to left: the page's direction reaches the paragraph, which starts at its right edge
  expect(await drawnText.evaluate((el) => getComputedStyle(el).direction), "the text's computed direction").toBe('rtl');
  expect(await page.frameLocator('.frame__page').locator('html').getAttribute('dir'), "the page's dir on the canvas").toBe('rtl');
  await runDoor(page, SELECT_ROW, { args: { target: 'r-text' } });
  const layers = await page.locator('[data-region="layers-tree"] .row.is-selected').first().innerText();
  expect(layers).toContain('Texto misto');
  const field = await tree(page);
  expect(JSON.stringify(field.selection)).toContain('r-text');
  // editing the text on the page itself (a double click): the same text, in the same order. The point comes from the
  // frame's position plus the node's times the frame's zoom (section 8 of CLAUDE.md): Playwright's boundingBox does not apply it
  const at = await page.evaluate((node) => {
    const iframe = document.querySelector<HTMLIFrameElement>('.frame__page');
    const el = iframe?.contentDocument?.querySelector(`[data-node="${node}"]`);
    if (iframe === null || iframe === undefined || el === null || el === undefined) throw new Error('the canvas did not draw the text');
    const zoom = iframe.currentCSSZoom;
    const frame = iframe.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return { x: frame.left + (rect.left + rect.width / 2) * zoom, y: frame.top + (rect.top + rect.height / 2) * zoom };
  }, 'r-text');
  await page.mouse.dblclick(at.x, at.y);
  const editing = page.frameLocator('.frame__page').locator('[data-node="r-text"]');
  await expect(editing, 'editing opens on the text itself').toHaveAttribute('contenteditable', 'plaintext-only');
  expect(await editing.innerText()).toBe(MIXED);
  await page.keyboard.press('Escape');
  await page.locator('[data-region="canvas-frame"]').screenshot({ path: 'test-results/browser-only-bidi.png' });
});

// ---------------------------------------------------------------- storage quota

test('with storage full the autosave does not lose the document and says where the journal went', runs(OPEN, DELETE), async ({ page }) => {
  test.setTimeout(120_000);
  await openAurora(page);
  // the opened project's journal leaves localStorage once IndexedDB holds the project: filled before that, the space it
  // freed then took the next journal, and no notice was due (DEF-0588)
  await expect.poll(() => page.evaluate(() => localStorage.getItem('work-journal')), { message: "the opening's journal left localStorage", timeout: 15_000 }).toBeNull();
  // fills localStorage up to the quota,
  // to its last bytes: a piece that no longer fits halves, down to one character (DEF-0571: the room the 256 KB pieces
  // left still held the journal, so the case never reached the notice)
  await page.evaluate(() => {
    let piece = 256 * 1024;
    for (let i = 0; i < 4000 && piece >= 1; i++) {
      try {
        localStorage.setItem(`filler-${i}`, 'x'.repeat(piece));
      } catch {
        piece = Math.floor(piece / 2);
      }
    }
  });
  const full = await page.evaluate(() => {
    try {
      localStorage.setItem('filler-end', 'x');
      return false;
    } catch {
      return true;
    }
  });
  expect(full, 'localStorage refused the write: it is the state the quota leaves').toBe(true);
  await runDoor(page, SELECT_ROW, { args: { target: 'n-actions' } });
  // the selection's own write over first: a delete that arrives while it is in flight goes straight to IndexedDB in the
  // same write loop, with no journal to try, so no notice is due (DEF-0588)
  const status = page.locator('.status-bar');
  const savedSelection = () => page.evaluate(() => new Promise<unknown>((resolve, reject) => {
    const request = indexedDB.open('work');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const database = request.result;
      const read = database.transaction('projects').objectStore('projects').get('current');
      read.onerror = () => { database.close(); reject(read.error); };
      read.onsuccess = () => { database.close(); resolve((read.result as { selection?: unknown } | undefined)?.selection); };
    };
  }));
  await expect.poll(savedSelection, { message: 'the selection was written to IndexedDB', timeout: 20_000 }).toEqual(['n-actions']);
  await runDoor(page, DELETE);
  await expect(status, 'the autosave stops writing and says what state it was left in').not.toContainText(/Saving/i, { timeout: 20_000 });
  expect(await idsOf(page), 'the change stays in the document with storage full').not.toContain('n-actions');
  // the journal that no longer fits localStorage moves to IndexedDB, and the status bar says so (DEF-0571: the case
  // checked no notice)
  await expect.poll(() => page.evaluate(() => (window as unknown as { __builderTestPort: { keys: () => readonly string[] } }).__builderTestPort.keys()), { message: 'the notice that the journal moved to IndexedDB was given' }).toContain('status.save.journalInDatabase');
  await page.reload();
  await expect(page.locator('.workbench')).toBeVisible();
  await expect(page.frameLocator('.frame__page').locator('[data-node="n-actions"]'), 'the change survived the reload').toHaveCount(0);
});
