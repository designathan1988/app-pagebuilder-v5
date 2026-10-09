// The impact selector against the changes the verification measured (tools/impact/detectors.ts, MEC-04): a change of
// the manifest, which the app takes by import.meta.glob, chooses the groups that read it; a change of the generated
// map chooses the group that compares it; a change of a fixture chooses the groups whose harness reads it (DEF-0569).
import { describe, expect, it } from 'vitest';
import { graphReaches, selectDetectors } from '../../impact/detectors.ts';
import type { Detector } from '../mutants.ts';

const chosen = (file: string): readonly Detector[] => [...selectDetectors([file], graphReaches).models.keys()];

describe('o seletor de impacto', () => {
  it('escolhe os grupos que leem o que mudou: o manifesto, o mapa gerado e as fixtures', () => {
    const missing: string[] = [];
    const cases: readonly (readonly [string, readonly Detector[]])[] = [
      // drag.threshold makes the machine's table; the coalescing window, the history; the field step, the fields
      ['manifest/interactions.json', ['machine', 'history', 'fields', 'style']],
      ['manifest/commands/style.json', ['style', 'fields', 'history']],
      ['manifest/generated/behavior.json', ['machine']],
      ['manifest/generated/behavior.md', ['machine']],
      ['manifest/features/fixtures/aurora.json', ['history', 'races', 'storage', 'drafts', 'fields']],
      ['src/i18n/locales/pt-BR.json', ['i18n']],
    ];
    for (const [file, groups] of cases) {
      const got = chosen(file);
      for (const group of groups) if (!got.includes(group)) missing.push(`${file} não escolhe ${group} (escolhe ${got.join(', ') || 'nada'})`);
    }
    expect(missing, 'grupos que o seletor deixa de escolher').toEqual([]);
  });
});
