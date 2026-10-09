import { expect, test } from '../support/test.ts';
import { openEditor } from '../support/editor.ts';

test('Style with no selection shows only the guidance', async ({ page }) => {
  await openEditor(page);
  const style = page.locator('[data-region="inspector-style"]');
  await expect(page.locator('.selector-bar__element')).toHaveText('Nothing selected');
  await expect(style.locator('.inspector-hints li')).toHaveCount(3);
  await expect(style.locator('.inspector-controls, .inspector-sections, .inspector-section, .field-row')).toHaveCount(0);
  await expect(page.locator('.selector-bar__targets, .selector-bar__state')).toHaveCount(0);
  await expect(style.locator('.inspector-hints')).toBeVisible();
});

// DEF-0578: the Settings tab with nothing selected says so with the guidance, at the Style tab's room from the panel's
// edges; its words touched both edges
test('Settings with no selection keeps its words off the panel edges, as Style does', async ({ page }) => {
  await openEditor(page);
  await page.locator('[data-door="workspace.setActiveTab#inspector-tab-settings"]').click();
  const settings = page.locator('[data-region="inspector-settings"]');
  await expect(settings.locator('.inspector-empty')).toBeVisible();
  const room = await settings.evaluate((region) => {
    const panel = region.getBoundingClientRect();
    const words = [...region.querySelectorAll('.inspector-empty, .inspector-hints')].map((one) => one.getBoundingClientRect());
    return { left: Math.min(...words.map((one) => one.left)) - panel.left, right: panel.right - Math.max(...words.map((one) => one.right)) };
  });
  expect(room.left, 'room from the left edge').toBeGreaterThanOrEqual(8);
  expect(room.right, 'room from the right edge').toBeGreaterThanOrEqual(8);
});
