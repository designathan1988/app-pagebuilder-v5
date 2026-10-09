// A Layers row whose name does not fit beside its details (its tag, id or classes), or an Explorer file's row beside
// its folder and size, gives the details' room to the name:
// they leave that row, and the name ends in an ellipsis only where it does not fit the row alone (the audit of
// 2026-10-05: "Cartão Assinatura título" read "Cartão Assi…" beside "article"). The details' width is kept when they
// leave, so a row is judged the same either way and nothing flickers: they come back once the name and they fit again.
// a Layers row, and an Explorer file's main area, with the name and the details each holds
const ROWS = '.row--tree, .row__main';
const NAME = ':scope > .row__name';
// (an Explorer file's "generated" mark is one of its details: beside "contact.html" it left the name cut where the
// sidebar is 15 px narrower, DEF-0593)
const DETAILS = ':scope > .row__meta[data-region="layers-row-details"], .row__main > .row__meta, .row__main > .row__gen';
// the sub-pixel difference between the text's width and its box
const TOLERANCE = 0.5;

// The room a row leaves free beside what it draws: an Explorer file's name is as wide as it reads and does not grow,
// so the free room is where the details come back to (a Layers row's name takes the row, and leaves none)
function freeRoom(row: HTMLElement, gap: number): number {
  const style = getComputedStyle(row);
  const shown = [...row.children].filter((one): one is HTMLElement => one instanceof HTMLElement && one.offsetWidth > 0);
  const used = shown.reduce((sum, one) => sum + one.offsetWidth, 0) + gap * Math.max(0, shown.length - 1);
  return Math.max(0, row.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0) - used);
}

export function fitNames(list: HTMLElement): void {
  for (const row of list.querySelectorAll<HTMLElement>(ROWS)) {
    const name = row.querySelector<HTMLElement>(NAME);
    const details = [...row.querySelectorAll<HTMLElement>(DETAILS)];
    if (name === null || details.length === 0) {
      delete row.dataset.nameFirst;
      continue;
    }
    const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
    if (!('nameFirst' in row.dataset)) {
      if (name.scrollWidth > name.clientWidth + TOLERANCE) {
        // the details' width with the gaps before them: the room they take back
        row.dataset.detailsWidth = String(details.filter((one) => one.offsetWidth > 0).reduce((sum, one) => sum + one.offsetWidth + gap, 0));
        row.dataset.nameFirst = '';
      }
      continue;
    }
    // the details come back once the name and they fit: the name's own box and the room the row leaves free (an
    // Explorer file whose name went first once, the sidebar narrower for a moment, kept its details away for good,
    // since its name never grows past what it reads, DEF-0593)
    const room = Number(row.dataset.detailsWidth ?? '0');
    if (name.scrollWidth + room <= name.clientWidth + freeRoom(row, gap) + TOLERANCE) delete row.dataset.nameFirst;
  }
}
