// The number fields' commands (spec inspector-number-fields): the arithmetic of a
// numeric field of the inspector, which the field component draws (src/editor/shell/field.tsx). Each takes the field's
// property and the text the field holds (`value`, what the person sees or typed), works out the new value and writes
// it through style.set's one writer (`writeStyle` of src/core/style/set.ts): the same refusals (a locked element), one
// transaction, the status bar naming the value.
//  - field.step: ArrowUp/ArrowDown and the step buttons step by numberField.step, PageUp/PageDown by
//    numberField.pageStep; Shift multiplies a step by numberField.shiftFactor, Alt by numberField.altFactor (the
//    gesture number-field-keys, interactions.json). Presses in a row on the same field and property, each within
//    numberField.stepBurstWindow of the previous one, are one undo step (the manifest's history.coalesce; Problems
//    in Pager 4).
//  - field.scrub: the label dragged horizontally, round(distance / numberField.scrubPixelsPerStep) steps from the value
//    the field held at the press, with the same multipliers (the gesture number-scrub); the pointer owner runs the
//    whole drag as one gesture, so a scrub is one undo step, and Escape cancels it (drag.cancel).
//  - field.setUnit: a keyword the property offers is written as it is; a length is converted to the unit chosen when it
//    keeps its size without measuring the page (convertLength of the codecs), else refused with
//    status.value.unitNotConverted.
//  - field.cancel: Escape in the field puts back the value the document holds (the field shows it again after every
//    message); nothing is written.
// A step or a scrub never takes a length below zero where the browser refuses a negative value (Width, Height: the
// CSS support port). A font-relative unit (em, rem…: FINE_STEP_UNITS of the codecs) moves by numberField.fineStep a
// step, any other by the step itself; a field that holds no number to step (a keyword, calc()) says so
// (status.value.notSteppable) and writes nothing. An empty field steps from the value it shows (its placeholder): the
// value the elements hold at the layer written, else the one the page computes for them, when they share it; nothing
// when they do not, or when the page draws none. The rule lives here, once, for every door of the step, the scrub and
// the unit (the step buttons, the arrows, the wheel, the label, the unit menu): each door hands the text the field
// holds, typed or empty (CLAUDE.md, rule G3).
import { message, registerHandler, type HandlerContext, type Outcome } from '../../core/commands/registry.ts';
import { locate, type NodeId } from '../../core/document/model.ts';
import { storedValue } from '../../core/style/stored.ts';
import type { ModelRules } from '../../core/document/validate.ts';
import { convertLength, FINE_STEP_UNITS } from '../../core/style/codecs.ts';
import { propertyName, readValue, writeStyle, writeValue } from '../../core/style/set.ts';
import type { ConstantId } from '../../generated/ids.ts';
import { manifest } from '../../manifest/runtime.ts';

function constant(id: ConstantId): number {
  const value = manifest.interactions.constants.find((c) => c.id === id)?.value;
  if (typeof value !== 'number') throw new Error(`interactions.json has no number ${id}`);
  return value;
}
const STEP = constant('numberField.step');
const PAGE_STEP = constant('numberField.pageStep');
const SHIFT_FACTOR = constant('numberField.shiftFactor');
const ALT_FACTOR = constant('numberField.altFactor');
const SCRUB_PIXELS_PER_STEP = constant('numberField.scrubPixelsPerStep');
const FINE_STEP = constant('numberField.fineStep');

// The factor the key held with a step or a scrub gives it: Shift ×10, Alt ×0.1, none ×1.
export function factorOf(modifier: 'Shift' | 'Alt' | undefined): number {
  return modifier === 'Shift' ? SHIFT_FACTOR : modifier === 'Alt' ? ALT_FACTOR : 1;
}

// What a step or a scrub starts from: the text the field holds; an empty field, the value it shows — what the elements
// hold at the layer written, else what the page computes for them — when they all share it (rule G3).
function startOf<Ui>(context: HandlerContext<Ui>, property: string, value: string): string {
  if (value.trim() !== '') return value;
  const { state } = context;
  const shown = new Set(
    state.selection.map((id) => {
      const found = locate(state.document, id as NodeId);
      return found === null ? '' : (storedValue(found.node, property, context.rules) ?? context.layout.computed(id as NodeId, property) ?? '');
    }),
  );
  return shown.size === 1 ? ([...shown][0] ?? '') : '';
}

// The length the field holds moved by `delta` of its own unit, written into the selection; nothing for a field that
// holds no length. Below zero it stops at zero where the browser takes no negative value.
function moved<Ui>(context: HandlerContext<Ui>, property: string, typed: string, delta: number): Outcome<Ui> {
  const value = startOf(context, property, typed);
  if (value.trim() === '') return { kind: 'change' };
  const read = readValue(context, property, value);
  if (read === null || read.value.kind !== 'length') return { kind: 'refused', message: message('status.value.notSteppable', { property: propertyName(property, context.rules), value: value.trim() }) };
  const unit = read.value.unit;
  const next = read.value.number + delta * (FINE_STEP_UNITS.has(unit) ? FINE_STEP : 1);
  const nextCss = writeValue(property, { kind: 'length', number: next, unit }, context.rules);
  const floor = writeValue(property, { kind: 'length', number: 0, unit }, context.rules);
  const css = nextCss !== null && next < 0 && !context.css.supports(property, nextCss) ? floor : nextCss;
  return css === null ? { kind: 'change' } : writeStyle(context, property, css);
}

export const stepField = registerHandler('field.step', (context, { property, value, direction, size, modifier }) => {
  const delta = (size === 'page' ? PAGE_STEP : STEP) * factorOf(modifier) * (direction === 'up' ? 1 : -1);
  return moved(context, property, value, delta);
});

export const scrubField = registerHandler('field.scrub', (context, { property, value, distance, modifier }) => {
  const delta = Math.round(distance / SCRUB_PIXELS_PER_STEP) * STEP * factorOf(modifier);
  return moved(context, property, value, delta);
});

export const setFieldUnit = registerHandler('field.setUnit', (context, { property, value, unit }) => {
  const refused = { kind: 'refused', message: message('status.value.unitNotConverted', { unit }) } as const;
  const chosen = readValue(context, property, unit);
  // a keyword of the property (auto, min-content…) is its own value
  if (chosen?.value.kind === 'keyword') return writeStyle(context, property, chosen.css);
  // an empty field converts the value it shows, by the same rule as a step (startOf: DEF-0552, rule G3)
  const read = readValue(context, property, startOf(context, property, value));
  if (read === null || read.value.kind !== 'length') return refused;
  const converted = measuredConversion(context, property, read.value, unit);
  const css = converted === null ? null : writeValue(property, { kind: 'length', number: converted, unit }, context.rules);
  // the converted length must be one the property offers and the browser takes (read again as typed)
  const again = css === null ? null : readValue(context, property, css);
  return again === null ? refused : writeStyle(context, property, again.css);
});

// A length in another unit, the same size, for the units the page measures (the user's real-use audit, item 5.3): rem
// is the root's font size, and em and % — on a font size, where both are relative to what the parent computes — the
// parent's; the port measures them (Layout.fontPx), so the size on the page does not change. The value converted may
// itself stand on those (a length in rem becomes em through the pixels it is). null for a unit or a property the page
// does not measure (a width in % needs the parent's width, which the audit does not ask for yet).
// The property the manifest names the font size (the one em and % on it stand on: what its parent computes), read
// from the manifest's own label rather than written by hand
function fontProperty(rules: ModelRules): string | null {
  for (const [id, facts] of rules.propertyFacts) if (facts.labelKey === 'property.fontSize') return id;
  return null;
}

function measuredConversion<Ui>(context: HandlerContext<Ui>, property: string, value: { readonly number: number; readonly unit: string }, to: string): number | null {
  if (to !== 'rem' && to !== 'em' && to !== '%') return convertLength(value, to);
  // zero is zero in every unit and needs no page to measure (convertLength's own rule)
  if (value.number === 0) return 0;
  if (to !== 'rem' && property !== fontProperty(context.rules)) return null;
  const node = context.state.selection[0] === undefined ? null : locate(context.state.document, context.state.selection[0]);
  const root = context.layout.fontPx(null);
  const parent = node?.parent ?? null;
  const parentFont = parent === null ? null : context.layout.fontPx(parent.id as NodeId);
  // what the value is in page pixels: px itself, rem through the root, em through the parent's font size
  const own = value.unit === 'px' ? value.number : value.unit === 'rem' ? (root === null ? null : value.number * root) : value.unit === 'em' ? (parentFont === null ? null : value.number * parentFont) : null;
  if (own === null) return null;
  if (to === 'rem') return root === null || root === 0 ? null : own / root;
  // a percentage is hundredths of what it stands on
  const ratio = parentFont === null || parentFont === 0 ? null : own / parentFont;
  return ratio === null ? null : to === '%' ? ratio * 100 : ratio;
}

export const cancelField = registerHandler('field.cancel', ({ state, rules }, { property }) => {
  const primary = state.selection[0] === undefined ? null : locate(state.document, state.selection[0]);
  if (!primary) return { kind: 'change' };
  return { kind: 'change', message: message('status.field.cancelled', { property: propertyName(property, rules), name: primary.node.name }) };
});
