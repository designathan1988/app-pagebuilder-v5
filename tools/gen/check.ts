// npm run gen:check: the generated files are what the generator writes now. It reads them before it writes, runs the
// generator, and fails when any of them changed (a file edited by hand, or stale because a source moved: a package, the
// manifest) or when src/generated/ holds a file the generator does not write. The files are left as the generator wrote
// them: a deliberate change belongs in the generator or in its sources.
import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from '../manifest/load.ts';
import { GENERATED_DIR, generate } from './generate.ts';
import { TYPES_DIR } from './types.ts';
import { ICON_SPRITE } from './icons.ts';
import { packageVersion } from './versions.ts';

const at = (file: string) => path.join(REPO_ROOT, file);
const read = (file: string): string | null => (fs.existsSync(at(file)) ? fs.readFileSync(at(file), 'utf8') : null);
const filesIn = (dir: string) => (fs.existsSync(at(dir)) ? fs.readdirSync(at(dir)).map((name) => `${dir}/${name}`) : []);

// the header of a generated table names the package versions it was generated from: say which one moved
const stale: string[] = [];
for (const file of filesIn(GENERATED_DIR)) {
  const header = (JSON.parse(read(file) ?? '{}') as { $generated?: { from?: Record<string, string> } }).$generated;
  for (const [pkg, version] of Object.entries(header?.from ?? {})) {
    const installed = packageVersion(pkg);
    if (installed !== version) stale.push(`${file} was generated from ${pkg} ${version}; ${installed} is installed`);
  }
}

const before = new Map([...filesIn(GENERATED_DIR), ...filesIn(TYPES_DIR), ICON_SPRITE].map((file) => [file, read(file)]));
const written = await generate();
const changed = written.filter((file) => before.get(file) !== read(file));
// a file in src/generated/ that the generator does not write is hand-made
const handMade = filesIn(TYPES_DIR).filter((file) => !written.includes(file));

if (changed.length === 0 && handMade.length === 0) {
  console.log(`gen:check: ${written.join(', ')} are up to date.`);
  process.exit(0);
}
for (const line of stale) console.log(`✗ ${line}`);
for (const file of changed) console.log(`✗ ${file} differs from what the generator writes (it now holds the generator's version)`);
for (const file of handMade) console.log(`✗ ${file} is not written by npm run gen: src/generated/ holds only generated files`);
console.log('gen:check FAILED: a generated file is written by npm run gen alone; a deliberate change belongs in the generator or in its sources.');
process.exit(1);
