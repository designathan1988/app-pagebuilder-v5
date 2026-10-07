// The status bar's breadcrumb fits its room (crumb-fold.ts; CLAUDE.md, rule G5): the page root, then as many of the
// last levels as the room holds, the levels between folded into one "…".
import { describe, expect, it } from 'vitest';
import { crumbsAfterFold } from './crumb-fold.ts';

// the page root (no separator before it) and five levels, each 60 wide with its separator; the "…" is 24
const CRUMBS = [50, 60, 60, 60, 60, 60];
const MORE = 24;

describe("the status bar's breadcrumb", () => {
  it('folds nothing while every level fits', () => {
    expect(crumbsAfterFold(CRUMBS, MORE, 350)).toBeNull();
    expect(crumbsAfterFold(CRUMBS, MORE, 400)).toBeNull();
  });

  it('keeps the page root and as many of the last levels as fit, the rest folded', () => {
    // 50 + 24 + 3 × 60 = 254 fits 260; a fourth would not
    expect(crumbsAfterFold(CRUMBS, MORE, 260)).toBe(3);
    expect(crumbsAfterFold(CRUMBS, MORE, 349)).toBe(4);
    expect(crumbsAfterFold(CRUMBS, MORE, 140)).toBe(1);
  });

  it('never folds the selected level, however narrow the room', () => {
    expect(crumbsAfterFold(CRUMBS, MORE, 40)).toBe(1);
    expect(crumbsAfterFold(CRUMBS, MORE, 0)).toBe(1);
  });

  it('has nothing to fold between the page root and the selected level', () => {
    expect(crumbsAfterFold([50, 60], MORE, 40)).toBeNull();
    expect(crumbsAfterFold([50], MORE, 10)).toBeNull();
  });

  it('always folds at least one level when it folds', () => {
    // all but the root fit beside the "…" only when the whole fits without it: then nothing folds
    expect(crumbsAfterFold([10, 10, 10, 10], 0, 39)).toBe(2);
  });
});
