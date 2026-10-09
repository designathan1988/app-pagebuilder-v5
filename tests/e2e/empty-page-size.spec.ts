// An empty page's root stands as tall as the breakpoint's screen on the canvas (the user's audit order of 2026-10-05:
// its label read "1440 × 0" and its selection was a line at the frame's top).
import { expect, test } from '../support/test.ts';
import { openEditor } from '../support/editor.ts';
import { control, runs } from './door.ts';

const ROW = 'selection.select#layers-row';
const TAB = (id: string) => `view.setBreakpoint#toolbar-breakpoint-tabs-${id}`;

test('the page root of an empty page is the screen tall, at every breakpoint', runs(ROW, TAB('phone')), async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openEditor(page);
  await control(page, ROW).first().click();
  // a desktop's page keeps its scrollbar's width free (A3.22, overlay-scrollbar-width.spec.ts): none where scrollbars
  // take no width, about 15 px where they do (Windows, E2E_SCROLLBARS=shown; DEF-0583)
  const scrollbar = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;overflow:scroll;width:100px;height:100px';
    document.body.append(probe);
    const width = probe.offsetWidth - probe.clientWidth;
    probe.remove();
    return width;
  });
  const size = page.locator('[data-chrome="label"] [data-chrome="label-size"]');
  await expect(size).toHaveText(`${String(1440 - scrollbar)} × 900`);
  await expect(page.locator('.status-bar__size')).toHaveText(`${String(1440 - scrollbar)} × 900`);
  await control(page, TAB('phone')).click();
  await expect(size).toHaveText(/^390 × \d+$/);
  await expect(size).not.toHaveText('390 × 0');
});
