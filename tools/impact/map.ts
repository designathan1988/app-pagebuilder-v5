// The impact selector's map: what each browser test executed (its source lines, the stylesheet rules it used, the
// messages it showed: tests/support/coverage.ts), and the run's inputs as they stood when it was recorded (their
// hashes, and the text of the ones whose lines and entries a change is read against). A change is the difference
// between the inputs now and those of the record, read on the disk alone (no version-control system); the lines a test
// ran are the record's own, so the change's lines are read against the record's text too.
import fs from 'node:fs';
import path from 'node:path';
import { COVERAGE_DIR } from '../../tests/support/coverage.ts';
import { inputFiles, inputHashes } from '../runner/run-inputs.ts';
import type { Lines } from './diff.ts';
import type { Executed } from './select.ts';

export const IMPACT_DIR = path.join('.cache', 'impact');
export const SNAPSHOT_FILE = path.join(IMPACT_DIR, 'snapshot.json');

// the inputs whose text a change is read against: sources, stylesheets, catalogues, the manifest (but its generated
// tables, read whole) and the tests
const TEXT = /^(src|tests|tools|manifest)\/.*\.(ts|tsx|mjs|css|json|html)$/;
const kept = (file: string) => TEXT.test(file) && !file.startsWith('manifest/generated/');

export interface Snapshot {
  readonly at: string;
  readonly hashes: Readonly<Record<string, string>>;
  readonly texts: Readonly<Record<string, string>>;
  // whether the browser tests' coverage was recorded with it (the map is then the one in COVERAGE_DIR)
  readonly coverage: boolean;
}

export function takeSnapshot(root: string = process.cwd()): Omit<Snapshot, 'at' | 'coverage'> {
  const hashes = Object.fromEntries(inputHashes(root));
  const texts = Object.fromEntries(inputFiles(root).filter(kept).map((file) => [file, fs.readFileSync(path.join(root, file), 'utf8')]));
  return { hashes, texts };
}

export function writeSnapshot(snapshot: Omit<Snapshot, 'at' | 'coverage'>, coverage: boolean, file: string = SNAPSHOT_FILE): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ at: new Date().toISOString(), coverage, ...snapshot } satisfies Snapshot));
}

export function readSnapshot(file: string = SNAPSHOT_FILE): Snapshot | null {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as Snapshot;
  } catch {
    return null;
  }
}

interface Recorded {
  readonly test: string;
  readonly lines: Readonly<Record<string, Lines>>;
  readonly selectors: readonly string[];
  readonly keys?: readonly string[];
}

// The map recorded beside the snapshot, by test id; null when none was.
export function readMap(snapshot: Snapshot | null, dir: string = COVERAGE_DIR): ReadonlyMap<string, Executed> | null {
  if (snapshot === null || !snapshot.coverage || !fs.existsSync(dir)) return null;
  const map = new Map<string, Executed>();
  for (const name of fs.readdirSync(dir)) {
    const record = JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8')) as Recorded;
    map.set(record.test, { lines: record.lines, selectors: record.selectors, keys: record.keys ?? [] });
  }
  return map;
}
