// What a person's use of the panels found cut or scrolled sideways (the use session of 2026-10-09, DEF-0590 to DEF-0594),
// each read where the flow that met it stands: a column's type menu in the data preview, a mapped part's name, the
// Explorer's file names, the Motion dock and a Layout Composer action. Every condition of the suite runs it.
import { expect, installClock, test, type Page } from '../support/test.ts';
import { openEditor } from '../support/editor.ts';
import { FLOWS } from '../../tools/ui/flows.ts';
import { playFlow } from '../../tools/ui/play.ts';

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
