// The one entry point of every browser test: specs and the scenario runner import `test` and `expect` from here,
// never from '@playwright/test' directly (lint: a spec that imports them anywhere else fails). Every test runs in a
// new browser context (Playwright's default: a fresh profile per test), opened by tests/support/editor.ts.
//
// Every test ends by checking what it leaves, whatever it asserted itself — a defect the test did not look for still
// fails it:
//   - the incident feed of the page (src/core/incidents.ts, through the test port): a command that left a document the
//     model refuses, one that claimed a structural change it did not make, an error the page threw;
//   - the page's own errors: an exception nothing caught, a console error, a request of the app's own origin that
//     failed or was answered with an error (browserErrors below);
//   - the screen (tests/support/screen-guard.ts): a text cut, a one-line name on two lines, a control out of the
//     window or under another part of the editor, English in the Portuguese editor.
// A test that expects an error says so (expectBrowserErrors), naming each one by a pattern; nothing else is excused.
import { test as base, expect, type Page, type TestInfo } from '@playwright/test';
import { SANDBOX_REFUSES_SCRIPT } from '../../tools/runner/clock.ts';
import { COVERAGE, startCoverage, stopCoverage } from './coverage.ts';
import { ordered, orderOf } from '../../tools/runner/order.ts';
import { guardScreen } from './screen-guard.ts';

// two frames of the page's rendering (tools/runner/clock.ts), for every spec
export { nextFrames } from '../../tools/runner/clock.ts';

interface BrowserError {
  readonly kind: 'exception' | 'console' | 'request';
  readonly text: string;
}
const EXPECTED = new WeakMap<TestInfo, RegExp[]>();
// The errors a test provokes on purpose (a project file the reader refuses, a site that answers 404): each pattern
// excuses the errors it matches, and only in that test.
export function expectBrowserErrors(...patterns: RegExp[]): void {
  const info = base.info();
  EXPECTED.set(info, [...(EXPECTED.get(info) ?? []), ...patterns]);
}

// Before the editor opens: the page's timers, frames and Date come from Playwright's clock, flowing as real time until
// a test holds it still (tools/runner/clock.ts). The clock is a script offered to every frame, which the canvas's
// sandboxed frame refuses on the console.
export async function installClock(page: Page): Promise<void> {
  expectBrowserErrors(SANDBOX_REFUSES_SCRIPT);
  await page.clock.install();
}

function watchErrors(page: Page): BrowserError[] {
  const errors: BrowserError[] = [];
  const origin = (url: string) => {
    try {
      return new URL(url).origin;
    } catch {
      return '';
    }
  };
  const own = (url: string) => {
    const base = page.url();
    return base.startsWith('http') && origin(url) === origin(base);
  };
  // the editor's own page: another page a test opens (a site it captures, an exported page) answers for itself
  const editor = () => own(page.url());
  page.on('pageerror', (error) => {
    if (editor()) errors.push({ kind: 'exception', text: `${error.name}: ${error.message}` });
  });
  page.on('console', (message) => {
    // a resource that failed is read from the network below, for the app's own origin only (a page drawn on the canvas
    // may name images of other sites)
    if (message.type() === 'error' && editor() && !message.text().startsWith('Failed to load resource')) errors.push({ kind: 'console', text: message.text() });
  });
  page.on('requestfailed', (request) => {
    // a request the page itself gave up (a navigation away, an aborted fetch) is no failure of the app
    const failure = request.failure()?.errorText ?? '';
    if (own(request.url()) && !/ERR_ABORTED/.test(failure)) errors.push({ kind: 'request', text: `${request.method()} ${request.url()} failed: ${failure}` });
  });
  page.on('response', (response) => {
    if (own(response.url()) && response.status() >= 400) errors.push({ kind: 'request', text: `${response.request().method()} ${response.url()} answered ${response.status()}` });
  });
  return errors;
}

const guarded = base.extend<{ incidentGuard: undefined; browserErrors: undefined; coverage: undefined; screenGuard: undefined }>({
  screenGuard: [
    async ({ page }, use, info) => {
      await use(undefined);
      const found = await guardScreen(page, info);
      expect(found, 'what the screen shows wrong at the end of the test (tests/support/screen-guard.ts)').toEqual([]);
    },
    { auto: true },
  ],
  // with E2E_COVERAGE=1, what the test executed of the editor, for the impact selector (tests/support/coverage.ts)
  coverage: [
    async ({ page }, use, info) => {
      if (!COVERAGE) {
        await use(undefined);
        return;
      }
      await startCoverage(page);
      await use(undefined);
      if (!page.isClosed()) await stopCoverage(page, info).catch(() => undefined);
    },
    { auto: true },
  ],
  browserErrors: [
    async ({ page }, use, info) => {
      const errors = watchErrors(page);
      // the other pages a test opens in its context (a second tab of the editor) are watched as well
      const others: BrowserError[][] = [];
      page.context().on('page', (other) => {
        if (other !== page) others.push(watchErrors(other));
      });
      await use(undefined);
      const excused = EXPECTED.get(info) ?? [];
      const left = [...errors, ...others.flat()].filter((error) => !excused.some((pattern) => pattern.test(error.text)));
      expect(left, "the page's own errors: exceptions, console errors, failed requests of the app").toEqual([]);
    },
    { auto: true },
  ],
  incidentGuard: [
    async ({ page }, use) => {
      await use(undefined);
      if (page.isClosed()) return;
      const found = await page
        .evaluate(() => (window as unknown as { __builderTestPort?: { incidents: () => unknown[] } }).__builderTestPort?.incidents() ?? [])
        .catch(() => []);
      expect(found, 'the incident feed of the page').toEqual([]);
    },
    { auto: true },
  ],
});

// declared in the order E2E_ORDER asks (tools/runner/order.ts), each file's own when it is unset
export const test = ordered(guarded, orderOf(process.env.E2E_ORDER));

export { expect };
export type { Download, Locator, Page, TestInfo } from '@playwright/test';
