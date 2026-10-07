// The run's inputs (run-inputs.ts): one list of what the tests stand on, every root path placed in it or out of it, and
// a fingerprint of contents read from the disk alone (no version-control system is needed or asked).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { NOT_INPUTS, OUTPUTS, RUN_INPUTS, changedBetween, inputHashes, inputsFingerprint } from './run-inputs.ts';

describe('the run inputs', () => {
  it('place every root path of the project in the inputs, out of them, or among the tools\' outputs', () => {
    const roots = fs.readdirSync('.').filter((name) => !OUTPUTS.has(name));
    const placed = new Set([...RUN_INPUTS, ...NOT_INPUTS]);
    expect(roots.filter((root) => !placed.has(root))).toEqual([]);
    expect(RUN_INPUTS.filter((input) => NOT_INPUTS.includes(input))).toEqual([]);
  });

  it('keep their fingerprint when nothing a test runs changes, and say which input changed', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'run-inputs-'));
    try {
      fs.mkdirSync(path.join(root, 'src'));
      fs.mkdirSync(path.join(root, 'docs'));
      fs.mkdirSync(path.join(root, 'src', 'node_modules'));
      fs.writeFileSync(path.join(root, 'src', 'a.ts'), 'export const a = 1;\n');
      fs.writeFileSync(path.join(root, 'docs', 'notes.md'), 'one\n');
      const first = inputsFingerprint(root);
      const before = inputHashes(root);
      // a document, a note at the root and a package folder: nothing a test runs
      fs.writeFileSync(path.join(root, 'docs', 'notes.md'), 'two\n');
      fs.writeFileSync(path.join(root, 'NOTES.md'), 'a note\n');
      fs.writeFileSync(path.join(root, 'src', 'node_modules', 'x.js'), 'x\n');
      expect(inputsFingerprint(root)).toBe(first);
      expect(changedBetween(before, inputHashes(root))).toEqual([]);
      // an input changed, added and removed
      fs.writeFileSync(path.join(root, 'src', 'a.ts'), 'export const a = 2;\n');
      expect(inputsFingerprint(root)).not.toBe(first);
      expect(changedBetween(before, inputHashes(root))).toEqual(['src/a.ts']);
      fs.writeFileSync(path.join(root, 'src', 'b.ts'), 'export const b = 1;\n');
      expect(changedBetween(before, inputHashes(root))).toEqual(['src/a.ts', 'src/b.ts']);
      fs.rmSync(path.join(root, 'src', 'a.ts'));
      expect(changedBetween(before, inputHashes(root))).toEqual(['src/a.ts', 'src/b.ts']);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
