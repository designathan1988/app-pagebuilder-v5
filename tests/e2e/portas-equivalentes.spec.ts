// G3 (CLAUDE.md, the editor's rules): every door of a command gives the same result from the same state. A number
// field's step is drawn three times — its step button, the arrow key in the field, the wheel over the focused field —
// and each must step the same value from the same field: an empty field (its placeholder is the value the page
// computes, which it shows), a length the element holds, a keyword (nothing to step). Each door runs in an editor of its
// own, opened the same way.
import type { Browser } from '@playwright/test';
import { expect, nextFrames, test, type Page } from '../support/test.ts';
import { openEditor } from '../support/editor.ts';
import { door, runs } from './door.ts';
import { NODE_PATH, type TestBootCommand } from '../../src/editor/test-boot.ts';

interface DocNode {
  readonly name: string;
  readonly styles?: Readonly<Record<string, Readonly<Record<string, Readonly<Record<string, string>>>>>>;
  readonly children: readonly DocNode[];
}

const run = (ref: string, args: Readonly<Record<string, unknown>> = {}): TestBootCommand => ({ command: ref.split('#')[0] ?? '', args: { ...door(ref).args, ...args } });
const at = (path: string) => ({ [NODE_PATH]: path });

// what the heading holds for a property at the base breakpoint, through the read-only test port
const heldBy = (page: Page, property: string) =>
  page.evaluate((name) => {
    const port = (window as unknown as { __builderTestPort: { document: () => { pages: readonly { tree: DocNode }[] } } }).__builderTestPort;
    let found: string | undefined;
    const walk = (n: DocNode) => {
      if (n.name === 'Title') found = n.styles?.desktop?.base?.[name];
      n.children.forEach(walk);
    };
    walk(port.document().pages[0]?.tree as DocNode);
    return found ?? null;
  }, property);

interface Field {
  readonly property: string;
  readonly ref: string;
  readonly keyword: string;
}
const FIELDS: readonly Field[] = [
  { property: 'font-size', ref: 'style.set#inspector-font-size', keyword: 'larger' },
  { property: 'width', ref: 'style.set#inspector-width', keyword: 'auto' },
];
const STATES = [
  { name: 'an empty field', value: null },
  { name: 'a length the element holds', value: '30px' },
  { name: 'a keyword the element holds', value: 'keyword' },
] as const;

interface Door {
  readonly name: string;
  readonly ref: string;
  readonly press: (page: Page, field: Field) => Promise<void>;
}
const input = (page: Page, field: Field) => page.locator(`[data-door="${field.ref}"]`).first().locator('input').first();
const DOORS: readonly Door[] = [
  {
    name: 'the step button',
    ref: 'field.step#inspector-step-up',
    press: async (page, field) => {
      await input(page, field).click();
      await page.locator(`[data-door="${field.ref}"]`).first().locator('[data-door="field.step#inspector-step-up"]').click();
    },
  },
  {
    name: 'the arrow key',
    ref: 'field.step#key-arrow-up-in-number-field',
    press: async (page, field) => {
      await input(page, field).click();
      await page.keyboard.press('ArrowUp');
    },
  },
  {
    name: 'the wheel',
    ref: 'field.step#key-arrow-up-in-number-field',
    press: async (page, field) => {
      // the field takes the focus first (the panel may scroll it into view), and the wheel turns over it where it is then
      await input(page, field).click();
      const box = await input(page, field).boundingBox();
      if (box === null) throw new Error(`${field.ref}: no input drawn`);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.wheel(0, -100);
    },
  },
];

// one door pressed in an editor of its own: the value the heading holds then
async function stepped(browser: Browser, field: Field, state: (typeof STATES)[number], pressed: Door): Promise<string | null> {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US', reducedMotion: 'reduce' });
  try {
    const page = await context.newPage();
    const holds = state.value === null ? [] : [run(field.ref, { property: field.property, value: state.value === 'keyword' ? field.keyword : state.value })];
    await openEditor(page, { project: 'aurora', commands: [run('inspector.setMode#inspector-mode-all'), run('selection.select#layers-row', { target: at('/Page/Hero/Title') }), ...holds] });
    const start = await heldBy(page, field.property);
    await pressed.press(page, field);
    // a step runs as its key, its press or its notch arrives (one dispatch, nothing waits for a frame): what the document
    // holds two frames later is what it wrote, or nothing (an empty field with nothing to step from, a keyword)
    await nextFrames(page);
    const end = await heldBy(page, field.property);
    return `${start ?? '(none)'} → ${end ?? '(none)'}`;
  } finally {
    await context.close();
  }
}

for (const field of FIELDS) {
  for (const state of STATES) {
    test(`${field.property}, ${state.name}: the step button, the arrow key and the wheel step it alike`, runs(...new Set(DOORS.map((d) => d.ref))), async ({ browser }) => {
      const results: Record<string, string | null> = {};
      for (const pressed of DOORS) results[pressed.name] = await stepped(browser, field, state, pressed);
      const values = new Set(Object.values(results));
      expect(values.size, `every door of field.step gives the same value: ${JSON.stringify(results)}`).toBe(1);
    });
  }
}
