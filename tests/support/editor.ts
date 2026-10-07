// Opening the editor for a browser test, in one place: every test runs in a new browser context, a fresh profile with
// nothing stored, so the editor is loaded once — and the fresh profile is proven, not assumed: what the page had
// stored before any of its scripts ran is read.
//
// The state a test needs is handed to the editor before it starts (src/editor/test-boot.ts): the project it opens
// (project.open, as File › Open opens it) and the commands that set the rest up (the selection, the language, the
// theme, the breakpoint, the zoom), run through the editor's own store. A test whose subject is the way there (File ›
// Open and its file chooser, a click that selects) goes there through the doors instead.
import fs from 'node:fs';
import path from 'node:path';
import { expect, type Page } from '@playwright/test';
import { STORED_AT_START, TEST_BOOT_PARAM, TEST_BOOT_URL, type TestBoot, type TestBootCommand, type TestBootResult } from '../../src/editor/test-boot.ts';

export const FIXTURES = 'manifest/features/fixtures';

export interface EditorSetup {
  // a fixture of manifest/features/fixtures by its name, or the text of a project file
  readonly project?: string | { readonly text: string };
  readonly commands?: readonly TestBootCommand[];
  // the commands that read what the editor draws (a zoom), run once it is drawn
  readonly drawn?: readonly TestBootCommand[];
  // a second page of the same context, which shares its profile: what the first page wrote is expected there
  readonly reusedProfile?: boolean;
}

// the text of a fixture, read once per worker
const fixtureTexts = new Map<string, string>();
export function fixtureText(name: string): string {
  let text = fixtureTexts.get(name);
  if (text === undefined) {
    text = fs.readFileSync(path.join(FIXTURES, `${name}.json`), 'utf8');
    fixtureTexts.set(name, text);
  }
  return text;
}

export async function openEditor(page: Page, setup: EditorSetup = {}): Promise<void> {
  const project = setup.project === undefined ? undefined : typeof setup.project === 'string' ? fixtureText(setup.project) : setup.project.text;
  const boot: TestBoot | null = project === undefined && (setup.commands ?? []).length === 0 && (setup.drawn ?? []).length === 0 ? null : { ...(project === undefined ? {} : { project }), commands: setup.commands ?? [], drawn: setup.drawn ?? [] };
  // The boot is fetched by the editor from TEST_BOOT_URL, which only this page answers, and only for its first load (a
  // reload starts from what the editor saved). The page itself is the server's own: the browser treats it as the editor
  // a person opens (a page a test answered itself would lose its address space, and its requests to the Companion on
  // this machine would be refused).
  if (boot === null) await page.goto('/');
  else {
    await page.route(TEST_BOOT_URL, (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify(boot) }));
    await page.goto(`/?${TEST_BOOT_PARAM}`);
  }
  // In one wait inside the page (each check at every turn of its event loop, never a round trip per try): the editor
  // drawn, the boot's commands all run (the drawn ones two frames after the first render) and the canvas, where the
  // editor shows one, drawing the project — an element of a page, authored or captured, the empty project's page among
  // them — so a press on the page lands on what it draws. What the page holds then is asserted here.
  const handedCount = boot === null ? 0 : (project === undefined ? 0 : 1) + (boot.commands?.length ?? 0) + (boot.drawn?.length ?? 0);
  const opened = await page.evaluate(
    async ({ key, handed }) => {
      const port = () => (window as unknown as { __builderTestPort?: { boot: () => TestBootResult[] } }).__builderTestPort;
      const shown = (el: Element | null) => el !== null && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
      const frame = () => document.querySelector<HTMLIFrameElement>('.frame__page');
      const drawn = () => frame()?.contentDocument?.querySelector('[data-node],[data-capture-node]') != null;
      const ready = () => shown(document.querySelector('.workbench')) && (port()?.boot().length ?? -1) >= handed && (frame() === null || drawn());
      const until = performance.now() + 10_000;
      while (!ready() && performance.now() < until) await new Promise((resolve) => setTimeout(resolve, 5));
      return { stored: (window as unknown as Record<string, unknown>)[key], workbench: shown(document.querySelector('.workbench')), boot: port()?.boot() ?? null, drawn: frame() === null || drawn() };
    },
    { key: STORED_AT_START, handed: handedCount },
  );
  if (setup.reusedProfile !== true) expect(opened.stored, 'the editor opens in a fresh profile: nothing was stored before it loaded').toEqual({ local: 0, session: 0 });
  // the editor is drawn before the test reads or acts on it, its canvas with it
  expect(opened.workbench, 'the editor is drawn').toBe(true);
  expect(opened.drawn, 'the canvas draws the project the editor opened').toBe(true);
  if (boot === null) return;
  expect(opened.boot?.length, 'the test boot ran every command it was handed').toBe(handedCount);
  expect(opened.boot?.filter((one) => one.status !== 'done'), 'the test boot ran every command as asked').toEqual([]);
  await page.unroute(TEST_BOOT_URL);
}
