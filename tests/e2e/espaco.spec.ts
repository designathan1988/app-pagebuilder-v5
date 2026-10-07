// G4 and G5 (CLAUDE.md, the editor's rules): what an action makes is seen, and every part of the editor fits its
// window. No panel that scrolls down scrolls sideways (nor does a copy measured out of sight widen it), every bar holds
// its controls inside the window, no control a person can see passes the window's edge or lies under another part of
// the editor, and an element just inserted shows on the canvas with nothing over its start. Checked in Portuguese at
// 1280 × 720 (the narrow window) and in English at 1440 × 900, on a page twelve levels deep with long names, through the
// Insert panel, Layers and the Inspector as a person uses them. No exception for a panel that scrolls, a copy measured
// out of sight or a panel that floats: those are the mechanisms these rules are about. G6 and G7 ride along: every view
// shows the same selection, and the canvas a reload draws is the canvas the edits drew.
import { expect, nextFrames, test, type Page } from '../support/test.ts';
import { openEditor } from '../support/editor.ts';
import { door, runs } from './door.ts';
import type { TestBootCommand } from '../../src/editor/test-boot.ts';

const run = (ref: string, args: Readonly<Record<string, unknown>> = {}): TestBootCommand => ({ command: ref.split('#')[0] ?? '', args: { ...door(ref).args, ...args } });

interface Condition {
  readonly width: number;
  readonly height: number;
  readonly language: 'pt-BR' | 'en';
}
const CONDITIONS: readonly Condition[] = [
  { width: 1280, height: 720, language: 'pt-BR' },
  { width: 1440, height: 900, language: 'en' },
];

// A page twelve containers deep, each with a long name, the deepest holding a heading, a paragraph and a button: the
// breadcrumb of the status bar names every level, Layers indents every one, and a name is longer than its room.
function deepProject(): string {
  const node = (id: string, type: string, name: string, tag: string, children: unknown[] = [], text: string | null = null) => ({ id, type, name, tag, attributes: {}, classes: [], styles: {}, text, children });
  let inner = [
    node('d-title', 'heading', 'Título principal da seção de cardápio', 'h2', [], 'Cardápio da semana com cafés especiais'),
    node('d-text', 'paragraph', 'Parágrafo de apresentação dos grãos', 'p', [], 'Grãos torrados toda semana, moídos na hora para cada xícara.'),
    node('d-button', 'button', 'Botão de reserva de mesa para o jantar', 'button', [], 'Reservar uma mesa'),
  ];
  for (let level = 12; level >= 1; level -= 1) inner = [node(`d-${level}`, 'div', `Contêiner de destaques nível ${level} da página inicial`, 'div', inner)];
  const tree = node('d-page', 'page', 'Página', 'body', [node('d-section', 'section', 'Seção de apresentação principal do restaurante', 'section', inner)]);
  return JSON.stringify({ version: 4, pages: [{ id: 'p-home', name: 'Início', file: 'index.html', tree }] });
}

// The places the rules are read in, each a function run in the page; each returns what breaks its rule, by name.
// Areas meant to scroll sideways: the canvas's stage, the code pane, the timeline, a data table, the file tabs, the
// rulers.
const SIDEWAYS_ALLOWED = '[data-region="canvas-stage"],[data-region="canvas-frame"],[data-region="code-pane"],.code-pane,.timeline,.motion-timeline,table,.data-table,[data-region="file-tabs"],[data-region="rulers"]';
function breaches(page: Page, insertedId: string | null): Promise<readonly string[]> {
  return page.evaluate(
    ({ allowed, inserted }) => {
      const out: string[] = [];
      const W = window.innerWidth;
      const H = window.innerHeight;
      const name = (el: Element) => `${el.closest('[data-region]')?.getAttribute('data-region') ?? '?'} › ${(el.getAttribute('aria-label') ?? el.textContent ?? el.tagName).replace(/\s+/g, ' ').trim().slice(0, 40)}`;
      const shown = (el: Element) => {
        for (let e: Element | null = el; e !== null && e !== document.body; e = e.parentElement) {
          const s = getComputedStyle(e);
          if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return false;
        }
        const r = el.getBoundingClientRect();
        return r.width >= 1 && r.height >= 1;
      };
      const layerOpen = [...document.querySelectorAll('[role=menu],[role=dialog],[role=alertdialog],[role=listbox],.popover,.command-bar')].some((e) => e.getClientRects().length > 0);
      // a panel that scrolls down never scrolls sideways, whatever widens it (a copy measured out of sight among them)
      for (const el of document.querySelectorAll('*')) {
        const s = getComputedStyle(el);
        if (!/(auto|scroll)/.test(s.overflowY) || el.closest(allowed) !== null || !shown(el)) continue;
        if (el.scrollWidth > el.clientWidth + 1) out.push(`rola de lado (+${el.scrollWidth - el.clientWidth}px): ${name(el)}`);
      }
      // every bar holds its controls inside the window
      for (const bar of document.querySelectorAll('[data-region="top-bar"],[data-region="status-bar"],[data-region="canvas-toolbar"],[data-region="dock-strip"],[data-region="inspector-header"]')) {
        if (!shown(bar)) continue;
        for (const control of bar.querySelectorAll('button,[role=tab],[role=button],a[href],input')) {
          if (!shown(control)) continue;
          const r = control.getBoundingClientRect();
          if (r.right > W + 1 || r.left < -1) out.push(`fora da janela: ${name(control)}`);
        }
      }
      // every control a person can see in the Inspector lies inside the window across
      for (const control of document.querySelectorAll('[data-region^="inspector"] button,[data-region^="inspector"] input,[data-region^="inspector"] [role=tab]')) {
        if (!shown(control) || control.closest('[aria-hidden="true"]') !== null) continue;
        const r = control.getBoundingClientRect();
        if (r.bottom < 0 || r.top > H) continue;
        if (r.right > W + 1 || r.left < -1) out.push(`fora da janela: ${name(control)}`);
      }
      // no control of the bars lies under another part of the editor (a menu or a dialog open aside)
      if (!layerOpen) {
        for (const control of document.querySelectorAll('[data-region="canvas-toolbar"] button,[data-region="dock-strip"] button,[data-region="canvas-breakpoints"] button,[data-region="top-bar"] button,[data-region="status-bar"] button')) {
          if (!shown(control)) continue;
          const r = control.getBoundingClientRect();
          if (r.right > W || r.bottom > H || r.left < 0 || r.top < 0) continue;
          const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          // the owner's rule DEC-70 (selection-label-touches.spec.ts): the selection's label of an element at the page's
          // top, and the quick panel's chip beside it, stand over the breakpoint tabs attached to the page's top (D-1).
          // The two rules of the owner leave no other place; which gives way is the owner's to decide.
          const dec70 = control.closest('[data-region="canvas-breakpoints"]') !== null && hit?.closest('[data-chrome="label"], .quick-panel-chip') != null;
          if (hit !== null && !control.contains(hit) && !hit.contains(control) && !dec70) out.push(`coberto: ${name(control)} sob ${name(hit)}`);
        }
      }
      // the element just inserted shows on the canvas: nothing of the editor lies over its start
      if (inserted !== null) {
        const frame = document.querySelector<HTMLIFrameElement>('.frame__page');
        const el = frame?.contentDocument?.querySelector(`[data-node="${inserted}"]`);
        if (!frame || !el) out.push('o elemento inserido não está no canvas');
        else {
          const zoom = frame.currentCSSZoom;
          const f = frame.getBoundingClientRect();
          const r = el.getBoundingClientRect();
          const x = f.x + (r.x + Math.min(12, r.width / 2)) * zoom;
          const y = f.y + (r.y + Math.min(8, r.height / 2)) * zoom;
          const stage = document.querySelector('[data-region="canvas-stage"]')?.getBoundingClientRect();
          const hit = document.elementFromPoint(x, y);
          if (stage === undefined || x < stage.left || x > stage.right || y < stage.top || y > stage.bottom) out.push('o início do elemento inserido está fora do palco');
          else if (hit === null || hit.closest('[data-region="canvas-stage"]') === null) out.push(`o início do elemento inserido está sob ${hit === null ? 'nada' : name(hit)}`);
        }
      }
      return out;
    },
    { allowed: SIDEWAYS_ALLOWED, inserted: insertedId },
  );
}

// G6: the selection every view shows is the store's
const views = (page: Page) =>
  page.evaluate(() => {
    const port = (window as unknown as { __builderTestPort: { selection: () => readonly string[] } }).__builderTestPort;
    const selected = port.selection();
    const layers = [...document.querySelectorAll('[data-region="layers-tree"] .row.is-selected')].map((e) => (JSON.parse(e.getAttribute('data-args') ?? '{}') as { target?: string }).target);
    const canvas = [...document.querySelectorAll('[data-label-for]')].map((e) => e.getAttribute('data-label-for'));
    const tree = document.querySelector('[data-region="layers-tree"]') !== null;
    return { selected, layers, canvas, tree };
  });

// G7: what the canvas draws, to compare after a reload
const drawn = (page: Page) =>
  page.evaluate(() => {
    const doc = document.querySelector<HTMLIFrameElement>('.frame__page')?.contentDocument;
    if (!doc) return '';
    const styles = [...doc.querySelectorAll('style[data-node-style]')].map((s) => `${s.getAttribute('data-node-style') ?? ''}|${(s.textContent ?? '').replace(/\s+/g, ' ')}`).sort();
    return `${doc.body.outerHTML.replace(/\s+/g, ' ')}\n${styles.join('\n')}`;
  });

for (const c of CONDITIONS) {
  test(`${c.width} × ${c.height} in ${c.language}: inserting, choosing in Layers and editing in the Inspector, every part fits and what is made shows`, runs('element.insert#elements-tile', 'selection.select#layers-row', 'inspector.setMode#inspector-mode-all', 'workspace.setActiveTab#inspector-tab-settings'), async ({ page }) => {
    await page.setViewportSize({ width: c.width, height: c.height });
    await openEditor(page, {
      project: { text: deepProject() },
      commands: [...(c.language === 'pt-BR' ? [run('preferences.setLanguage#menu-language-pt-br')] : []), run('inspector.setMode#inspector-mode-all'), run('selection.select#layers-row', { target: 'd-section' })],
    });
    await expect.poll(() => page.evaluate(() => document.documentElement.lang)).toBe(c.language);
    const found: string[] = [];
    const check = async (step: string, inserted: string | null = null) => {
      await nextFrames(page);
      for (const breach of await breaches(page, inserted)) found.push(`${step}: ${breach}`);
      const v = await views(page);
      // Layers is compared where it is drawn (a narrow window's first visit keeps the sidebar closed)
      if (v.selected.length === 1 && ((v.tree && !v.layers.includes(v.selected[0])) || !v.canvas.includes(v.selected[0] ?? null))) found.push(`${step}: as vistas não mostram a mesma seleção (${JSON.stringify(v)})`);
    };
    await check('aberto');
    // the Insert panel, as a person opens it, and four elements inserted from it
    const insertTile = page.locator('[data-door="element.insert#elements-tile"]');
    if ((await insertTile.count()) === 0 || !(await insertTile.first().isVisible())) await page.locator('[data-door="workspace.setPanelOpen#toolbar-activity-bar-insert"]').click();
    for (const entry of ['section', 'heading', 'paragraph', 'button']) {
      await page.locator(`[data-door="element.insert#elements-tile"][data-args*='"entry":"${entry}"']`).click();
      const inserted = (await views(page)).selected[0] ?? null;
      await check(`inserido ${entry}`, inserted);
    }
    // the deepest heading chosen in Layers: the breadcrumb names thirteen levels
    const deep = page.locator(`[data-door="selection.select#layers-row"][data-args*='"d-title"']`).first();
    if ((await page.locator('[data-region="layers-tree"]').count()) === 0) await page.locator('[data-door="workspace.setPanelOpen#toolbar-activity-bar-explorer"]').click();
    // the tree draws the rows in its window: it is scrolled down until the row is drawn, as a person scrolls to it
    const tree = page.locator('[data-region="layers-tree"]').first();
    for (let i = 0; i < 12 && (await deep.count()) === 0; i += 1) {
      const box = await tree.boundingBox();
      if (box === null) break;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.wheel(0, box.height * 0.6);
      await nextFrames(page);
    }
    await deep.click();
    await check('título profundo escolhido nas Camadas');
    // a field of the Style tab with the focus, as Tab or a click gives it
    await page.locator('[data-door="style.set#inspector-font-size"] input').first().click();
    await check('foco no tamanho da fonte');
    const scrolled = await page.locator('.inspector-scroll').first().evaluate((el) => el.scrollLeft);
    if (scrolled !== 0) found.push(`foco no tamanho da fonte: o Inspector andou ${scrolled}px de lado`);
    await page.keyboard.press('Escape');
    await page.locator('[data-door="workspace.setActiveTab#inspector-tab-settings"]').click();
    await check('aba Configurações');
    expect(found, 'what breaks G4, G5 or G6').toEqual([]);
    // G7: the canvas a reload draws is the canvas the edits drew
    await expect(page.locator('[data-save-state]')).toHaveAttribute('data-save-state', 'saved');
    const before = await drawn(page);
    await page.reload();
    await expect(page.locator('.workbench')).toBeVisible();
    await expect.poll(() => drawn(page), { message: 'the canvas after a reload' }).toBe(before);
  });
}
