// A narrow window keeps the editor inside it (the code audit's U-010): at 1024 × 768 the window does not scroll
// sideways — the panels keep their widths and the canvas toolbar scrolls within itself — and every breakpoint tab
// stays reachable.
import { expect, test } from '../support/test.ts';
import { openEditor } from '../support/editor.ts';
import { control, openMenu, runDoor, runs } from './door.ts';

const PHONE = 'view.setBreakpoint#toolbar-breakpoint-tabs-phone';
const INSERT = 'workspace.setPanelOpen#toolbar-activity-bar-insert';
const ESCAPE = 'focus.canvas#key-escape-in-palette';

test('at 1024 px the window does not scroll sideways, and the Phone tab is reachable', runs(PHONE), async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await openEditor(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1024);
  const tab = control(page, PHONE);
  await tab.scrollIntoViewIfNeeded();
  await tab.click();
  await expect(tab).toHaveAttribute('aria-selected', 'true');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1024);
});

// jornada03 J25 and H17: at 1280 × 720 the canvas has at least half of the window, measured as the study measured it,
// an area (the audit's AUD-06: this test measured 55 % of the width while the stage had 41 % of the window); and the
// canvas toolbar fits whole (its buttons drawn as their icons, their names in their tooltips) instead of scrolling.
// Below the narrow window's width the sidebar keeps no column: a first visit opens with it closed.
test('at 1280 × 720 the canvas has half of the window and the canvas toolbar fits whole', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await openEditor(page);
  const stage = await page.locator('.stage').evaluate((el) => {
    const box = el.getBoundingClientRect();
    return { width: box.width, height: box.height };
  });
  expect(stage.width / 1280).toBeGreaterThanOrEqual(0.55);
  expect((stage.width * stage.height) / (1280 * 720)).toBeGreaterThanOrEqual(0.5);
  const toolbar = await page.locator('.canvas-toolbar').evaluate((el) => ({ scroll: el.scrollWidth, client: el.clientWidth }));
  expect(toolbar.scroll).toBeLessThanOrEqual(toolbar.client);
});

// In a narrow window a panel of the activity bar takes its column beside the canvas, as in any window (CLAUDE.md, rule
// G4: it once opened over the canvas, and what it inserted, the canvas toolbar and the dock lay under it): nothing of it
// lies over the canvas, which keeps half of the window, a press on the canvas leaves it open, and Escape in its palette
// takes the focus to the canvas.
test('in a narrow window the sidebar opens beside the canvas, never over it, and a press on the canvas leaves it open', runs(INSERT, ESCAPE), async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await openEditor(page);
  await expect(page.locator('.sidebar')).toHaveCount(0);
  await runDoor(page, INSERT);
  await expect(page.locator('.sidebar')).toBeVisible();
  const open = await page.evaluate(() => {
    const box = (selector: string) => document.querySelector(selector)?.getBoundingClientRect() ?? null;
    const sidebar = box('.sidebar');
    const stage = box('.stage');
    // the canvas toolbar's controls the sidebar lies over
    const covered = [...document.querySelectorAll('[data-region="canvas-toolbar"] button')].filter((b) => {
      const r = b.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return false;
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return hit !== null && !b.contains(hit) && hit.closest('.sidebar') !== null;
    }).length;
    return { sidebarRight: sidebar?.right ?? null, stageLeft: stage?.left ?? null, stageWidth: stage?.width ?? null, covered };
  });
  if (open.sidebarRight === null || open.stageLeft === null || open.stageWidth === null) throw new Error('no sidebar or stage');
  expect(open.sidebarRight, 'the sidebar ends where the canvas begins').toBeLessThanOrEqual(open.stageLeft + 0.5);
  expect(open.stageWidth / 1280, 'the canvas keeps half of the window beside the open sidebar').toBeGreaterThanOrEqual(0.5);
  expect(open.covered, 'no control of the canvas toolbar lies under the sidebar').toBe(0);
  // a press on the canvas leaves it open
  const stage = await page.locator('.stage').boundingBox();
  if (stage === null) throw new Error('no stage');
  await page.mouse.click(stage.x + stage.width - 40, stage.y + stage.height - 40);
  await expect(page.locator('.sidebar')).toBeVisible();
  // Escape in its palette takes the focus to the canvas; the sidebar stays
  await page.locator('.sidebar [data-door="element.insert#elements-tile"]').first().focus();
  await page.keyboard.press('Escape');
  // the canvas's key context is the page's body (focus/focus.ts focusTheCanvas)
  await expect.poll(() => page.evaluate(() => document.activeElement === document.body), { message: 'Escape took the focus to the canvas' }).toBe(true);
  await expect(page.locator('.sidebar')).toBeVisible();
});

// DEF-0596: with the Insert panel open at 1280 × 720 the canvas toolbar hid the names of its buttons (Canvas, Split,
// Code) with room beside them for the names, by a fixed limit of the centre's width; and at the width where only the
// shorter language's names fit, a change of language kept the icons alone, judged by the other language's names. The
// names are drawn exactly while they fit the bar, in either language, after any change of width or language.
test('the canvas toolbar keeps its buttons names while they fit, in either language', runs(INSERT, 'preferences.setLanguage#menu-language-en', 'preferences.setLanguage#menu-language-pt-br'), async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await openEditor(page);
  await runDoor(page, INSERT);
  await expect(page.locator('.sidebar')).toBeVisible();
  const bar = page.locator('.canvas-toolbar');
  // whether the names are drawn, and whether they would fit, read with the bar drawn whole for the reading
  const read = () => bar.evaluate((el) => {
    const compact = el.classList.contains('is-compact');
    const named = [...el.querySelectorAll('.segmented .door__label')].every((label) => label.getBoundingClientRect().width > 0);
    el.classList.remove('is-compact');
    const fits = el.scrollWidth <= el.clientWidth + 0.5;
    const zoom = el.querySelector('.canvas-toolbar__zoom');
    if (zoom === null) throw new Error('no zoom menu in the canvas toolbar');
    const free = Math.round(zoom.getBoundingClientRect().left - Math.max(...[...el.children].filter((c) => c !== zoom).map((c) => c.getBoundingClientRect().right)));
    el.classList.toggle('is-compact', compact);
    return { named, fits, free };
  });
  const language = async (id: 'en' | 'pt-br') => {
    await openMenu(page, 'view');
    await page.getByRole('menuitem', { name: /^(Idioma|Language)$/ }).hover();
    await page.locator(`[data-door="preferences.setLanguage#menu-language-${id}"]`).click();
    await expect(page.locator('[data-menu="file"]')).toHaveText(id === 'en' ? 'File' : 'Arquivo');
  };
  await language('pt-br');
  const pt = await read();
  expect(pt.named, 'the names drawn with room for them beside the Insert panel').toBe(true);
  await language('en');
  const en = await read();
  expect(en.named).toBe(true);
  // a window where the names of one language fit and the other's do not
  const width = 1280 - Math.round((pt.free + en.free) / 2);
  expect(Math.abs(pt.free - en.free), 'the languages take different widths').toBeGreaterThan(2);
  for (const id of ['pt-br', 'en', 'pt-br', 'en'] as const) {
    await language(id);
    await page.setViewportSize({ width, height: 720 });
    await expect.poll(async () => { const now = await read(); return now.named === now.fits; }, { message: `${id} at ${width}: names drawn exactly while they fit` }).toBe(true);
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect.poll(async () => (await read()).named, { message: `${id} at 1280: the names back` }).toBe(true);
    await page.setViewportSize({ width, height: 720 });
  }
  // a change of language at that width, with no change of width after it
  for (const id of ['pt-br', 'en', 'pt-br'] as const) {
    await language(id);
    await expect.poll(async () => { const now = await read(); return now.named === now.fits; }, { message: `${id} chosen at ${width}` }).toBe(true);
  }
  expect(await bar.evaluate((el) => el.scrollWidth <= el.clientWidth + 0.5), 'the bar holds its buttons').toBe(true);
});
