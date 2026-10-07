// How the status bar's breadcrumb fits its room (CLAUDE.md, rule G5: no control of a bar out of reach — a deep
// selection's breadcrumb ran past the window, and the zoom, the language and the save state with it): the page root and
// as many of the last levels as the room holds, down to the selected one, which never folds; the levels between fold
// into one "…" button whose menu holds them. It is the collapsed breadcrumb of MUI's Breadcrumbs (the first
// itemsBeforeCollapse, an ellipsis, the last itemsAfterCollapse: https://mui.com/material-ui/api/breadcrumbs/), with one
// level before the fold and as many after it as the room holds, measured, never a count fixed in advance.
//
// `widths` are the crumbs' widths as the bar draws them, each with the separator before it (the first has none); `more`
// is the "…" button's, with its own separator. The answer is how many of the last crumbs stand after the fold, or null
// when every crumb fits and none folds.
export function crumbsAfterFold(widths: readonly number[], more: number, room: number): number | null {
  const total = widths.reduce((sum, width) => sum + width, 0);
  // the page root and the selected level alone: nothing between them to fold
  if (total <= room + 0.5 || widths.length <= 2) return null;
  let used = (widths[0] ?? 0) + more;
  let after = 0;
  for (let i = widths.length - 1; i >= 1; i -= 1) {
    const width = widths[i] ?? 0;
    // the selected level stands whatever the room (its name is cut when even it does not fit: status-bar.css)
    if (after > 0 && used + width > room + 0.5) break;
    used += width;
    after += 1;
  }
  return Math.min(after, widths.length - 2);
}
