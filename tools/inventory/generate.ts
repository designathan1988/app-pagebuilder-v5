// The inventory: what the application is made of, derived from the manifest and the source, never written by hand:
// which feature owns which commands and doors, which module registers them (the owner of a concept is the module that
// registers its commands), and how many scenarios each feature carries. It is computed in memory: the unit test beside
// it holds the source and the feature table to each other (tools/inventory/inventory.test.ts), and the impact selector
// reads which modules implement each feature (tools/impact/).
import fs from 'node:fs';
import path from 'node:path';
import { isRegistered } from '../../src/core/commands/registry.ts';
import { FEATURES } from '../../src/app/features.ts';
import { loadManifest, registrationsIn, REPO_ROOT } from '../manifest/load.ts';

interface FeatureRow {
  readonly id: string;
  readonly built: boolean;
  readonly commands: readonly string[];
  readonly doors: number;
  readonly scenarios: number;
  readonly modules: readonly string[];
}
interface ModuleRow {
  readonly path: string;
  readonly lines: number;
  readonly commands: readonly string[];
  readonly features: readonly string[];
}
export interface Inventory {
  readonly totals: {
    readonly features: number;
    readonly built: number;
    readonly commands: number;
    readonly doors: number;
    readonly scenarios: number;
    readonly modules: number;
    readonly lines: number;
  };
  readonly features: readonly FeatureRow[];
  readonly modules: readonly ModuleRow[];
}

// every .ts/.tsx under src/, its line count, and the ids it registers
function sourceModules(): { path: string; lines: number; registers: readonly string[] }[] {
  const out: { path: string; lines: number; registers: readonly string[] }[] = [];
  const walk = (dir: string): void => {
    for (const entry of fs.readdirSync(path.join(REPO_ROOT, dir), { withFileTypes: true })) {
      const rel = path.posix.join(dir, entry.name);
      if (entry.isDirectory()) walk(rel);
      else if (/\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) {
        const text = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8');
        out.push({ path: rel, lines: text.split('\n').length, registers: registrationsIn(text).filter((one) => one.kind === 'handler').map((one) => one.id) });
      }
    }
  };
  walk('src');
  return out;
}

export function generate(): Inventory {
  const loaded = loadManifest();
  const modules = sourceModules();
  const moduleOf = new Map<string, string>();
  for (const module of modules) for (const id of module.registers) if (!moduleOf.has(id)) moduleOf.set(id, module.path);

  // the manifest's own files: commands (with their doors) and features (with their commands and scenarios)
  const commandFiles = Object.entries(loaded.input.files).filter(([file]) => file.startsWith('commands/'));
  const commands = commandFiles.flatMap(([, data]) => {
    const list = (data as { commands?: unknown } | null)?.commands;
    return Array.isArray(list) ? (list as { id: string; entryPoints: readonly { id: string }[] }[]) : [];
  });
  const commandById = new Map(commands.map((command) => [command.id, command]));
  const featureFiles = Object.entries(loaded.input.files).filter(([file]) => file.startsWith('features/'));
  const features = featureFiles.flatMap(([, data]) => {
    const list = (data as { features?: unknown } | null)?.features;
    return Array.isArray(list) ? (list as { id: string; commands: readonly string[]; scenarios: readonly unknown[] }[]) : [];
  });
  const featureRows: FeatureRow[] = [];
  for (const feature of features) {
    const modules = new Set<string>();
    for (const id of feature.commands) {
      const module = moduleOf.get(id);
      if (module !== undefined) modules.add(module);
    }
    const doors = feature.commands.reduce((sum, id) => sum + (commandById.get(id)?.entryPoints.length ?? 0), 0);
    featureRows.push({
      id: feature.id,
      built: isRegistered(FEATURES[feature.id as keyof typeof FEATURES] ?? { id: feature.id }),
      commands: [...feature.commands],
      doors,
      scenarios: feature.scenarios.length,
      modules: [...modules].sort(),
    });
  }

  const featuresOfModule = new Map<string, string[]>();
  for (const feature of featureRows) for (const module of feature.modules) featuresOfModule.set(module, [...(featuresOfModule.get(module) ?? []), feature.id]);
  const moduleRows: ModuleRow[] = modules
    .map((module) => ({ path: module.path, lines: module.lines, commands: module.registers, features: (featuresOfModule.get(module.path) ?? []).sort() }))
    .sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));

  const totals = {
    features: featureRows.length,
    built: featureRows.filter((one) => one.built).length,
    commands: commands.length,
    doors: commands.reduce((sum, command) => sum + command.entryPoints.length, 0),
    scenarios: featureRows.reduce((sum, one) => sum + one.scenarios, 0),
    modules: moduleRows.length,
    lines: moduleRows.reduce((sum, one) => sum + one.lines, 0),
  };
  return { totals, features: featureRows, modules: moduleRows };
}
