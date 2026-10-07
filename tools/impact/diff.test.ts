// The line diff the impact selector reads changes with (diff.ts): the older lines a newer text changed, removed, or
// inserted new lines beside.
import { describe, expect, it } from 'vitest';
import { changedOldLines, meets } from './diff.ts';

const text = (...lines: string[]) => lines.join('\n');

describe('the changed lines of an older text', () => {
  it('are none for the same text', () => {
    expect(changedOldLines(text('a', 'b'), text('a', 'b'))).toEqual([]);
  });

  it('are the lines edited in place', () => {
    expect(changedOldLines(text('a', 'b', 'c', 'd'), text('a', 'B', 'c', 'D'))).toEqual([
      [2, 2],
      [4, 4],
    ]);
  });

  it('are the lines removed', () => {
    expect(changedOldLines(text('a', 'b', 'c', 'd'), text('a', 'd'))).toEqual([[2, 3]]);
  });

  it('are the two older lines around an insertion, at the start, between lines and at the end', () => {
    expect(changedOldLines(text('a', 'b', 'c'), text('a', 'x', 'y', 'b', 'c'))).toEqual([[1, 2]]);
    expect(changedOldLines(text('a', 'b'), text('x', 'a', 'b'))).toEqual([[1, 1]]);
    expect(changedOldLines(text('a', 'b'), text('a', 'b', 'x'))).toEqual([[2, 2]]);
  });

  it('places a change in a long file by its lines alone, whatever moved above it', () => {
    const older = Array.from({ length: 400 }, (_, i) => `line ${i}`);
    const newer = [...older];
    newer.splice(10, 0, 'inserted near the top');
    newer[300] = 'changed far below';
    // line 300 of the newer text is the older line 300 (index 299) after the insertion moved it one down
    expect(changedOldLines(older.join('\n'), newer.join('\n'))).toEqual([
      [10, 11],
      [300, 300],
    ]);
  });

  it('meets the runs a test ran when they share a line', () => {
    expect(meets([[5, 9]], [[9, 12]])).toBe(true);
    expect(meets([[5, 9]], [[10, 12]])).toBe(false);
    expect(meets(undefined, [[1, 1]])).toBe(false);
  });
});
