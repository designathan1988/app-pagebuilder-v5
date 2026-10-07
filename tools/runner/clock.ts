// Time a browser test plays itself (Playwright's clock, https://playwright.dev/docs/clock): a behaviour bound to a
// delay or to frames — a menu's dwell, a held step button, a Layers row's dwell, the autoscroll a held drag makes each
// frame — reads the page's own timers and frames, so the test moves them (page.clock.runFor) instead of waiting on the
// machine. A real wait is stretched or starved by a busy machine: a dwell fires that should not, or an autoscroll makes
// fewer frames and scrolls less. The clock is installed before the page loads (tests/support/test.ts, installClock).
// A wait on timers (a dwell, a burst, an idle wait) jumps with page.clock.fastForward, which fires each timer due once
// and costs a round trip; page.clock.runFor plays every frame and every repeat of an interval on the way, a few times
// slower than the time it plays, and is kept for what needs them (an autoscroll's frames, a held button's repeats).
import type { Page } from '@playwright/test';

// Two animation frames of the page: what a change draws in a frame (a measure, the scroll that follows a zoom) is there
// once the second starts. A wait on the page's own rendering, never on the machine's time.
export const nextFrames = (page: Page): Promise<void> => page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));

// A script the test offers every frame (an init script, the clock): the canvas's sandboxed frame refuses it and says so
// on the console; the editor itself runs no script there.
export const SANDBOX_REFUSES_SCRIPT = /^Blocked script execution in 'about:(blank|srcdoc)' because the document's frame is sandboxed/;

// The clock refuses to pause at a time the page already passed: the pause lands this far ahead of the page's time, so a
// timer due within it fires on the way, a little early. Called at a moment with no timer that close.
const PAUSE_AHEAD = 100;

// The page's time stands still while `played` runs, and moves only by page.clock.runFor; then it flows again.
export async function withTimeStill<T>(page: Page, played: () => Promise<T>): Promise<T> {
  for (let attempt = 1; ; attempt += 1) {
    const now = await page.evaluate(() => Date.now());
    try {
      await page.clock.pauseAt(now + PAUSE_AHEAD);
      break;
    } catch (error) {
      // the page got there first (a slow round trip): read its time again
      if (attempt === 3 || !String(error).includes('Cannot fast-forward to the past')) throw error;
    }
  }
  try {
    return await played();
  } finally {
    await page.clock.resume();
  }
}
