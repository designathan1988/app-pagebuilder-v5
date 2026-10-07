// What a change to the manifest or a catalogue touches, read from the two texts (the recorded and the current one), and
// which spec files use a file — import it, through the modules they import, or name it (a fixture, a data folder).
import fs from 'node:fs';
import path from 'node:path';

const parse = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

interface FeatureShape {
  readonly id: string;
  readonly scenarios?: readonly { readonly id: string }[];
}
// The scenarios ("<feature> › <scenario>") a features file adds or changes; every scenario of a feature whose own
// fields (its commands, what it depends on) changed.
export function changedScenarios(older: string, newer: string): ReadonlySet<string> {
  const features = (text: string) => ((parse(text) as { features?: FeatureShape[] } | null)?.features ?? []);
  const before = new Map(features(older).map((feature) => [feature.id, feature]));
  const out = new Set<string>();
  for (const feature of features(newer)) {
    const was = before.get(feature.id);
    const { scenarios = [], ...own } = feature;
    const { scenarios: wasScenarios = [], ...wasOwn } = was ?? { id: feature.id };
    const changedWhole = was === undefined || !same(own, wasOwn);
    const old = new Map(wasScenarios.map((s) => [s.id, s]));
    for (const s of scenarios) if (changedWhole || !same(s, old.get(s.id))) out.add(`${feature.id} › ${s.id}`);
  }
  return out;
}

interface CommandShape {
  readonly id: string;
  readonly entryPoints?: readonly { readonly id: string }[];
}
// The doors ("<command>#<door>") a commands file adds, changes or removes; every door of a command whose own fields
// changed (its arguments, its availability, its history).
export function changedDoors(older: string, newer: string): ReadonlySet<string> {
  const commands = (text: string) => ((parse(text) as { commands?: CommandShape[] } | null)?.commands ?? []);
  const before = new Map(commands(older).map((command) => [command.id, command]));
  const after = new Map(commands(newer).map((command) => [command.id, command]));
  const out = new Set<string>();
  for (const id of new Set([...before.keys(), ...after.keys()])) {
    const was = before.get(id);
    const is = after.get(id);
    const { entryPoints: wasDoors = [], ...wasOwn } = was ?? { id };
    const { entryPoints: doors = [], ...own } = is ?? { id };
    const whole = was === undefined || is === undefined || !same(own, wasOwn);
    const old = new Map(wasDoors.map((door) => [door.id, door]));
    const now = new Map(doors.map((door) => [door.id, door]));
    for (const door of new Set([...old.keys(), ...now.keys()])) if (whole || !same(old.get(door), now.get(door))) out.add(`${id}#${door}`);
  }
  return out;
}

// The message keys a catalogue changes the words of, or removes.
export function changedKeys(older: string, newer: string): ReadonlySet<string> {
  const before = (parse(older) ?? {}) as Record<string, unknown>;
  const after = (parse(newer) ?? {}) as Record<string, unknown>;
  return new Set(Object.keys(before).filter((key) => !same(before[key], after[key])));
}

// ---- the spec files that use a file
const SPECS = 'tests/e2e';
const IMPORT = /(?:import|export)\s(?!type\s)[^'"]*?from\s+['"](\.{1,2}\/[^'"]+)['"]|import\s+['"](\.{1,2}\/[^'"]+)['"]/g;
const posix = (file: string) => file.split(path.sep).join('/');
let importsOf: Map<string, readonly string[]> | null = null;
function imports(file: string): readonly string[] {
  importsOf ??= new Map();
  const held = importsOf.get(file);
  if (held !== undefined) return held;
  let text = '';
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    // a file gone imports nothing
  }
  const found = [...text.matchAll(IMPORT)].map((m) => posix(path.normalize(path.join(path.dirname(file), m[1] ?? m[2] ?? ''))));
  importsOf.set(file, found);
  return found;
}
function reaches(from: string, target: string, seen = new Set<string>()): boolean {
  if (from === target) return true;
  if (seen.has(from)) return false;
  seen.add(from);
  return imports(from).some((next) => reaches(next, target, seen));
}
export function usersOf(file: string): readonly string[] {
  const specs = fs
    .readdirSync(SPECS)
    .filter((name) => name.endsWith('.spec.ts'))
    .map((name) => `${SPECS}/${name}`);
  // a data file a spec names: a fixture by its name, a support folder or file by its path
  const fixture = /^manifest\/features\/fixtures\/(.+)\.json$/.exec(file)?.[1];
  const names = fixture === undefined ? [file] : [`fixtures/${fixture}.json`, `'${fixture}'`];
  return specs.filter((spec) => reaches(spec, file) || names.some((name) => fs.readFileSync(spec, 'utf8').includes(name)));
}
