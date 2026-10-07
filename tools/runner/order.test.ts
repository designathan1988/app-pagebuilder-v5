import { describe, expect, it } from 'vitest';
import { arrange, ordered, orderOf } from './order.ts';

describe('the order browser tests are declared in', () => {
  it('reads E2E_ORDER, and refuses a value it does not know', () => {
    expect(orderOf(undefined)).toEqual({ kind: 'declared' });
    expect(orderOf('reverse')).toEqual({ kind: 'reverse' });
    expect(orderOf('shuffle:42')).toEqual({ kind: 'shuffle', seed: 42 });
    expect(() => orderOf('random')).toThrow(/E2E_ORDER/);
  });

  it('deals the same seed the same way, another seed another way, and keeps every item', () => {
    const items = Array.from({ length: 30 }, (_, i) => i);
    const once = arrange(items, { kind: 'shuffle', seed: 7 });
    expect(arrange(items, { kind: 'shuffle', seed: 7 })).toEqual(once);
    expect(arrange(items, { kind: 'shuffle', seed: 8 })).not.toEqual(once);
    expect([...once].sort((a, b) => a - b)).toEqual(items);
    expect(once).not.toEqual(items);
    expect(arrange(items, { kind: 'reverse' })).toEqual([...items].reverse());
  });

  // a stand-in for Playwright's test type: it records what is declared, in which describe
  function recorder() {
    const declared: string[] = [];
    const path: string[] = [];
    const test = Object.assign((title: string) => void declared.push([...path, title].join(' › ')), {
      describe: Object.assign(
        (title: string, body: () => void) => {
          path.push(title);
          body();
          path.pop();
        },
        { configure: () => undefined },
      ),
      beforeEach: () => void declared.push([...path, '(hook)'].join(' › ')),
      skip: (title: string | boolean) => void (typeof title === 'string' ? declared.push([...path, `skip ${title}`].join(' › ')) : declared.push('(modifier)')),
    });
    return { test, declared };
  }

  it('declares a file in reverse once its body has run, each describe in reverse at its end, hooks at once', async () => {
    const { test, declared } = recorder();
    const t = ordered(test, { kind: 'reverse' });
    t('a');
    t.beforeEach();
    t.describe('D', () => {
      t('d1');
      t.skip('d2');
      t('d3');
    });
    t('b');
    t.skip(true);
    // nothing of the file is declared before its body ends
    expect(declared).toEqual(['(hook)', '(modifier)']);
    await Promise.resolve();
    expect(declared).toEqual(['(hook)', '(modifier)', 'b', 'D › d3', 'D › skip d2', 'D › d1', 'a']);
  });

  it('is the test type itself when the order is the declared one', () => {
    const { test } = recorder();
    expect(ordered(test, { kind: 'declared' })).toBe(test);
  });
});
