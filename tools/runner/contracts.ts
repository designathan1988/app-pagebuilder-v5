// The contract of every value field (the investigation's C5, option C): for each property and composite of the
// manifest, what its field reads and writes — the codec it names and whether a codec is registered under that id, the
// units and keywords it offers, the doors that write it, whether style.set reaches it (a door of style.set or of a
// number field writes it, or the composite it is a part of) and whether its value is structured (stored as layers,
// written by a command of its own) — and the step a number field moves by, from the manifest's constants. Read by the
// detectors only (tools/runner/model/fields.test.ts); the app reads the same facts where it needs them.
import { codecOf } from '../../src/core/style/codecs.ts';
import { factsOf } from '../../src/core/style/set.ts';
import { MODEL_RULES } from '../../src/editor/store.ts';
import { manifest } from '../../src/manifest/runtime.ts';

export interface FieldContract {
  readonly property: string;
  readonly kind: 'property' | 'composite';
  readonly codec: string;
  readonly registered: boolean;
  readonly units: readonly string[];
  readonly keywords: readonly string[];
  readonly doors: readonly string[];
  // a door of style.set or of a number field writes it (its own or its composite's): readValue reads what it is given
  readonly reachedByStyleSet: boolean;
  // its value is stored as layers and written by a command of its own (box-shadow: style.setShadows)
  readonly structured: boolean;
}

const READ_BY_VALUE = /^(style\.set|field\.(step|scrub|setUnit))#/;

export function fieldContracts(): readonly FieldContract[] {
  const out: FieldContract[] = [];
  const { properties } = manifest.properties as unknown as { properties: readonly { id: string; codec: string; doors?: readonly string[] }[] };
  const composites = ((manifest.properties as unknown as { composites?: readonly { id: string; codec: string; doors?: readonly string[] }[] }).composites ?? []);
  for (const [kind, list] of [['property', properties], ['composite', composites]] as const) {
    for (const entry of list) {
      const { units, keywords } = factsOf(entry.id, MODEL_RULES);
      const doors = entry.doors ?? [];
      out.push({
        property: entry.id,
        kind,
        codec: entry.codec,
        registered: codecOf(entry.codec) !== null,
        units,
        keywords,
        doors,
        reachedByStyleSet: doors.some((door) => READ_BY_VALUE.test(door)),
        structured: MODEL_RULES.structures.has(entry.id),
      });
    }
  }
  return out;
}

const constant = (id: string): number => {
  const value = manifest.interactions.constants.find((c) => c.id === id)?.value;
  if (typeof value !== 'number') throw new Error(`interactions.json has no number ${id}`);
  return value;
};
// what a number field steps by (interactions.json, the gesture number-field-keys)
export const STEP_FACTS = {
  step: constant('numberField.step'),
  pageStep: constant('numberField.pageStep'),
  shiftFactor: constant('numberField.shiftFactor'),
  altFactor: constant('numberField.altFactor'),
};

// the refusals the commands of the fields declare (their manifest entries' refusals and availability refusal keys)
export function fieldRefusalKeys(): readonly string[] {
  const keys = new Set<string>();
  for (const command of manifest.commands as unknown as readonly { id: string; refusals?: readonly string[]; availability: { refusalKey?: string | null } }[]) {
    if (!/^(style|field)\./.test(command.id)) continue;
    for (const key of command.refusals ?? []) keys.add(key);
    if (command.availability.refusalKey) keys.add(command.availability.refusalKey);
  }
  return [...keys];
}
