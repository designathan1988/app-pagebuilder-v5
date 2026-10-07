// A person's hand, as the specs play it where time is part of the behaviour: on the pointer, it rests a moment before
// letting go of a drag, trembling a pixel or two; on the keys, it types a word's letters a few tens of ms apart. Both
// run on the page's own time (tools/runner/clock.ts): each moment lasts the page's milliseconds it names however busy
// the machine is, and costs no real wait. The spec installs the clock before the editor opens (installClock,
// tests/support/test.ts).
import fs from 'node:fs';
import { withTimeStill } from '../../tools/runner/clock.ts';
import type { Page } from './test.ts';

// A number of the interaction contract (manifest/interactions.json): a dwell, a burst window, a delay.
export function interactionNumber(id: string): number {
  const constants = (JSON.parse(fs.readFileSync('manifest/interactions.json', 'utf8')) as { constants: { id: string; value: unknown }[] }).constants;
  const value = constants.find((c) => c.id === id)?.value;
  if (typeof value !== 'number') throw new Error(`manifest/interactions.json has no number ${id}`);
  return value;
}

interface Rest<T> {
  // how far the hand trembles: 1 px across and down, or 2 px down
  readonly reach?: 1 | 2;
  // the page's milliseconds between two moments
  readonly every?: number;
  // what is read at each moment
  readonly read?: () => Promise<T>;
}

export async function restTrembling<T = never>(page: Page, at: { readonly x: number; readonly y: number }, moments: number, rest: Rest<T> = {}): Promise<T[]> {
  const { reach = 1, every = 50, read } = rest;
  return withTimeStill(page, async () => {
    const seen: T[] = [];
    for (let k = 0; k < moments; k += 1) {
      await page.mouse.move(at.x + (k % 3) - 1, at.y + (reach === 1 ? k % 2 : ((k * 7) % 5) - 2));
      await page.clock.fastForward(every);
      if (read !== undefined) seen.push(await read());
    }
    return seen;
  });
}

// Letters typed as a person types them, `every` ms of the page's time apart: within one typing burst
// (keys.typingBurst) however busy the machine is. Played while the page's time stands still (withTimeStill).
export async function typeLetters(page: Page, text: string, every = 80): Promise<void> {
  for (const letter of text) {
    await page.keyboard.type(letter);
    await page.clock.fastForward(every);
  }
}
