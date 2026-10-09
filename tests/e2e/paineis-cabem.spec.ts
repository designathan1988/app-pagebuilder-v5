// What a person's use of the panels found cut or scrolled sideways (the use session of 2026-10-09, DEF-0590 to DEF-0594),
// each read where the flow that met it stands: a column's type menu in the data preview, a mapped part's name, the
// Explorer's file names, the Motion dock and a Layout Composer action. Every condition of the suite runs it.
import { expect, installClock, test, type Page } from '../support/test.ts';
import { openEditor } from '../support/editor.ts';
import { FLOWS } from '../../tools/ui/flows.ts';
import { playFlow } from '../../tools/ui/play.ts';
import fs from 'node:fs';
import { control, runDoor } from './door.ts';

async function playUpTo(page: Page, name: string, steps: number): Promise<void> {
  const flow = FLOWS.find((one) => one.name === name);
  if (flow === undefined) throw new Error(`no flow ${name}`);
  await page.setViewportSize({ width: 1440, height: 900 });
  await installClock(page);
  await openEditor(page);
  expect(await playFlow(page, { ...flow, steps: flow.steps.slice(0, steps) })).toEqual([]);
}

test('a column type menu of the data preview shows its whole type (DEF-0590)', async ({ page }) => {
  test.setTimeout(120_000);
  await playUpTo(page, 'data-c4', 8);
  const menus = page.locator('[data-region="data-preview"] th select');
  await expect(menus.first()).toBeVisible();
  // the menu is at least as wide as its chosen type's words, measured in its own font
  const short = await menus.evaluateAll((all) => all.flatMap((one) => {
    const select = one as HTMLSelectElement;
    const style = getComputedStyle(select);
    const context = document.createElement('canvas').getContext('2d');
    if (context === null) return [];
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const words = context.measureText(select.selectedOptions[0]?.textContent ?? '').width;
    const inner = select.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
    return inner + 0.5 < words ? [`${select.selectedOptions[0]?.textContent ?? ''}: ${inner.toFixed(1)} < ${words.toFixed(1)}`] : [];
  }));
  expect(short).toEqual([]);
});

test('a mapped part’s name is never cut in the Connect fields list (DEF-0592)', async ({ page }) => {
  test.setTimeout(120_000);
  await playUpTo(page, 'data-c4', 16);
  const parts = page.locator('.data-target__name .data-column__type');
  await expect(parts.first()).toBeVisible();
  const cut = await parts.evaluateAll((all) => all.filter((one) => one.scrollWidth > one.clientWidth + 1).map((one) => one.textContent));
  expect(cut).toEqual([]);
});

test('an Explorer file’s name is never cut: its details leave first, and come back where they fit (DEF-0593)', async ({ page }) => {
  test.setTimeout(120_000);
  await playUpTo(page, 'data-c3', 99);
  const names = page.locator('.row__main > .row__name');
  await expect(names.first()).toBeVisible();
  const cut = await names.evaluateAll((all) => all.filter((one) => one.scrollWidth > one.clientWidth + 1).map((one) => one.textContent));
  expect(cut).toEqual([]);
  // a row whose name and details fit shows its details: "index.html" keeps its "generated" mark
  const index = page.locator('.row__main', { hasText: 'index.html' }).filter({ has: page.locator('.row__gen') });
  await expect(index.locator('.row__gen')).toBeVisible();
});

test('the Motion dock never scrolls sideways: only its track does (DEF-0591)', async ({ page }) => {
  test.setTimeout(120_000);
  await playUpTo(page, 'easing-curve', 9);
  const sideways = await page.locator('.dock-body').evaluateAll((all) => all.filter((one) => one.scrollWidth > one.clientWidth + 1).map((one) => `${one.scrollWidth} in ${one.clientWidth}`));
  expect(sideways).toEqual([]);
});

test('a Layout Composer action as wide as the panel keeps its words inside (DEF-0594)', async ({ page }) => {
  test.setTimeout(120_000);
  await playUpTo(page, 'layout-10-desktop-to-mobile', 8);
  const actions = page.locator('.layout-panel__actions > .door');
  await expect(actions.first()).toBeVisible();
  const over = await actions.evaluateAll((all) => all.filter((one) => one.scrollWidth > one.clientWidth).map((one) => one.textContent));
  expect(over).toEqual([]);
});

// DEF-0598: with All properties open, a section header lay half under the top of the Inspector's scrolled list, under
// Find a property ("PINTURA" cut, after editing Font size). While a section's rows pass under the top, its header stays
// whole there; and a field brought into view by the focus stops below that header, never under it.
test('a section header of the Inspector stays whole at the top while its rows scroll under it (DEF-0598)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await openEditor(page);
  const chooser = page.waitForEvent('filechooser');
  await runDoor(page, 'project.open#menu-file');
  await (await chooser).setFiles({ name: 'aurora.json', mimeType: 'application/json', buffer: fs.readFileSync('manifest/features/fixtures/aurora.json') });
  // at 1280 px the sidebar opens closed: the Layers come with it
  await runDoor(page, 'workspace.setPanelOpen#toolbar-activity-bar-insert');
  await control(page, 'selection.select#layers-row', { args: { target: 'n-intro' } }).click();
  await runDoor(page, 'inspector.setMode#inspector-mode-all');
  const list = page.locator('.inspector-scroll');
  // every place of the list, a row's height apart: the sections whose rows lie under its top, and their headers
  const wrong = await list.evaluate(async (scroller) => {
    const out: string[] = [];
    const frame = () => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
    for (let at = 0; at <= scroller.scrollHeight - scroller.clientHeight; at += 13) {
      scroller.scrollTop = at;
      await frame();
      const top = scroller.getBoundingClientRect().top;
      for (const section of scroller.querySelectorAll('.inspector-section')) {
        const header = section.querySelector<HTMLElement>('.inspector-section__header');
        if (header === null) continue;
        const box = section.getBoundingClientRect();
        const head = header.getBoundingClientRect();
        // its rows under the top, with room above its content's end for the whole header (the header leaves with the
        // section's last row, pushed by the next header, as a grouped list's header does)
        const own = getComputedStyle(section);
        const end = box.bottom - (parseFloat(own.paddingBottom) || 0) - (parseFloat(own.borderBottomWidth) || 0);
        if (box.top < top - 0.5 && end >= top + head.height + 0.5) {
          if (Math.abs(head.top - top) > 0.5) out.push(`${header.textContent ?? ''} at ${at}: ${(head.top - top).toFixed(1)} px from the top`);
        }
      }
    }
    return out;
  });
  expect(wrong).toEqual([]);
  // a field reached by the keyboard right below a header comes into view below it
  await list.evaluate((scroller) => { scroller.scrollTop = scroller.scrollHeight; });
  const field = page.locator('[data-door="style.set#inspector-background-color"] input').first();
  await field.focus();
  const covered = await field.evaluate((input) => {
    const r = input.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + 2);
    return hit === null || !input.contains(hit) ? `${hit?.className ?? 'nothing'} over the field` : '';
  });
  expect(covered).toBe('');
});
