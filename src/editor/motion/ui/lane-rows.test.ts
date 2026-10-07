import { describe, expect, it } from 'vitest';
import { laneRows } from './lane-rows.ts';

describe("a lane's rows", () => {
  it('keeps bars that follow each other on one row', () => {
    const { row, rows } = laneRows([
      { id: 'a', left: 0, right: 60 },
      { id: 'b', left: 60, right: 90 },
    ]);
    expect(rows).toBe(1);
    expect([...row]).toEqual([
      ['a', 0],
      ['b', 0],
    ]);
  });

  it('puts bars played together on rows of their own, and a later bar back on the first row free', () => {
    const { row, rows } = laneRows([
      { id: 'a', left: 0, right: 60 },
      { id: 'b', left: 0, right: 60 },
      { id: 'c', left: 30, right: 80 },
      { id: 'd', left: 70, right: 100 },
    ]);
    expect(rows).toBe(3);
    expect(Object.fromEntries(row)).toEqual({ a: 0, b: 1, c: 2, d: 0 });
  });

  it('has one row for an empty lane', () => {
    expect(laneRows([]).rows).toBe(1);
  });
});
