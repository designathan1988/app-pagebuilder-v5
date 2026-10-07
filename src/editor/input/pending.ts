// The typing a field holds that no command has kept yet (CLAUDE.md, rules G1 and G2): one field at a time, with the
// context the typing began in. Every command the editor runs passes through the editor store's dispatch, gesture,
// sequence and command group (src/editor/store.ts), and every press through the pointer owner
// (input/pointer/events.ts); both ask here first, so no door, present or future, runs over a value typed and not kept:
// a handle dragged on the canvas, a tab of another breakpoint, a menu, a timer. The field's own commands (its Enter,
// its arrows, its unit menu, its Reset, its Escape) run in the context the typing began in instead of the one the
// editor shows now; what the person does inside the field — its values menu explored, its suggestions walked, the
// quick panel it lies in closed — leaves the typing as it is, as the field's own spec says (Escape returns to the
// draft; the panel's dismissal drops it).
import type { EditContext } from '../../core/store/store.ts';
import type { CommandId } from '../../generated/ids.ts';

export interface Typing {
  // the field typed in: its input or text area
  readonly field: HTMLElement;
  // where the field's own controls lie (its row: its step buttons, its unit menu, its label's scrub): a press there is
  // the field's own
  readonly region: HTMLElement;
  // the context the typing began in: the breakpoint and state, the class the Style tab targets, the keyframe
  readonly context: EditContext;
  // whether a command is the field's own: it keeps or cancels the typing itself
  readonly owns: (id: CommandId, args: Readonly<Record<string, unknown>>) => boolean;
  // keeps the typing now, through the store, in its context
  readonly keep: () => void;
}

let held: Typing | null = null;

// A field holds typing not kept yet: it is the one held, and a typing another field held is kept first.
export function holdTyping(typing: Typing): void {
  if (held !== null && held.field !== typing.field) keepTyping();
  held = typing;
}

// A field's typing was kept or cancelled.
export function releaseTyping(field: HTMLElement): void {
  if (held?.field === field) held = null;
}

// The typing held now, if any.
export const heldTyping = (): Typing | null => held;

// Keeps the typing held now, if any.
export function keepTyping(): void {
  const typing = held;
  if (typing === null) return;
  held = null;
  typing.keep();
}

// Whether a node is part of the typing's field: its row, or a layer a control of the row opens on the body (named by
// its aria-controls: the values menu its button controls, the suggestions list its combobox controls), as WAI-ARIA
// makes a menu button and its menu, or a combobox and its list, one widget.
function within(typing: Typing, node: Node): boolean {
  if (typing.region.contains(node)) return true;
  const controls = [typing.region, ...typing.region.querySelectorAll('[aria-controls]')];
  return controls.some((control) =>
    (control.getAttribute('aria-controls') ?? '').split(/\s+/).some((id) => id !== '' && document.getElementById(id)?.contains(node) === true),
  );
}

// A press begins (the pointer owner's first word on every press, src/editor/input/pointer/events.ts): the typing held
// is kept first, before the press measures anything it acts from (a handle's box, a drop's place), unless the press is
// on its own field (a step button, the unit menu, an item of its values menu), which keeps or steps it itself.
export function keepTypingBefore(target: EventTarget | null): void {
  const typing = held;
  if (typing === null) return;
  if (target instanceof Node && within(typing, target)) return;
  keepTyping();
}

// Before a command runs. The field's own runs in the context the typing began in (returned). One that changes the
// document keeps the typing first: the value typed goes before it, its undo step first. Any other asked from inside
// the field (the focus in it, its menu or its suggestions: a key that walks or closes them, the quick panel's Escape)
// leaves the typing as it is; asked from anywhere else, it keeps the typing first.
export function beforeCommand(id: CommandId, args: unknown, changesDocument: boolean): EditContext | undefined {
  const typing = held;
  if (typing === null) return undefined;
  if (typing.owns(id, (args ?? {}) as Readonly<Record<string, unknown>>)) return typing.context;
  const focused = document.activeElement;
  if (!changesDocument && focused !== null && within(typing, focused)) return undefined;
  keepTyping();
  return undefined;
}
