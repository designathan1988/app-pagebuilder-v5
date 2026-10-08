// The project's lint as a detector of the catalogue (the investigation's C6, option F): the file of the mutant under
// run (tools/runner/mutants.ts), with its passage swapped, goes through ESLint with the project's own configuration
// (ESLint#lintText with the file's path, ESLint 10.11), and every error the swapped text gets that the file on disk
// does not get is a finding. With no mutant, the files the lint's mutants swap are linted as they are and get none.
import fs from 'node:fs';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';
import { MUTANTS, mutatedSource } from '../mutants.ts';

const chosen = MUTANTS.find((m) => m.id === (process.env.BUILDER_MUTANT ?? ''));
const files = chosen === undefined ? [...new Set(MUTANTS.filter((m) => m.detectors.includes('lint')).map((m) => m.file))] : [chosen.file];

// the errors of a text, as rule and message, the place left out (a swapped passage moves the lines below it)
async function errorsOf(eslint: ESLint, file: string, text: string): Promise<string[]> {
  const [result] = await eslint.lintText(text, { filePath: file });
  return (result?.messages ?? []).filter((m) => m.severity === 2).map((m) => `${m.ruleId ?? 'parse'}: ${m.message}`);
}

describe('o lint do projeto sobre o arquivo do mutante', () => {
  it('o texto do arquivo não recebe erro que o arquivo em disco não recebe', async () => {
    const eslint = new ESLint();
    const found: string[] = [];
    for (const file of files) {
      const disk = fs.readFileSync(file, 'utf8');
      const before = await errorsOf(eslint, file, disk);
      expect(before, `${file} em disco tem erros de lint`).toEqual([]);
      const after = await errorsOf(eslint, file, mutatedSource(file, disk));
      found.push(...after.map((error) => `${file}: ${error}`));
    }
    expect(found, 'erros que o texto do mutante recebe').toEqual([]);
  }, 120_000);
});
