/* global console, document, window */
// MED-0039 — L09a (ENT-L09a-0061): the scroll position of the options list after the active option is brought into
// view with `option.scrollIntoView({ block: 'nearest' })`, read in src/editor/focus/focus.ts:159. Measured on the
// command bar's list (a combobox, the field that keeps focus while the active option moves).
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJECT = fs.readFileSync('manifest/features/fixtures/responsive-title.json', 'utf8');
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, scrollbars: false },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, scrollbars: true },
};

for (const [name, c] of Object.entries(CONFIGS)) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.scrollbars ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: PROJECT, commands: [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }] } }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.waitForFunction(() => (window.__builderTestPort?.boot().length ?? -1) >= 2);
  await page.click('[data-door="commandBar.open#toolbar-top-bar-search"]');
  await page.waitForTimeout(300);

  const before = await page.evaluate(() => {
    const field = document.querySelector('.command-bar__field');
    const list = document.getElementById(field?.getAttribute('aria-controls') ?? '');
    return list ? { options: list.querySelectorAll('[role="option"]').length, scrollTop: list.scrollTop, clientHeight: list.clientHeight, scrollHeight: list.scrollHeight } : { error: 'no list' };
  });
  for (let i = 0; i < 20; i += 1) await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => {
    const field = document.querySelector('.command-bar__field');
    const list = document.getElementById(field?.getAttribute('aria-controls') ?? '');
    const active = document.getElementById(field?.getAttribute('aria-activedescendant') ?? '');
    return list ? { scrollTop: list.scrollTop, activeTop: active ? active.getBoundingClientRect().top - list.getBoundingClientRect().top : null, activeVisible: active ? active.getBoundingClientRect().top >= list.getBoundingClientRect().top && active.getBoundingClientRect().bottom <= list.getBoundingClientRect().bottom : null } : { error: 'no list' };
  });

  console.log(JSON.stringify({ config: name, before, after }));
  await browser.close();
}
