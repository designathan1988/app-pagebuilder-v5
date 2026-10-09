// The detectors a change reaches (the investigation's C2, option E): the groups of the model of the store
// (tools/runner/model/) and the mutants of the catalogue (tools/runner/mutants.ts). A mutant runs when the change
// touched the file it swaps a passage of, with the groups that detect it; a group runs when its module graph (static
// imports, from its test file) reaches a changed file; a change to the model, the catalogue or their run chooses them
// all. Every choice says why.
import fs from 'node:fs';
import path from 'node:path';
import { ALL_DETECTORS, MUTANTS, type Detector } from '../runner/mutants.ts';

export interface DetectorChoice {
  // each group chosen, with why
  readonly models: ReadonlyMap<Detector, readonly string[]>;
  // each mutant chosen, with why
  readonly mutants: ReadonlyMap<string, readonly string[]>;
}

const DETECTORS_THEMSELVES = [/^tools\/runner\/model\//, /^tools\/runner\/mutants(-run)?\.ts$/, /^tools\/test\//, /^vitest\.config\.ts$/];

// Pure: from the files changed and what each group's graph reaches, the groups and the mutants to run.
export function selectDetectors(files: readonly string[], reaches: (group: Detector, file: string) => boolean): DetectorChoice {
  const models = new Map<Detector, string[]>();
  const mutants = new Map<string, string[]>();
  const add = <K>(map: Map<K, string[]>, key: K, why: string) => {
    const held = map.get(key) ?? [];
    if (!held.includes(why)) held.push(why);
    map.set(key, held);
  };
  for (const file of files.map((one) => one.replaceAll('\\', '/'))) {
    if (DETECTORS_THEMSELVES.some((p) => p.test(file))) {
      for (const group of ALL_DETECTORS) add(models, group, `${file}: the detectors themselves changed`);
      for (const mutant of MUTANTS) add(mutants, mutant.id, `${file}: the detectors themselves changed`);
      continue;
    }
    for (const mutant of MUTANTS) {
      if (mutant.file !== file) continue;
      add(mutants, mutant.id, `it swaps a passage of ${file}`);
      for (const group of mutant.detectors) add(models, group, `${mutant.id} swaps a passage of ${file}, and ${group} detects it`);
    }
    for (const group of ALL_DETECTORS) if (reaches(group, file)) add(models, group, `its module graph reaches ${file}`);
  }
  return { models, mutants };
}

// ---- the module graph of each group, read from the disk (static relative imports, as tools/impact/sources.ts reads),
// the files an import.meta.glob of the graph takes (the manifest comes in by src/manifest/runtime.ts that way), and the
// files the graph's modules read from the disk by a path written in them (a fixture, the generated map: DEF-0569)
const IMPORT = /(?:import|export)\s(?!type\s)[^'"]*?from\s+['"](\.{1,2}\/[^'"]+)['"]|import\s+['"](\.{1,2}\/[^'"]+)['"]/g;
const GLOB = /import\.meta\.glob(?:<[^>]*>)?\(\s*['"](\.{1,2}\/[^'"]+)['"]/g;
// a path of the project written in a module, up to an interpolation in a template (manifest/features/fixtures/${…})
const DISK_PATH = /['"`]((?:manifest|src)\/[^'"`$\s]*)/g;
const posix = (file: string) => file.split(path.sep).join('/');
// a glob of Vite's (the project writes `*` and `{a,b}`) as a pattern of whole paths
function globPattern(glob: string): RegExp {
  // `**` crosses folders, `*` stays in one, `{a,b}` is either
  const part = (text: string) =>
    text
      .replace(/[.+^()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '[^/]*')
      .replace(/\{([^}]*)\}/g, (_whole, options: string) => `(?:${options.split(',').join('|')})`);
  return new RegExp(`^${glob.split('**').map(part).join('.*')}$`);
}
// the files of the disk an import.meta.glob takes: the folder before its first wildcard, walked
function globbed(glob: string): string[] {
  const base = glob.slice(0, glob.search(/[*{]/) < 0 ? glob.length : glob.search(/[*{]/)).replace(/[^/]*$/, '');
  const pattern = globPattern(glob);
  if (!fs.existsSync(base)) return [];
  return (fs.readdirSync(base, { recursive: true }) as string[]).map((one) => posix(path.join(base, one))).filter((one) => pattern.test(one));
}
interface Graph {
  readonly modules: ReadonlySet<string>;
  // the paths its modules read from the disk: a file, or a folder (a path that ends with /)
  readonly disk: readonly string[];
}
const graphs = new Map<Detector, Graph>();
function graphOf(group: Detector): Graph {
  const held = graphs.get(group);
  if (held !== undefined) return held;
  const seen = new Set<string>();
  const disk = new Set<string>();
  const queue = [`tools/runner/model/${group}.test.ts`];
  while (queue.length > 0) {
    const file = queue.pop() as string;
    if (seen.has(file)) continue;
    seen.add(file);
    // a file gone imports nothing
    const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    for (const m of text.matchAll(IMPORT)) queue.push(posix(path.normalize(path.join(path.dirname(file), m[1] ?? m[2] ?? ''))));
    for (const m of text.matchAll(GLOB)) queue.push(...globbed(posix(path.normalize(path.join(path.dirname(file), m[1] ?? '')))));
    if (file.startsWith('tools/')) for (const m of text.matchAll(DISK_PATH)) disk.add(m[1] ?? '');
  }
  const graph = { modules: seen, disk: [...disk].filter((one) => one !== '') };
  graphs.set(group, graph);
  return graph;
}
// the files a group reads from the disk that no path written in it names: the inventory scans every source file of
// src/ and compares manifest/generated/inventory.json, built from the manifest (tools/runner/model/inventory.test.ts);
// the lint loads the project's configuration and its rules (tools/runner/model/lint.test.ts); the catalogues' plurals
// and the browser's compatibility read every source file of src/ (i18n.test.ts, compat.test.ts)
const READ_FROM_DISK: Partial<Record<Detector, RegExp>> = {
  inventory: /^(src\/.*(?<!\.test)\.tsx?|manifest\/.*\.json)$/,
  lint: /^(src\/.*(?<!\.test)\.tsx?|eslint\.config\.js|tools\/lint\/.*\.ts)$/,
  manifest: /^manifest\/.*\.json$/,
  'ui-fit': /^(src\/.*\.css|src\/i18n\/locales\/.*\.json|manifest\/(commands\/.*|generated\/ui-widths)\.json)$/,
  i18n: /^src\/.*(?<!\.test)\.tsx?$/,
  compat: /^src\/.*(?<!\.test)\.tsx?$/,
};
export const graphReaches = (group: Detector, file: string): boolean => {
  const posixFile = file.replaceAll('\\', '/');
  const graph = graphOf(group);
  const read = graph.disk.some((one) => (one.endsWith('/') ? posixFile.startsWith(one) : posixFile === one));
  return graph.modules.has(posixFile) || read || (READ_FROM_DISK[group]?.test(posixFile) ?? false);
};
