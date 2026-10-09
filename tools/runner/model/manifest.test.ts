// The manifest's own checker (the investigation's C1): the whole of manifest/, at its current state on the disk,
// passes with no problem — every JSON file of the directory is a file the checker knows, the two generated artifacts
// of the behaviour map and of the inventory among them (DEF-0518), and every rule the checker ties the files with.
// loadManifest reads manifest/ from the disk, so a file that enters the directory without an entry in the checker's
// list (src/manifest/check/base.ts, SINGLE_FILES) is reported and fails this detector.
import { describe, expect, it } from 'vitest';
import { checkManifest } from '../../../src/manifest/check.ts';
import { loadManifest } from '../../manifest/load.ts';

describe('o verificador do manifesto', () => {
  it('o manifest/ inteiro passa: todo arquivo do diretório é um que o verificador conhece', () => {
    const loaded = loadManifest();
    const result = checkManifest(loaded.input);
    const problems = [...loaded.problems, ...result.problems].map((p) => `${p.rule} ${p.file}${p.path === '' ? '' : ` › ${p.path}`}: ${p.message}`);
    expect(problems, 'problemas do verificador do manifesto').toEqual([]);
  });
});
