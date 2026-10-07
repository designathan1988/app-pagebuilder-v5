// The rows of a lane's bars: actions that overlap on the timeline (two played together, "with the last one") would be
// drawn one over the other, the one under taking no press; each is put on the first row of the lane whose bars end
// before it starts, so every bar is seen and pressed whole.
export interface Span {
  readonly id: string;
  readonly left: number;
  readonly right: number;
}

// The row of each bar, by its id, and how many rows the lane holds (one at least).
export function laneRows(spans: readonly Span[]): { readonly row: ReadonlyMap<string, number>; readonly rows: number } {
  const ends: number[] = [];
  const row = new Map<string, number>();
  for (const span of [...spans].sort((a, b) => a.left - b.left || a.right - b.right)) {
    let at = ends.findIndex((end) => end <= span.left);
    if (at < 0) {
      at = ends.length;
      ends.push(span.right);
    } else ends[at] = span.right;
    row.set(span.id, at);
  }
  return { row, rows: Math.max(1, ends.length) };
}
