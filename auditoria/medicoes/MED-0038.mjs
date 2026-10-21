/* global MutationObserver, console, document, setTimeout, window */
// MED-0038 — the browser-computed values that the id cites.
//  - L08 (ENT-L08-0021): the intersection visibility (`isIntersecting` and `intersectionRatio`), on which the
//    enter and leave branches depend (src/editor/motion/runtime/triggers.ts:179), read in the canvas frame's document.
//  - L09a (ENT-L09a-0060): the active element before the command bar opens and the condition on closing
//    (src/editor/shell/command-bar.tsx:148 and :151).
//  - L09a (ENT-L09a-0074): the active element when the dialog box opens (src/editor/shell/dialog.tsx:24).
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const PROJECT = fs.readFileSync('manifest/features/fixtures/responsive-title.json', 'utf8');
const CONFIGS = {
  A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, scrollbars: false, menu: /Exibir/ },
  B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, scrollbars: true, menu: /View/ },
};

async function open(c, commands) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.scrollbars ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
  const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
  const page = await context.newPage();
  await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: PROJECT, commands } }));
  await page.goto('http://localhost:5399/?test-boot');
  await page.waitForFunction((n) => (window.__builderTestPort?.boot().length ?? -1) >= n, commands.length + 1).catch(() => {});
  await page.waitForTimeout(400);
  return { browser, page };
}

for (const [name, c] of Object.entries(CONFIGS)) {
  // L08 — the visibility of the element's intersection with the frame's view
  const a = await open(c, [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }]);
  const intersection = await a.page.evaluate(() => new Promise((resolve) => {
    const w = document.querySelector('.frame__page').contentWindow;
    const el = w.document.querySelector('h1');
    const observer = new w.IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry) resolve({ isIntersecting: entry.isIntersecting, intersectionRatio: entry.intersectionRatio, boundingClientRect: { top: entry.boundingClientRect.top, height: entry.boundingClientRect.height } });
    }, { threshold: 0 });
    observer.observe(el);
    setTimeout(() => resolve({ error: 'no intersection notice' }), 2000);
  }));
  await a.browser.close();

  // L09a — the command bar and the dialog box
  const b = await open(c, [{ command: 'selection.select', args: { target: { $node: '/Page/Title' } } }]);
  const beforeOpen = await b.page.evaluate(() => ({ tag: document.activeElement?.tagName, className: (document.activeElement?.className || '').toString() }));
  await b.page.click('[data-door="commandBar.open#toolbar-top-bar-search"]');
  await b.page.waitForTimeout(250);
  const whileOpen = await b.page.evaluate(() => ({ activeTag: document.activeElement?.tagName, activeClass: (document.activeElement?.className || '').toString(), fieldFocused: document.activeElement === document.querySelector('.command-bar__field') }));
  await b.page.keyboard.press('Escape');
  await b.page.waitForTimeout(250);
  const afterClose = await b.page.evaluate(() => ({ activeTag: document.activeElement?.tagName, inBody: document.activeElement === document.body }));
  for (const btn of await b.page.locator('.menu-button').all()) { if (c.menu.test((await btn.textContent()) ?? '')) { await btn.click(); break; } }
  await b.page.waitForTimeout(250);
  await b.page.evaluate(() => {
    window.__atDialog = null;
    const obs = new MutationObserver(() => {
      if (window.__atDialog === null && document.querySelector('.dialog-shield .dialog')) { window.__atDialog = document.activeElement; obs.disconnect(); }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  });
  const beforeDialog = await b.page.evaluate(() => ({ tag: document.activeElement?.tagName, door: document.activeElement?.getAttribute?.('data-door') ?? null, className: (document.activeElement?.className || '').toString() }));
  await b.page.click('[data-door="workspace.openDialog#menu-view-guides-grids"]').catch(() => {});
  await b.page.waitForTimeout(300);
  const dialog = await b.page.evaluate(() => ({ open: !!document.querySelector('.dialog-shield .dialog') }));
  await b.browser.close();

  console.log(JSON.stringify({ config: name, intersection, commandBar: { beforeOpen, whileOpen, afterClose }, dialog: { ...dialog, beforeDialog } }));
}
