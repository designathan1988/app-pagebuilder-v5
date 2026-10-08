// What a file starts that ends some other way than the lint's builder/listener-scope can see, each with why (the key
// is the rule's: the file, what is started, and its place among the same in that file): a handler installed once for
// the page's life, a timer closed by another file of the same owner. Nothing that a component starts and leaves
// behind when it goes is ever listed here: it is a defect (auditoria/defeitos.md).
export interface AllowedListener {
  readonly key: string;
  readonly reason: string;
}

export const LISTENER_ALLOWED: readonly AllowedListener[] = [
  {
    key: "src/editor/errors.ts|target.addEventListener('error')|1",
    reason: 'the incident feed of the page: installed once at start (src/main.tsx, installErrorFeed) for the life of the page, which ends with it',
  },
  {
    key: "src/editor/errors.ts|target.addEventListener('unhandledrejection')|1",
    reason: 'the incident feed of the page: installed once at start (src/main.tsx, installErrorFeed) for the life of the page, which ends with it',
  },
  {
    key: 'src/editor/input/pointer/events.ts|setInterval|1',
    reason: "the repeat of a held control: its handle is kept in the pointer owner's state (ps.repeating.timer) and stopRepeating (input/pointer/panels.ts) clears it on the release, on a cancel and when the owner is disposed (input/pointer.ts calls onCancel)",
  },
];
