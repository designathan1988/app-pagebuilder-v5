// The fluid widths of the interface (the investigation's C4, option D): one measurement of every region of
// manifest/layout.json the editor mounts, in the two screen conditions, kept in manifest/generated/ui-widths.json
// beside the hash of the CSS it was taken with — it runs again when the CSS changes. The fixed widths of the regions
// whose column is a token are not measured here: tools/ui-fit/check.ts reads those tokens itself, so a token that
// shrinks is caught without a browser (the mutant of `--size-inspector`).
// Run: npm run ui-fit:measure, and with the Windows condition:
//   E2E_SCROLLBARS=shown E2E_SCALE=1.25 npm run ui-fit:measure
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { test } from '@playwright/test';
import { openEditor } from '../../tests/support/editor.ts';
import { UI_WIDTHS } from './check.ts';

const CONDITION = process.env.E2E_SCROLLBARS === 'shown' ? 'windows' : 'default';
const MENUS = ['file', 'edit', 'arrange', 'view', 'help', 'theme', 'language', 'element-actions', 'zoom', 'snap', 'style-state'];

interface Cell {
  width: number;
  fontSize: number;
  fontWeight: number;
}

// the hash of every stylesheet of the application, sorted: the key of a measurement
function cssHash(): string {
  const files: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.css')) files.push(full);
    }
  };
  walk('src');
  const hash = crypto.createHash('sha256');
  for (const file of files.sort()) hash.update(`${file}\n${fs.readFileSync(file, 'utf8')}`);
  return hash.digest('hex');
}

test(`mede a largura das regiões (${CONDITION})`, async ({ page }) => {
  const found = new Map<string, Cell>();
  const collect = async (): Promise<void> => {
    const rows = await page.evaluate(() =>
      [...document.querySelectorAll('[data-region]')].map((element) => {
        const style = getComputedStyle(element);
        return {
          id: element.getAttribute('data-region') ?? '',
          width: (element as HTMLElement).clientWidth,
          fontSize: Number.parseFloat(style.fontSize),
          fontWeight: Number.parseInt(style.fontWeight, 10) || 400,
        };
      }),
    );
    for (const row of rows) {
      if (row.id === '' || row.width <= 0) continue;
      const held = found.get(row.id);
      // the narrowest the region appears, the column that can appear
      if (held === undefined || row.width < held.width) found.set(row.id, { width: row.width, fontSize: row.fontSize, fontWeight: row.fontWeight });
    }
  };

  await openEditor(page, { project: 'aurora' });
  await collect();
  for (const menu of MENUS) {
    const button = page.locator(`[data-menu="${menu}"]`).first();
    if ((await button.count()) === 0) continue;
    await button.click();
    await collect();
    await page.keyboard.press('Escape');
  }
  await page.keyboard.press('Control+k');
  await collect();
  await page.keyboard.press('Escape');
  const chip = page.locator('[data-quick-panel-chip]').first();
  if ((await chip.count()) > 0) {
    await chip.click();
    await collect();
    await page.keyboard.press('Escape');
  }
  // the activity bar switches the sidebar's view; the dock strip its tab
  for (const selector of ['.activity-bar button[data-door]', '[data-region="dock-strip"] button[data-door]']) {
    const count = await page.locator(selector).count();
    for (let i = 0; i < count; i++) {
      await page.locator(selector).nth(i).click();
      await collect();
    }
  }

  const held = fs.existsSync(UI_WIDTHS) ? (JSON.parse(fs.readFileSync(UI_WIDTHS, 'utf8')) as { regions?: Record<string, Record<string, Cell>> }).regions ?? {} : {};
  const regions: Record<string, Record<string, Cell>> = { ...held };
  for (const [id, cell] of found) regions[id] = { ...(regions[id] ?? {}), [CONDITION]: cell };
  fs.writeFileSync(UI_WIDTHS, `${JSON.stringify({ $generated: { by: 'tools/ui-fit/measure.spec.ts', css: cssHash() }, regions }, null, 2)}\n`);
  console.log(`ui-fit: ${found.size} regiões medidas (${CONDITION})`);
});

