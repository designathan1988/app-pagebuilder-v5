// The screen guard's exceptions (tests/support/screen-guard.ts): a finding the product keeps on purpose, each with the
// elements it covers (a CSS selector, matched by the element or an ancestor; for a control covered, `by` names what may
// cover it) and the reason. Nothing else is ever left out: a finding without an entry here is a defect to fix where it
// comes from, never a test to loosen.
export interface Allowed {
  readonly kind: 'cut' | 'wrapped' | 'off-window' | 'covered' | 'english';
  readonly selector: string;
  readonly by?: string;
  readonly why: string;
}

export const ALLOWED: readonly Allowed[] = [
  {
    kind: 'covered',
    selector: '.frame-tabs',
    why: "the label of an element at the page's top stands above the page, fixed in the window, over the breakpoint tabs (nothing clips it there); the tab takes a press beside it, and the label hides once the page scrolls it out of view",
  },
  {
    kind: 'covered',
    selector: '.gradient__stop',
    by: '.gradient__stop',
    why: 'two stops a person put at one position of the gradient lie one over the other, as in every gradient editor: the one on top takes the press, and each is reached by Tab and edited in its stop fields',
  },
  {
    kind: 'english',
    selector: '.settings-default-message',
    why: "a form field's default validation message is the page's, in the language its messages are written in (the select above it, messages.locale), as the page's visitor will read it; never the editor's own text",
  },
];
