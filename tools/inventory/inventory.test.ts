// The source and the feature table held to each other (tools/inventory/generate.ts computes what the application is
// made of from the manifest and the source):
//   - a built feature whose commands no module registers claims code that does not exist;
//   - a module registering commands of a feature that is not built is code the app cannot reach;
//   - a command's declared owner is the module that registers it;
//   - the code a feature's tooth proof names (a feature with no commands of its own) runs only once it is built.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadManifest, REPO_ROOT } from '../manifest/load.ts';
import { generate } from './generate.ts';

const inventory = generate();
const loaded = loadManifest();

describe('the inventory', () => {
  it('has every built feature implemented by a module that registers its commands', () => {
    const unimplemented = inventory.features
      .filter((feature) => feature.built && feature.commands.length > 0)
      .filter((feature) => !inventory.modules.some((module) => module.commands.some((id) => feature.commands.includes(id))))
      .map((feature) => feature.id);
    expect(unimplemented).toEqual([]);
  });

  it('has no module registering commands of a feature that is not built', () => {
    const unreachable = inventory.features
      .filter((feature) => !feature.built)
      .flatMap((feature) => inventory.modules.filter((module) => module.features.includes(feature.id) && module.commands.length > 0).map((module) => `${module.path} registers commands of ${feature.id}`));
    expect(unreachable).toEqual([]);
  });

  it('names as each command\'s owner the module that registers it', () => {
    const moduleOf = new Map<string, string>();
    for (const module of inventory.modules) for (const id of module.commands) if (!moduleOf.has(id)) moduleOf.set(id, module.path);
    const declared = Object.entries(loaded.input.files)
      .filter(([file]) => file.startsWith('commands/'))
      .flatMap(([, data]) => ((data as { commands?: { id: string; owner: string }[] }).commands ?? []));
    const wrong = declared.filter((command) => moduleOf.has(command.id) && moduleOf.get(command.id) !== command.owner).map((command) => `${command.id} says ${command.owner}, ${moduleOf.get(command.id) ?? ''} registers it`);
    expect(wrong).toEqual([]);
  });

  it('runs the code of a feature with no commands of its own only once the feature is built', () => {
    const importsOf = (file: string): string[] => {
      const text = fs.readFileSync(path.join(REPO_ROOT, file), 'utf8');
      return [...text.matchAll(/from\s+'(\.{1,2}\/[^']+)'/g)].map((match) => path.posix.normalize(path.posix.join(path.posix.dirname(file), match[1] ?? '')));
    };
    const toothModules = Object.entries(loaded.input.files)
      .filter(([file]) => file.startsWith('features/'))
      .flatMap(([, data]) => ((data as { features?: { id: string; toothProof?: string }[] }).features ?? []).flatMap((feature) => (feature.toothProof === undefined ? [] : [[feature.id, feature.toothProof] as const])));
    const running = toothModules
      .filter(([id]) => inventory.features.find((feature) => feature.id === id)?.built === false)
      .flatMap(([id, module]) => inventory.modules.filter((one) => importsOf(one.path).includes(module)).map((one) => `${id}: ${one.path} imports ${module}`));
    expect(running).toEqual([]);
  });
});
