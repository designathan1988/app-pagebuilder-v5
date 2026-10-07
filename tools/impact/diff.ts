// Which lines of an older text a newer one changed, without any version-control system: the longest common
// subsequence of the two texts' lines (after their common start and end are set aside) aligns them; an older line out
// of it was changed or removed, and a gap where newer lines were inserted changes the older lines on either side of it
// (whatever ran at either end of the gap is what the new lines run beside), so a test that ran there is never missed.
export type Lines = readonly (readonly [number, number])[];

// merges 1-based line numbers into sorted [from, to] runs
function runs(lines: readonly number[]): [number, number][] {
  const out: [number, number][] = [];
  for (const line of [...new Set(lines)].sort((a, b) => a - b)) {
    const last = out.at(-1);
    if (last !== undefined && line <= last[1] + 1) last[1] = Math.max(last[1], line);
    else out.push([line, line]);
  }
  return out;
}

// the pairs (older index, newer index) of an LCS of two line lists; null when they are too large to align
function align(a: readonly string[], b: readonly string[]): [number, number][] | null {
  if (a.length * b.length > 25_000_000) return null;
  const width = b.length + 1;
  const table = new Uint32Array((a.length + 1) * width);
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      table[i * width + j] = a[i] === b[j] ? (table[(i + 1) * width + j + 1] as number) + 1 : Math.max(table[(i + 1) * width + j] as number, table[i * width + j + 1] as number);
    }
  }
  const pairs: [number, number][] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      pairs.push([i, j]);
      i += 1;
      j += 1;
    } else if ((table[(i + 1) * width + j] as number) >= (table[i * width + j + 1] as number)) i += 1;
    else j += 1;
  }
  return pairs;
}

// The older text's changed lines, 1-based, as [from, to] runs; none when the texts are the same.
export function changedOldLines(older: string, newer: string): Lines {
  if (older === newer) return [];
  const a = older.split('\n');
  const b = newer.split('\n');
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start += 1;
  let endA = a.length;
  let endB = b.length;
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA -= 1;
    endB -= 1;
  }
  const pairs = align(a.slice(start, endA), b.slice(start, endB));
  // a middle too large to align counts as changed whole, with its neighbours
  if (pairs === null) return runs([...Array.from({ length: endA - start }, (_, k) => start + k + 1), start, endA + 1].filter((line) => line >= 1 && line <= a.length));
  const changed: number[] = [];
  // walk the aligned pairs with a sentinel at each end: the gap between two pairs holds older lines removed and newer
  // lines inserted (indices into the whole texts, 0-based)
  const points: [number, number][] = [[start - 1, start - 1], ...pairs.map(([i, j]): [number, number] => [start + i, start + j]), [endA, endB]];
  for (let k = 1; k < points.length; k += 1) {
    const [i0, j0] = points[k - 1] as [number, number];
    const [i1, j1] = points[k] as [number, number];
    for (let i = i0 + 1; i < i1; i += 1) changed.push(i + 1);
    if (j1 - j0 > 1 && i1 - i0 === 1) {
      // newer lines inserted in this gap, and no older line replaced: the older lines that border it
      if (i0 >= 0) changed.push(i0 + 1);
      if (i1 < a.length) changed.push(i1 + 1);
    }
  }
  return runs(changed.filter((line) => line >= 1 && line <= a.length));
}

// whether two sets of line runs meet
export const meets = (ran: Lines | undefined, changed: Lines): boolean => ran !== undefined && ran.some(([a, b]) => changed.some(([c, d]) => a <= d && b >= c));
